import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controllers";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem,
} from "../controllers/wishlist.controller";
import { protect, admin } from "../middleware/auth.middleware";

const router = Router();

//  PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

//  PROTECTED ROUTES 
// Profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Addresses
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.put("/addresses/:addressId/default", protect, setDefaultAddress);

// Wishlist
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist", protect, clearWishlist);
router.delete("/wishlist/:itemId", protect, removeFromWishlist);
router.get("/wishlist/check/:productId", protect, checkWishlistItem);

// ============ ADMIN ROUTES ============
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;