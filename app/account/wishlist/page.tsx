"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { 
  HiOutlineHeart,
  HiXMark,
  HiOutlineShare,
  HiCheck,
  HiOutlineShoppingBag
} from "react-icons/hi2";

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const filteredItems = showInStockOnly ? items.filter(i => i.inStock !== false) : items;

  const showNotification = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: "", visible: false }), 3000);
  };

  const removeItem = async (id: string) => {
    await removeFromWishlist(id);
    showNotification("Removed from wishlist");
  };

  const moveToCart = async (item: WishlistItem) => {
    addItemToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: item.size || "M",
      color: item.color || "Standard",
      img: item.img
    });
    showNotification(`Added ${item.name} to bag`);
    await removeFromWishlist(item._id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("Wishlist link copied");
  };

  return (
    <div className="relative">
      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-6 py-3 flex items-center gap-3"
          >
            <HiCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-light">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
              Saved Items
            </p>
            <h2 className="text-2xl font-extralight tracking-wide">
              <span className="italic">Wishlist</span>
              <span className="text-neutral-300 ml-2 text-lg">({items.length})</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowInStockOnly(!showInStockOnly)}
              className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-all ${
                showInStockOnly 
                  ? "bg-neutral-900 text-white border-neutral-900" 
                  : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900"
              }`}
            >
              In Stock Only
            </button>
            
            <button 
              onClick={handleShare} 
              className="p-2.5 border border-neutral-200 hover:border-neutral-900 transition"
              title="Share Wishlist"
            >
              <HiOutlineShare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && items.length === 0 && (
        <div className="bg-white border border-neutral-200 p-16 text-center">
          <div className="w-8 h-8 border border-neutral-900 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Loading wishlist...</p>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white border border-neutral-200"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                <Image 
                  src={item.img || "/Hero/Product1.avif"} 
                  alt={item.name} 
                  fill 
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    item.inStock === false ? "opacity-50 grayscale" : ""
                  }`}
                />
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <HiXMark className="w-4 h-4" />
                </button>

                {/* Sold Out Badge */}
                {item.inStock === false && (
                  <div className="absolute top-3 left-3 bg-white px-3 py-1">
                    <span className="text-[10px] tracking-[0.1em] uppercase">Sold Out</span>
                  </div>
                )}

                {/* Quick Add - Desktop */}
                {item.inStock !== false && (
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
                    <button 
                      onClick={() => moveToCart(item)}
                      className="w-full bg-neutral-900 text-white py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
                    >
                      Add to Bag
                    </button>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <Link href={`/product/${item.slug || item.productId}`}>
                  <h3 className="text-sm font-light text-neutral-900 mb-1 hover:underline underline-offset-4">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-neutral-500">
                    {item.color || "Standard"} / {item.size || "M"}
                  </p>
                  <p className="text-sm font-light">₹{item.price.toLocaleString()}</p>
                </div>

                {/* Mobile Add Button */}
                <button 
                  onClick={() => moveToCart(item)}
                  disabled={item.inStock === false}
                  className="mt-4 lg:hidden w-full border border-neutral-200 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.inStock !== false ? "Add to Bag" : "Unavailable"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="bg-white border border-neutral-200 p-16 text-center">
          <div className="w-20 h-20 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
            <HiOutlineHeart className="w-10 h-10 text-neutral-300" />
          </div>
          <h3 className="text-xl font-extralight text-neutral-900 mb-2">
            Your wishlist is <span className="italic">empty</span>
          </h3>
          <p className="text-sm text-neutral-500 mb-8 max-w-sm mx-auto">
            Save items you love by tapping the heart icon on any product
          </p>
          <Link 
            href="/products"
            className="inline-block bg-neutral-900 text-white px-8 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
          >
            <span className="flex items-center gap-2">
              <HiOutlineShoppingBag className="w-4 h-4" />
              Start Shopping
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
