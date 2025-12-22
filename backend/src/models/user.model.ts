import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Address subdocument interface
export interface IAddress {
  _id?: Types.ObjectId;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

// Wishlist item subdocument interface
export interface IWishlistItem {
  _id?: Types.ObjectId;
  productId: string;
  name: string;
  price: number;
  img: string;
  slug: string;
  size?: string;
  color?: string;
  addedAt: Date;
}

export interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  passwordHash: string;
  role: "admin" | "customer";
  addresses: IAddress[];
  wishlist: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Address subdocument schema
const AddressSchema = new Schema<IAddress>({
  label: { type: String, default: "Home" },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// Wishlist item subdocument schema
const WishlistItemSchema = new Schema<IWishlistItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  slug: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  addedAt: { type: Date, default: Date.now },
});

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    addresses: [AddressSchema],
    wishlist: [WishlistItemSchema],
  },
  {
    timestamps: true,
  }
);


const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;