import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // 4️⃣ Order Details
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        img: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
      }
    ],

    // 2️⃣ Address Snapshot (Address at time of order)
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
    },

    // Payment
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Razorpay"], required: true },
    paymentId: String,
    isPaid: { type: Boolean, default: false },

    // 3️⃣ & 5️⃣ Status & Tracking
    status: { 
      type: String, 
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"], 
      default: "Processing" 
    },
    
    tracking: {
      courier: String,      // e.g., "BlueDart"
      trackingId: String,   // e.g., "BD123456789"
      estimatedDelivery: Date,
      trackingUrl: String,
    },

    // 9️⃣ Returns & Cancellations
    returnRequest: {
      isRequested: { type: Boolean, default: false },
      reason: String,
      status: { type: String, enum: ["Pending", "Approved", "Rejected", "Refunded"] },
      requestDate: Date,
    },
    
    // 4️⃣ Timeline
    timeline: [
      {
        status: String, // "Order Placed", "Shipped", "Out for Delivery"
        date: { type: Date, default: Date.now },
        note: String,
      }
    ],
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;