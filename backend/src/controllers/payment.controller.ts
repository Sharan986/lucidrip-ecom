import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model";
import { AuthRequest } from "../middleware/auth.middleware";

// Lazy initialize Razorpay to ensure env vars are loaded
let razorpay: Razorpay | null = null;

const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpay;
};

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: "Invalid amount" });
      return;
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paisa
      currency: "INR",
      receipt: orderId || `receipt_${Date.now()}`,
    };

    const razorpayOrder = await getRazorpay().orders.create(options) as {
      id: string;
      amount: number;
      currency: string;
    };

    res.status(200).json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error: any) {
    console.error("Create Razorpay Order Error:", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

/**
 * @desc    Verify Razorpay payment and update order
 * @route   POST /api/payment/verify
 * @access  Private
 */
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: "Missing payment verification data" });
      return;
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      res.status(400).json({ success: false, message: "Payment verification failed - Invalid signature" });
      return;
    }

    // Payment is verified - Update order
    if (orderId) {
      const order = await Order.findById(orderId);
      
      if (order) {
        order.paymentStatus = "Paid";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paidAt = new Date();
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

/**
 * @desc    Get payment status for an order
 * @route   GET /api/payment/status/:orderId
 * @access  Private
 */
export const getPaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user?._id,
    }).select("paymentStatus razorpayPaymentId paidAt");

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({
      paymentStatus: order.paymentStatus,
      paymentId: order.razorpayPaymentId,
      paidAt: order.paidAt,
    });
  } catch (error: any) {
    console.error("Get Payment Status Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Handle Razorpay webhook
 * @route   POST /api/payment/webhook
 * @access  Public (Razorpay calls this)
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.log("Webhook secret not configured");
      res.status(200).json({ received: true });
      return;
    }

    // Verify webhook signature
    const signature = req.headers["x-razorpay-signature"] as string;
    const body = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      res.status(400).json({ message: "Invalid webhook signature" });
      return;
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different webhook events
    switch (event) {
      case "payment.captured":
        const paymentEntity = payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        
        // Find and update order
        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== "Paid") {
          order.paymentStatus = "Paid";
          order.razorpayPaymentId = paymentEntity.id;
          order.paidAt = new Date();
          await order.save();
          console.log(`Order ${order.orderNumber} marked as paid via webhook`);
        }
        break;

      case "payment.failed":
        const failedPayment = payload.payment.entity;
        const failedOrder = await Order.findOne({ razorpayOrderId: failedPayment.order_id });
        if (failedOrder) {
          failedOrder.paymentStatus = "Failed";
          await failedOrder.save();
          console.log(`Order ${failedOrder.orderNumber} payment failed via webhook`);
        }
        break;

      case "refund.created":
        const refundPayment = payload.refund.entity;
        const refundOrder = await Order.findOne({ razorpayPaymentId: refundPayment.payment_id });
        if (refundOrder) {
          refundOrder.paymentStatus = "Refunded";
          await refundOrder.save();
          console.log(`Order ${refundOrder.orderNumber} refunded via webhook`);
        }
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
