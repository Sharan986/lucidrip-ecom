// components/ProductUI.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore"; 
// Icons
import { HiOutlineTruck, HiOutlineMinus, HiOutlinePlus, HiCheck } from "react-icons/hi2";
import { LuLeaf, LuRecycle } from "react-icons/lu"; 
import { GoX, GoPlus } from "react-icons/go";

// 1. Expanded Interface for Backend Data
export interface Product {
  id: number;
  name: string;
  price: number;
  img: string; 
  images?: string[]; 
  description?: string;
  // New Backend Fields
  sizes?: string[];
  colors?: string[];
  inStock?: boolean; 
}

export default function ProductUI({ product }: { product: Product }) {
  // --- GLOBAL STATE ---
  const addItem = useCartStore((state) => state.addItem);

  // --- DERIVED DATA (Fallbacks for missing backend data) ---
  const galleryImages = product.images?.length ? product.images : [product.img, product.img, product.img];
  const availableSizes = product.sizes || ["Small", "Medium", "Large", "XL"];
  const availableColors = product.colors || ["Black", "White", "Navy"];
  const isStocked = product.inStock ?? true; // Default to true if not specified

  // --- LOCAL STATE ---
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.img);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Loading & Success states
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- HANDLERS ---

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleAddToCart = () => {
    if (!isStocked) return;

    setIsAdding(true);

    // 1. Add to Zustand Store
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      img: product.img,
    });

    // 2. Simulate Network Delay
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setQuantity(1);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  // Helper to map color names to CSS hex codes (Optional UI Polish)
  const getColorCode = (name: string) => {
    const map: Record<string, string> = {
      Black: "#000000",
      White: "#FFFFFF",
      Blue: "#3B82F6",
      Navy: "#1E3A8A",
      Beige: "#DCC6B6",
      Green: "#10B981",
      Red: "#EF4444",
    };
    return map[name] || null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative max-w-7xl mx-auto">
      
      {/* --- MODERN SUCCESS TOAST --- */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm transform transition-all duration-500 ease-out translate-y-0 opacity-100">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden p-4 flex gap-4 items-start ring-1 ring-black/5">
            <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <Image src={activeImage} alt="product" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                    <HiCheck className="text-white text-xs" />
                  </span>
                  Added to Cart
                </h4>
                <button onClick={() => setShowSuccess(false)} className="text-gray-400 hover:text-black">
                  <GoX className="text-lg" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1 truncate font-medium">{product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selectedSize} | {selectedColor}</p>
              <a href="/cart" className="mt-3 inline-flex items-center text-xs font-bold text-black uppercase tracking-wide border-b border-black hover:text-gray-600 hover:border-gray-600 transition-all pb-0.5">
                View Cart & Checkout
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- LEFT SIDE: Image Gallery --- */}
      {/* Added 'sticky' so it stays visible while scrolling long descriptions */}
      <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24 h-fit">
        
        {/* Vertical Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible scrollbar-hide py-2 md:py-0">
          {galleryImages.map((img, index) => (
            <button 
              key={index} 
              onClick={() => setActiveImage(img)}
              className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                activeImage === img ? 'border-black ring-1 ring-black' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* Main Active Image */}
        <div className="relative flex-1 bg-gray-50 rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[600px] shadow-sm">
           <Image 
             src={activeImage} 
             alt={product.name} 
             fill 
             className="object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
             priority
           />
           {/* Stock Badge on Image */}
           {!isStocked && (
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
               Sold Out
             </div>
           )}
        </div>
      </div>

      {/* --- RIGHT SIDE: Product Details --- */}
      <div className="w-full lg:w-2/5 flex flex-col pt-2">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-medium text-gray-900">
              ₹{product.price.toLocaleString()}
            </p>
            {isStocked ? (
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                In Stock
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wide">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Description */}
        <div className="mb-8">
          <p className="text-gray-600 leading-relaxed text-base">
            {product.description || "Classic design meets modern comfort. This piece is crafted from premium materials, ensuring durability and style for any occasion."}
          </p>
        </div>

        {/* Selectors Wrapper */}
        <div className="space-y-6 mb-8">
          
          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Size</h3>
              <button className="text-xs text-gray-500 underline hover:text-black">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isStocked}
                  className={`min-w-[4rem] px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    selectedSize === size 
                      ? "border-black bg-black text-white shadow-md" 
                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                  } ${!isStocked && "opacity-50 cursor-not-allowed"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Select Color</h3>
             <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => {
                const colorHex = getColorCode(color);
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!isStocked}
                    className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                      selectedColor === color 
                        ? "border-black bg-gray-50 ring-1 ring-black" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } ${!isStocked && "opacity-50 cursor-not-allowed"}`}
                  >
                    {/* Color Swatch Circle */}
                    {colorHex && (
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" 
                        style={{ backgroundColor: colorHex }} 
                      />
                    )}
                    <span className={selectedColor === color ? "text-black font-semibold" : "text-gray-600"}>
                      {color}
                    </span>
                  </button>
                );
              })}
             </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl">
            {/* Quantity */}
            <div className="flex items-center bg-white rounded-xl px-4 py-3 gap-6 shadow-sm border border-gray-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isStocked || isAdding}
                  className="hover:text-black text-gray-400 transition-colors disabled:opacity-50"
                >
                  <HiOutlineMinus />
                </button>
                <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isStocked || isAdding}
                  className="hover:text-black text-gray-400 transition-colors disabled:opacity-50"
                >
                  <HiOutlinePlus />
                </button>
            </div>
            
            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              disabled={!isStocked || isAdding}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
                isStocked 
                  ? "bg-black text-white hover:bg-gray-800 hover:shadow-xl" 
                  : " text-gray-500 cursor-not-allowed shadow-none"
              }`}
            >
              {isAdding 
                ? "Adding..." 
                : isStocked 
                  ? `Add to Cart` 
                  : "Out of Stock"
              }
            </button>
        </div>

      
      

           {/* Accordions */}
           <div className="divide-y divide-gray-100">
              {[
                { id: 'delivery', title: 'Delivery & Returns', content: 'Free standard shipping on orders over $200. Returns accepted within 30 days.' },
                { id: 'details', title: 'Fabric & Care', content: '100% Organic Cotton. Machine wash cold, tumble dry low.' },
              ].map((item) => (
                <div key={item.id} className="py-1">
                  <button 
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full py-4 flex justify-between items-center text-left group"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{item.title}</span>
                    <span className={`text-xl transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-45' : ''}`}>
                      <GoPlus />
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === item.id ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    
  );
}