import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;        
  description: string;
  price: number;
  image: string;      
  sizes: string[];    
  colors: string[];    
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ensure URL is unique
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    sizes: { type: [String], required: true },  // Array of strings
    colors: { type: [String], required: true }, // Array of strings
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);