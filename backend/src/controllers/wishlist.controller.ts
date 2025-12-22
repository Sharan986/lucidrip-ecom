import { Response } from "express";
import User, { IWishlistItem } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * @desc    Get wishlist for current user
 * @route   GET /api/users/wishlist
 * @access  Private
 */
export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select("wishlist");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error: any) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/users/wishlist
 * @access  Private
 */
export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, name, price, img, slug, size, color } = req.body;

    // Validate required fields
    if (!productId || !name || !price || !img || !slug) {
      res.status(400).json({ message: "Please provide all required product details" });
      return;
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if item already in wishlist
    const existingItem = user.wishlist.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      res.status(400).json({ message: "Item already in wishlist" });
      return;
    }

    const newItem: IWishlistItem = {
      productId,
      name,
      price,
      img,
      slug,
      size,
      color,
      addedAt: new Date(),
    };

    user.wishlist.push(newItem);
    await user.save();

    res.status(201).json({
      message: "Item added to wishlist",
      item: user.wishlist[user.wishlist.length - 1],
    });
  } catch (error: any) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/users/wishlist/:itemId
 * @access  Private
 */
export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const itemIndex = user.wishlist.findIndex(
      (item) => item._id?.toString() === itemId || item.productId === itemId
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found in wishlist" });
      return;
    }

    user.wishlist.splice(itemIndex, 1);
    await user.save();

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error: any) {
    console.error("Remove from Wishlist Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/users/wishlist
 * @access  Private
 */
export const clearWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.wishlist = [];
    await user.save();

    res.status(200).json({ message: "Wishlist cleared successfully" });
  } catch (error: any) {
    console.error("Clear Wishlist Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Check if item is in wishlist
 * @route   GET /api/users/wishlist/check/:productId
 * @access  Private
 */
export const checkWishlistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user?._id).select("wishlist");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isInWishlist = user.wishlist.some(
      (item) => item.productId === productId
    );

    res.status(200).json({ inWishlist: isInWishlist });
  } catch (error: any) {
    console.error("Check Wishlist Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
