"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore"; // Assuming you have this
import { 
  HiOutlineShoppingBag, 
  HiOutlineHeart,
  HiXMark,
  HiOutlineShare,
  HiCheck
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
    inStock: false, 
    size: "XL",
    color: "Olive",
  },
  {
    id: 4,
    name: "Tactical Cargo Pant",
    price: 3200,
    img: "/Hero/Product4.avif",
    slug: "tactical-cargo",
    inStock: true, 
    size: "32",
    color: "Camo",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(MOCK_WISHLIST);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showToast, setShowToast] = useState<{msg: string, visible: boolean}>({ msg: "", visible: false });
  
  const addItemToCart = useCartStore((state) => state.addItem); // Use real store

  // --- LOGIC ---
  const filteredItems = showInStockOnly ? items.filter(i => i.inStock) : items;

  const showNotification = (msg: string) => {
    setShowToast({ msg, visible: true });
    setTimeout(() => setShowToast({ msg: "", visible: false }), 3000);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item: WishlistItem) => {
    // 1. Add to global cart store
    addItemToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        size: item.size || "M",
        color: item.color || "Standard",
        img: item.img
    });

    // 2. Notify
    showNotification(`Moved ${item.name} to Bag`);
    
    // 3. Remove from wishlist
    removeItem(item.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("Wishlist link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${showToast.visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
           <span className="bg-green-500 rounded-full p-0.5"><HiCheck className="text-white text-xs" /></span>
           <span className="text-sm font-bold">{showToast.msg}</span>
        </div>
      </div>

      {/* --- HEADER --- */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-xl z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Wishlist <span className="text-gray-300 ml-1">({items.length})</span></h1>
              <p className="text-sm text-gray-500 mt-1">Save your favorites for later.</p>
           </div>
           
           <div className="flex items-center gap-4">
              {/* Filter Toggle */}
              <button 
                onClick={() => setShowInStockOnly(!showInStockOnly)}
                className={`text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full border transition-all ${
                  showInStockOnly 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-900"
                }`}
              >
                In Stock Only
              </button>
              
              {/* Share Button */}
              <button onClick={handleShare} className="p-2 text-gray-400 hover:text-black transition" title="Share Wishlist">
                 <HiOutlineShare className="text-xl" />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            
            {filteredItems.map((item) => (
              <div key={item.id} className="group flex flex-col">
                
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden rounded-sm">
                  <Image 
                    src={item.img} 
                    alt={item.name} 
                    fill 
                    className={`object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${!item.inStock ? "opacity-60 grayscale" : ""}`} 
                  />
                  
                  {/* Remove Button (Always visible but subtle) */}
                  <button 
                    onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black transition opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <HiXMark className="text-lg" />
                  </button>

                  {/* Stock Badge */}
                  {!item.inStock && (
                     <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Sold Out</span>
                     </div>
                  )}

                  {/* DESKTOP HOVER: QUICK ADD */}
                  {item.inStock && (
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
                      <button 
                        onClick={() => moveToCart(item)}
                        className="w-full bg-white text-black font-bold uppercase text-xs py-3.5 tracking-wider hover:bg-black hover:text-white transition shadow-lg"
                      >
                        Add to Bag - ₹{item.price.toLocaleString()}
                      </button>
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1 flex flex-col">
                   <div className="flex justify-between items-start">
                      <Link href={`/product/${item.slug}`} className="group-hover:underline underline-offset-4 decoration-1">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight leading-snug">{item.name}</h3>
                      </Link>
                   </div>
                   
                   <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 font-medium capitalize">{item.color} / {item.size}</p>
                      <p className="text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                   </div>

                   {/* MOBILE: ADD BUTTON (Visible always) */}
                   <button 
                     onClick={() => moveToCart(item)}
                     disabled={!item.inStock}
                     className="mt-4 lg:hidden w-full border border-gray-200 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white hover:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {item.inStock ? "Add to Bag" : "Unavailable"}
                   </button>
                </div>
              </div>
            ))}

          </div>
        ) : (
          // --- EMPTY STATE (Editorial Style) ---
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
             <div className="relative mb-6">
                <HiOutlineHeart className="text-6xl text-gray-200" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                   <HiXMark className="text-sm text-gray-400" />
                </div>
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-3">Your Wishlist is Empty</h2>
             <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
               Don't lose track of what you love. Tap the heart icon on any product to save it here.
             </p>
             <Link 
               href="/products" 
               className="bg-black text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition hover:scale-105 active:scale-95"
             >
               Start Shopping
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}