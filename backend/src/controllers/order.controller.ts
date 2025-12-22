import { Request, Response } from "express";
import Order from "../models/order.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { getErrorMessage } from "../utils/errorHandler";

// Type for order item in request body
interface OrderItemInput {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  img?: string;
}

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, items, subtotal, shippingCost, tax, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "No order items" });
      return;
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.street) {
      res.status(400).json({ message: "Shipping address is required" });
      return;
    }

    if (!req.user?._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Create the order
    const order = await Order.create({
      userId: req.user._id,
      shippingAddress,
      items: items.map((item: OrderItemInput) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "M",
        color: item.color || "Standard",
        image: item.image || item.img,
      })),
      subtotal: subtotal || items.reduce((sum: number, item: OrderItemInput) => sum + (item.price * item.quantity), 0),
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      totalAmount,
      paymentMethod: paymentMethod || "Razorpay",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
    });

    res.status(201).json({ 
      success: true, 
      order,
      message: "Order created successfully"
    });
  } catch (error: unknown) {
    res.status(500).json({ message: "Order creation failed", error: getErrorMessage(error) });
  }
};

/**
 * @desc    Get all orders for current user
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user?._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:orderId
 * @access  Private
 */
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user?._id,
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:orderId/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, trackingId } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = status || order.status;
    order.trackingId = trackingId || order.trackingId;

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

/**
 * @desc    Update payment status
 * @route   PUT /api/orders/:orderId/payment
 * @access  Private
 */
export const updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user?._id,
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.paymentStatus = paymentStatus;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Payment status updated",
      order: updatedOrder,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:orderId/cancel
 * @access  Private
 */
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user?._id,
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Only allow cancellation if order is still processing
    if (order.status !== "Processing") {
      res.status(400).json({ message: "Cannot cancel order that has been shipped or delivered" });
      return;
    }

    order.status = "Cancelled";
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};