import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
} from "../controllers/order.controller";
import { protect, admin } from "../middleware/auth.middleware";

const router = Router();

// Protected routes (requires authentication)
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderId", protect, getOrderById);
router.put("/:orderId/payment", protect, updatePaymentStatus);
router.put("/:orderId/cancel", protect, cancelOrder);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.put("/:orderId/status", protect, admin, updateOrderStatus);

export default router;