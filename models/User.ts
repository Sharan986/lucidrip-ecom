import mongoose, { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
  label: { type: String, default: "Home" }, // Home, Office
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Hide password by default
    image: { type: String },
    phone: { type: String },
    
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },

    // 2️⃣ Address Management
    addresses: [AddressSchema],

    // 6️⃣ Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // 7️⃣ Cart (Server-side sync)
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        size: String,
        color: String,
      }
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;