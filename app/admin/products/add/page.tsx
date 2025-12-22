"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  HiOutlineArrowLeft, 
  HiOutlinePhoto, 
  HiOutlineXMark, 
  HiPlus,
  HiOutlineTrash
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ProductStatus = "Active" | "Draft";

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export default function AddProductPage() {
  const router = useRouter();
  const { adminToken } = useAdminAuthStore();
  
  // --- FORM STATE ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [comparePrice, setComparePrice] = useState<number | string>("");
  const [costPrice, setCostPrice] = useState<number | string>("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState<ProductStatus>("Draft");
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [stock, setStock] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImages(prev => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      size: "",
      color: "",
      stock: 0
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminToken) {
      setError("Please login as admin");
      return;
    }
    
    if (!title || !price || !category) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Calculate total stock from variants or use default
      const totalStock = variants.length > 0 
        ? variants.reduce((sum, v) => sum + v.stock, 0)
        : stock;
      
      // Get sizes and colors from variants
      const sizes = variants.length > 0 
        ? [...new Set(variants.map(v => v.size).filter(Boolean))]
        : ["S", "M", "L", "XL"];
      const colors = variants.length > 0 
        ? [...new Set(variants.map(v => v.color).filter(Boolean))]
        : ["Black"];
      
      const productData = {
        name: title,
        description,
        category,
        price: Number(price),
        image: images[0] || "/Hero/Product1.avif",
        sizes,
        colors,
        stock: totalStock,
      };
      
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        router.push("/admin/products");
      } else {
        setError(data.message || "Failed to create product");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PROFIT CALCULATION ---
  const profit = typeof price === "number" && typeof costPrice === "number" 
    ? price - costPrice 
    : 0;
  const margin = typeof price === "number" && price > 0 && typeof costPrice === "number" 
    ? ((price - costPrice) / price * 100).toFixed(1) 
    : "0.0";

  const categories = ["T-Shirts", "Hoodies", "Jackets", "Bottoms", "Knitwear", "Accessories"];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-2 border border-neutral-200 hover:border-neutral-900 transition"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-1">
            Inventory
          </p>
          <h1 className="text-2xl font-extralight text-neutral-900">
            <span className="italic">Add Product</span>
          </h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT COLUMN (2/3) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    Product Title *
                  </label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product title"
                    required
                    className="w-full px-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    Description
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Media */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
                Media
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-neutral-100 border border-neutral-200">
                    <Image 
                      src={img} 
                      alt={`Product ${i + 1}`} 
                      fill 
                      className="object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-white hover:bg-red-50 transition"
                    >
                      <HiOutlineXMark className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-neutral-300 hover:border-neutral-900 transition flex flex-col items-center justify-center gap-2"
                >
                  <HiOutlinePhoto className="w-8 h-8 text-neutral-400" />
                  <span className="text-[10px] tracking-[0.1em] uppercase text-neutral-500">
                    Add Image
                  </span>
                </button>
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
                Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">₹</span>
                    <input 
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="0.00"
                      required
                      className="w-full pl-8 pr-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    Compare Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">₹</span>
                    <input 
                      type="number"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    Cost Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">₹</span>
                    <input 
                      type="number"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* Profit Calculator */}
              {typeof price === "number" && typeof costPrice === "number" && costPrice > 0 && (
                <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-neutral-500 mb-1">
                      Profit
                    </p>
                    <p className={`text-lg font-light ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₹{profit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-neutral-500 mb-1">
                      Margin
                    </p>
                    <p className={`text-lg font-light ${Number(margin) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {margin}%
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Variants */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-neutral-200 bg-white p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                  Variants & Stock
                </h2>
                <button 
                  type="button"
                  onClick={addVariant}
                  className="text-[10px] tracking-[0.1em] uppercase text-neutral-900 hover:underline underline-offset-4 flex items-center gap-1"
                >
                  <HiPlus className="w-4 h-4" /> Add Variant
                </button>
              </div>
              
              {variants.length === 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                      Stock Quantity
                    </label>
                    <input 
                      type="number"
                      value={stock || ""}
                      onChange={(e) => setStock(Number(e.target.value))}
                      placeholder="Enter stock quantity"
                      className="w-full px-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                  <p className="text-sm font-light text-neutral-500 text-center py-4">
                    Or add variants for size/color specific stock
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-4 gap-3 items-center">
                      <input 
                        type="text"
                        value={variant.size}
                        onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                        placeholder="Size"
                        className="px-3 py-2 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
                      />
                      <input 
                        type="text"
                        value={variant.color}
                        onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                        placeholder="Color"
                        className="px-3 py-2 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
                      />
                      <input 
                        type="number"
                        value={variant.stock || ""}
                        onChange={(e) => updateVariant(variant.id, "stock", Number(e.target.value))}
                        placeholder="Stock"
                        className="px-3 py-2 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
                      />
                      <button 
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-2 hover:bg-red-50 transition text-red-600"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN (1/3) --- */}
          <div className="space-y-6">
            
            {/* Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
                Status
              </h2>
              
              <div className="flex gap-2">
                {(["Draft", "Active"] as ProductStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 text-[10px] tracking-[0.1em] uppercase border transition ${
                      status === s 
                        ? "bg-neutral-900 text-white border-neutral-900" 
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Organization */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
                Organization
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">
                    SKU
                  </label>
                  <input 
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. HD-BLK-01"
                    className="w-full px-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-neutral-200 bg-white p-6 space-y-3"
            >
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-[10px] tracking-[0.15em] uppercase transition ${
                  isSubmitting 
                    ? "bg-neutral-400 text-white cursor-not-allowed" 
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
              <Link href="/admin/products">
                <button 
                  type="button"
                  className="w-full py-3 border border-neutral-200 text-neutral-600 text-[10px] tracking-[0.15em] uppercase hover:border-neutral-900 transition"
                >
                  Discard
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
