import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface IShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  addressType?: "home" | "work";
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderNumber: string;
  shippingAddress: IShippingAddress;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled" | "Returned";
  trackingId?: string;
  paymentMethod: "COD" | "Razorpay";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String },
  color: { type: String },
  image: { type: String, required: true },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  addressType: { type: String, enum: ["home", "work"], default: "home" },
});

const OrderSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    orderNumber: { 
      type: String, 
      unique: true,
      default: function() {
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${Date.now().toString().slice(-6)}-${randomPart}`;
      }
    },
    shippingAddress: ShippingAddressSchema,
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
      default: "Processing" 
    },
    trackingId: { type: String },
    paymentMethod: { 
      type: String, 
      enum: ["COD", "Razorpay"],
      default: "Razorpay" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending" 
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);