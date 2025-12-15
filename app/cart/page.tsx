"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
// Icons
import { 
  HiOutlineTrash, 
  HiOutlineMinus, 
  HiOutlinePlus, 
  HiOutlineArrowLeft,
  HiOutlineShoppingBag 
} from "react-icons/hi2";

export default function CartPage() {
  
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []); 

  // Prevent rendering until client-side hydration is complete
  if (!isMounted) return null; 

  // Calculations
  const subtotal = getCartTotal();
  const shipping = subtotal > 200 ? 0 : 15; 
  const total = subtotal + shipping;

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <HiOutlineShoppingBag className="text-3xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven&apos;t added anything yet. Explore our latest collections to find something you love.
        </p>
        <Link 
          href="/" 
          className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // --- MAIN CART UI ---
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- LEFT: Cart Items List --- */}
        <div className="flex-grow">
          <div className="border-t border-gray-100">
            {items.map((item, index) => (
              <div 
                // ✅ FIX: Robust Key (Uses uniqueId OR creates one from name/size/color)
                key={item.uniqueId || `${item.name}-${item.size}-${item.color}-${index}`} 
                className="flex gap-6 py-8 border-b border-gray-100 last:border-0"
              >
                {/* Image */}
                <div className="relative h-32 w-24 sm:h-40 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <Image 
                    src={item.img} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between">
                  
                  {/* Top: Info */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 font-medium">
                        {item.size} <span className="mx-1 text-gray-300">|</span> {item.color}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Bottom: Actions */}
                  <div className="flex items-center justify-between mt-4 sm:mt-0">
                    
                    {/* Quantity Pill */}
                    <div className="flex items-center border border-gray-300 rounded-full px-1 py-1">
                      <button 
                        onClick={() => updateQuantity(item.uniqueId, 'decrease')}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-black hover:text-white transition-colors"
                      >
                        <HiOutlineMinus size={14} />
                      </button>
                      
                      <span className="w-8 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      
                      <button 
                        onClick={() => updateQuantity(item.uniqueId, 'increase')}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-black hover:text-white transition-colors"
                      >
                        <HiOutlinePlus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button 
                      onClick={() => removeItem(item.uniqueId)}
                      className="group flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineTrash size={18} className="group-hover:stroke-red-500" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-black hover:underline transition">
            <HiOutlineArrowLeft />
            Continue Shopping
          </Link>
        </div>

        {/* --- RIGHT: Order Summary --- */}
        <div className="w-full lg:w-96 h-fit bg-gray-50 p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <Link 
            href="/checkout"
            className="w-full block text-center bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Checkout
          </Link>

          <div className="mt-6 text-xs text-gray-400 text-center flex flex-col gap-1">
            <p>Secure Checkout - SSL Encrypted</p>
          </div>
        </div>

      </div>
    </div>
  );
}