import { Router } from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentStatus,
  handleWebhook,
} from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";
import express from "express";

const router = Router();

// Protected routes (requires authentication)
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.get("/status/:orderId", protect, getPaymentStatus);

// Webhook route (public - called by Razorpay)
// Note: This needs raw body for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
