import { Router } from "express";
import { 
  getAllProducts, 
  createProduct, 
  seedProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from "../controllers/product.controllers"; 
import { protect, admin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllProducts); 
router.get("/:slug", getProductBySlug); 

// Admin protected routes
router.post("/", protect, admin, createProduct);
router.post("/seed", protect, admin, seedProducts); 
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;

