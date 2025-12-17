"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { 
  HiOutlineTrash, 
  HiOutlineMinus, 
  HiOutlinePlus, 
  HiOutlineArrowLeft,
  HiOutlineArrowRight, // ✅ Fixed: Added missing import
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineTruck,
  HiCheckCircle
} from "react-icons/hi2";

// --- TYPES ---
interface CartItemProps {
  item: any;
  updateQuantity: (id: string, type: 'increase' | 'decrease') => void;
  removeItem: (id: string) => void;
}

// --- SUB-COMPONENT: CART ITEM ---
const CartItem = React.memo(({ item, updateQuantity, removeItem }: CartItemProps) => {
  
  // ✅ FIX: Ensure we have a valid ID. Fallback to item.id if uniqueId is missing.
  const itemId = item.uniqueId || item.id; 

  // Debug wrappers to help you see if it works
  const handleIncrease = () => {
    console.log("Increasing item:", itemId);
    updateQuantity(itemId, 'increase');
  };

  const handleDecrease = () => {
    console.log("Decreasing item:", itemId);
    updateQuantity(itemId, 'decrease');
  };

  const handleRemove = () => {
    console.log("Removing item:", itemId);
    removeItem(itemId);
  };

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-gray-100 last:border-0 animate-in fade-in duration-300">
      {/* Image */}
      <div className="relative h-32 w-24 sm:h-40 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <Image 
          src={item.img} 
          alt={item.name} 
          fill 
          sizes="(max-width: 768px) 100px, 150px"
          className="object-cover" 
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2">
              <Link href={`/product/${item.slug}`} className="hover:underline">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              {item.size} <span className="mx-1 text-gray-300">|</span> {item.color}
            </p>
            {item.stock && item.stock < 5 && (
               <p className="text-xs text-red-500 font-bold mt-1">Only {item.stock} left!</p>
            )}
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            ₹{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between mt-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200 rounded-full px-1 py-1 bg-white shadow-sm">
            <button 
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all"
            >
              <HiOutlineMinus size={14} />
            </button>
            
            <span className="w-8 text-center font-bold text-sm text-gray-900 select-none">
              {item.quantity}
            </span>
            
            <button 
              onClick={handleIncrease}
              disabled={item.quantity >= 10} 
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all"
            >
              <HiOutlinePlus size={14} />
            </button>
          </div>

          {/* Remove Button */}
          <button 
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-600 transition-colors p-2"
          >
            <HiOutlineTrash size={16} />
            <span className="hidden sm:inline">Remove</span>
          </button>
          
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

// --- MAIN PAGE ---
export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Optimized Calculations
  const subtotal = useMemo(() => getCartTotal(), [items, getCartTotal]);
  const shippingThreshold = 2500; 
  const shippingCost = subtotal > shippingThreshold ? 0 : 99;
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
  const total = subtotal + shippingCost;

  if (!isMounted) return null;

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <HiOutlineShoppingBag className="text-4xl text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-lg">
          Looks like you haven&apos;t made your choice yet. The latest drops are waiting.
        </p>
        <Link 
          href="/" 
          className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 tracking-tight">Shopping Bag <span className="text-gray-400 font-medium text-lg ml-2">({items.length} Items)</span></h1>

      <div className="flex flex-col lg:flex-row gap-12 relative">
        
        {/* --- LEFT: Cart Items List --- */}
        <div className="flex-grow">
          
          {/* Free Shipping Progress Bar */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <HiOutlineTruck /> 
                  {progressPercent === 100 ? "You've unlocked Free Shipping!" : `Add ₹${(shippingThreshold - subtotal).toLocaleString()} for Free Shipping`}
                </span>
                <span className="text-xs font-bold text-gray-900">{Math.round(progressPercent)}%</span>
             </div>
             <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${progressPercent === 100 ? 'bg-green-500' : 'bg-black'}`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
             </div>
          </div>

          <div className="border-t border-gray-100">
            {items.map((item, index) => (
              <CartItem 
                key={item.uniqueId || index} 
                item={item} 
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>

          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-black hover:text-gray-600 transition">
            <HiOutlineArrowLeft />
            Continue Shopping
          </Link>
        </div>

        {/* --- RIGHT: Order Summary --- */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            {/* Coupon Code */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                   <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                      type="text" 
                      placeholder="Enter code" 
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-black transition"
                   />
                </div>
                <button className="bg-black text-white px-4 rounded-xl text-sm font-bold hover:bg-zinc-800 transition">
                  Apply
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6 border-dashed">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-600 font-bold" : "text-gray-900"}>
                  {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                 <span>Tax (Included)</span>
                 <span className="text-gray-900">₹0</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-black text-gray-900 mb-1">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 text-right mb-8">Including GST</p>

            <Link 
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
            >
              Checkout <HiOutlineArrowRight />
            </Link>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-2 text-center">
               <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><HiCheckCircle /></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Secure</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><HiOutlineTruck /></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Fast</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><HiOutlineShoppingBag /></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Easy</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}