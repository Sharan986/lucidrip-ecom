import { Router } from "express";
import {
  adminLogin,
  getDashboardStats,
  getAnalytics,
  getAllCustomers,
  getAdminProducts,
  getCustomerById,
  getPayments,
} from "../controllers/admin.controller";
import { protect, admin } from "../middleware/auth.middleware";

const router = Router();

// Public admin route (no protection)
router.post("/login", adminLogin);

// All other admin routes require authentication and admin role
router.use(protect, admin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Analytics
router.get("/analytics", getAnalytics);

// Customers
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);

// Products (admin view)
router.get("/products", getAdminProducts);

// Payments
router.get("/payments", getPayments);

export default router;
