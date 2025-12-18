import mongoose, { Schema, Document, Model } from "mongoose";



export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "customer"; 
  createdAt: Date;
  updatedAt: Date;
}


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
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);


const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;