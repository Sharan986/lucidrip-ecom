import { Response } from "express";
import User, { IAddress } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * @desc    Get all addresses for current user
 * @route   GET /api/users/addresses
 * @access  Private
 */
export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select("addresses");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      count: user.addresses.length,
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error("Get Addresses Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Add a new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { label, name, phone, street, city, state, zip, isDefault } = req.body;

    // Validate required fields
    if (!name || !phone || !street || !city || !state || !zip) {
      res.status(400).json({ message: "Please fill in all required fields" });
      return;
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If this is set as default, unset other defaults
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress: IAddress = {
      label: label || "Home",
      name,
      phone,
      street,
      city,
      state,
      zip,
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      address: user.addresses[user.addresses.length - 1],
    });
  } catch (error: any) {
    console.error("Add Address Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Update an address
 * @route   PUT /api/users/addresses/:addressId
 * @access  Private
 */
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;
    const { label, name, phone, street, city, state, zip, isDefault } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id?.toString() === addressId
    );

    if (addressIndex === -1) {
      res.status(404).json({ message: "Address not found" });
      return;
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      label: label || user.addresses[addressIndex].label,
      name: name || user.addresses[addressIndex].name,
      phone: phone || user.addresses[addressIndex].phone,
      street: street || user.addresses[addressIndex].street,
      city: city || user.addresses[addressIndex].city,
      state: state || user.addresses[addressIndex].state,
      zip: zip || user.addresses[addressIndex].zip,
      isDefault: isDefault ?? user.addresses[addressIndex].isDefault,
    };

    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      address: user.addresses[addressIndex],
    });
  } catch (error: any) {
    console.error("Update Address Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private
 */
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id?.toString() === addressId
    );

    if (addressIndex === -1) {
      res.status(404).json({ message: "Address not found" });
      return;
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are remaining addresses, set first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error: any) {
    console.error("Delete Address Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Set default address
 * @route   PUT /api/users/addresses/:addressId/default
 * @access  Private
 */
export const setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const addressExists = user.addresses.some(
      (addr) => addr._id?.toString() === addressId
    );

    if (!addressExists) {
      res.status(404).json({ message: "Address not found" });
      return;
    }

    // Update all addresses
    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id?.toString() === addressId;
    });

    await user.save();

    res.status(200).json({ message: "Default address updated successfully" });
  } catch (error: any) {
    console.error("Set Default Address Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
