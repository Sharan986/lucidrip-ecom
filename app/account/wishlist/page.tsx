"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  HiOutlineTrash, 
  HiOutlineShoppingBag, 
  HiOutlineHeart,
} from "react-icons/hi2";

// --- TYPES ---
type WishlistItem = {
  id: number;
  name: string;
  price: number;
  img: string;
  slug: string;
  inStock: boolean;
  size?: string;
  color?: string;
};

// --- DUMMY DATA ---
const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: 1,
    name: "Oversized Street Hoodie",
    price: 2499,
    img: "/Hero/Product1.avif",
    slug: "oversized-street-hoodie",
    inStock: true,
    size: "L",
    color: "Black",
  },
  {
    id: 2,
    name: "Classic Beige Knit",
    price: 1899,
    img: "/Hero/Product2.avif",
    slug: "classic-beige-knit",
    inStock: true,
    size: "M",
    color: "Beige",
  },
  {
    id: 3,
    name: "Limited Edition Bomber",
    price: 4500,
    img: "/Hero/Product3.avif",
    slug: "limited-bomber",
    inStock: false, // 🔴 Out of Stock Example
    size: "XL",
    color: "Olive",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(MOCK_WISHLIST);

  // --- HANDLERS ---
  
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item: WishlistItem) => {
    // 1. Logic to add to cart store would go here (e.g., addToCart(item))
    alert(`Moved "${item.name}" to Cart!`);
    
    // 2. Remove from wishlist after moving
    removeItem(item.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        My Wishlist <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{items.length}</span>
      </h2>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              
              {/* --- IMAGE AREA --- */}
              <div className="relative aspect-[4/5] bg-gray-100">
                <Image 
                  src={item.img} 
                  alt={item.name} 
                  fill 
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${!item.inStock ? "grayscale opacity-80" : ""}`} 
                />
                
                {/* Remove Button (Top Right) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <HiOutlineTrash />
                </button>

                {/* Stock Badge */}
                {!item.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <span className="bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* --- CONTENT AREA --- */}
              <div className="p-5">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-bold text-gray-900 truncate hover:underline underline-offset-2 decoration-gray-300">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center mt-1 mb-4">
                   <p className="text-gray-500 text-xs font-medium">
                     {item.size} / {item.color}
                   </p>
                   <p className="font-bold text-black">₹{item.price.toLocaleString()}</p>
                </div>

                {/* --- ACTION BUTTON --- */}
                {item.inStock ? (
                  <button 
                    onClick={() => moveToCart(item)}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition shadow-md active:scale-95"
                  >
                    <HiOutlineShoppingBag className="text-lg" />
                    Move to Cart
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-3 rounded-xl text-sm font-bold cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        // --- EMPTY STATE ---
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center px-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-red-100">
            <HiOutlineHeart className="text-4xl text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-sm mb-8">
            Keep track of your favorite drops here. Dont let them sell out before you decide.
          </p>
          <Link 
            href="/" 
            className="bg-black text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition"
          >
            Explore Collection
          </Link>
        </div>
      )}
    </div>
  );
}