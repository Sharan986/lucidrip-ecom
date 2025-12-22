"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, CartItem as CartItemType } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineTrash, 
  HiOutlineMinus, 
  HiOutlinePlus, 
  HiArrowLeft,
  HiArrowRight,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiXMark
} from "react-icons/hi2";

// --- TYPES ---
interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, type: 'increase' | 'decrease') => void;
  removeItem: (id: string) => void;
  index: number;
}

// --- SUB-COMPONENT: CART ITEM ---
const CartItem = React.memo(({ item, updateQuantity, removeItem, index }: CartItemProps) => {
  const itemId = item.uniqueId;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex gap-6 py-8 border-b border-neutral-100"
    >
      {/* Image */}
      <Link href={`/product/${item.slug || '#'}`} className="relative h-32 w-24 md:h-40 md:w-32 flex-shrink-0 overflow-hidden bg-neutral-50 group">
        <Image 
          src={item.img} 
          alt={item.name} 
          fill 
          sizes="(max-width: 768px) 100px, 150px"
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <Link href={`/product/${item.slug || '#'}`} className="block">
              <h3 className="text-sm md:text-base tracking-wide text-neutral-900 hover:underline underline-offset-4 decoration-neutral-300 truncate">
                {item.name}
              </h3>
            </Link>
            <p className="mt-2 text-xs tracking-[0.1em] text-neutral-400 uppercase">
              {item.size} <span className="mx-2">·</span> {item.color}
            </p>
          </div>
          <button 
            onClick={() => removeItem(itemId)}
            className="p-2 text-neutral-300 hover:text-black transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <HiXMark size={18} />
          </button>
        </div>

        {/* Bottom Row */}
        <div className="flex items-end justify-between mt-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-neutral-200">
            <button 
              onClick={() => updateQuantity(itemId, 'decrease')}
              disabled={item.quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 transition-colors"
            >
              <HiOutlineMinus size={12} />
            </button>
            
            <span className="w-10 text-center text-sm font-medium text-neutral-900 select-none">
              {item.quantity}
            </span>
            
            <button 
              onClick={() => updateQuantity(itemId, 'increase')}
              className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <HiOutlinePlus size={12} />
            </button>
          </div>

          {/* Price */}
          <p className="text-base font-medium text-neutral-900">
            ₹{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

CartItem.displayName = 'CartItem';

// --- MAIN PAGE ---
export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculations
  const subtotal = useMemo(() => getCartTotal(), [items, getCartTotal]);
  const shippingThreshold = 2500; 
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 150;
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!isMounted) return null;

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 border border-neutral-200 flex items-center justify-center mb-8">
            <HiOutlineShoppingBag className="text-3xl text-neutral-300" />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4">Your Bag</p>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4">
            Your bag is <span className="italic">empty</span>
          </h2>
          <p className="text-neutral-500 mb-10 max-w-sm">
            Discover our latest collection of premium essentials crafted for the modern minimalist.
          </p>
          <Link 
            href="/products" 
            className="inline-block px-10 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-3">Shopping Bag</p>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tight">
              Your <span className="italic">Bag</span>
              <span className="text-neutral-400 text-lg md:text-xl font-normal ml-4">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* --- LEFT: Cart Items --- */}
          <div className="flex-grow">
            
            {/* Free Shipping Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8 p-6 border border-neutral-100"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <HiOutlineTruck className="text-lg text-neutral-400" />
                  <span className="text-sm tracking-wide">
                    {isFreeShipping 
                      ? <span className="text-emerald-600">You've unlocked free shipping!</span>
                      : <>Add <span className="font-medium">₹{(shippingThreshold - subtotal).toLocaleString()}</span> for free shipping</>
                    }
                  </span>
                </div>
                <span className="text-xs tracking-[0.1em] text-neutral-400">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-px bg-neutral-200 overflow-hidden">
                <motion.div 
                  className={`h-full ${isFreeShipping ? 'bg-emerald-500' : 'bg-black'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Cart Items */}
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <CartItem 
                  key={item.uniqueId} 
                  item={item} 
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href="/products" 
                className="inline-flex items-center gap-3 mt-8 text-sm tracking-wide hover:opacity-60 transition-opacity"
              >
                <HiArrowLeft className="text-sm" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* --- RIGHT: Order Summary --- */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <div className="border border-neutral-100 p-6 md:p-8">
                <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-8">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-8 pb-8 border-b border-neutral-100">
                  <label className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-3 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code" 
                      className="flex-grow px-4 py-3 border border-neutral-200 text-sm tracking-wide placeholder:text-neutral-300 focus:outline-none focus:border-black transition-colors"
                    />
                    <button className="px-6 py-3 bg-black text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4 mb-8 pb-8 border-b border-neutral-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="text-neutral-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Shipping</span>
                    <span className={shippingCost === 0 ? "text-emerald-600" : "text-neutral-900"}>
                      {shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm tracking-wide">Total</span>
                  <span className="text-2xl font-extralight">₹{total.toLocaleString()}</span>
                </div>
                <p className="text-[10px] tracking-[0.1em] text-neutral-400 text-right mb-8">Including GST</p>

                {/* Checkout Button */}
                <Link 
                  href="/checkout"
                  className="group relative w-full flex items-center justify-center gap-3 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase overflow-hidden"
                >
                  <span className="relative z-10 transition-colors">Proceed to Checkout</span>
                  <HiArrowRight className="relative z-10 text-sm transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t border-neutral-100 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <HiOutlineShieldCheck className="text-lg mx-auto mb-2 text-neutral-300" />
                    <p className="text-[9px] tracking-[0.1em] uppercase text-neutral-400">Secure</p>
                  </div>
                  <div className="text-center">
                    <HiOutlineTruck className="text-lg mx-auto mb-2 text-neutral-300" />
                    <p className="text-[9px] tracking-[0.1em] uppercase text-neutral-400">Fast Shipping</p>
                  </div>
                  <div className="text-center">
                    <HiOutlineArrowPath className="text-lg mx-auto mb-2 text-neutral-300" />
                    <p className="text-[9px] tracking-[0.1em] uppercase text-neutral-400">Easy Returns</p>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="mt-6 p-6 border border-neutral-100 text-center">
                <p className="text-xs tracking-[0.1em] text-neutral-400 mb-2">Need assistance?</p>
                <Link href="/contact" className="text-sm tracking-wide underline underline-offset-4 hover:opacity-60 transition-opacity">
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Mobile Checkout Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-4 lg:hidden z-50 safe-area-pb">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-neutral-500">Total</span>
          <span className="text-lg font-medium">₹{total.toLocaleString()}</span>
        </div>
        <Link 
          href="/checkout"
          className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase"
        >
          Checkout
          <HiArrowRight className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
