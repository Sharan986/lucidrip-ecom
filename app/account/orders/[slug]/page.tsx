"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useOrderStore } from "@/store/useOrderStore";
import { 
  HiArrowLeft, 
  HiOutlineClipboard, 
  HiCheck, 
  HiOutlineTruck, 
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineDocument,
  HiOutlineArrowPath
} from "react-icons/hi2";

const generateTimeline = (status: string) => {
  const statuses = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
  const currentIndex = statuses.indexOf(status);
  
  return [
    { status: "Ordered", completed: true },
    ...statuses.map((s, i) => ({
      status: s,
      completed: i <= currentIndex
    }))
  ];
};

const getProgressPercentage = (status: string) => {
  const statusMap: { [key: string]: number } = {
    "Processing": 25,
    "Shipped": 50,
    "Out for Delivery": 75,
    "Delivered": 100,
    "Cancelled": 0,
    "Returned": 0
  };
  return statusMap[status] || 25;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.slug as string;
  const [copied, setCopied] = useState(false);
  
  const { currentOrder, isLoading, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  const handleCopy = () => {
    if (currentOrder?.trackingId) {
      navigator.clipboard.writeText(currentOrder.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-200 p-16 text-center">
        <div className="w-8 h-8 border border-neutral-900 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Loading order details...</p>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="bg-white border border-neutral-200 p-16 text-center">
        <h2 className="text-xl font-extralight text-neutral-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">The order you are looking for does not exist.</p>
        <Link 
          href="/account/orders" 
          className="inline-block bg-neutral-900 text-white px-6 py-3 text-xs tracking-[0.1em] uppercase"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const timeline = generateTimeline(currentOrder.status);
  const progressPercentage = getProgressPercentage(currentOrder.status);
  const subtotal = currentOrder.subtotal || currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = currentOrder.shippingCost || 0;
  const tax = currentOrder.tax || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-neutral-400 hover:text-neutral-900 transition mb-6"
        >
          <HiArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Order Details
            </p>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-extralight">
                <span className="font-mono">#{currentOrder.orderNumber}</span>
              </h1>
              <span className={`px-3 py-1 text-[10px] tracking-[0.1em] uppercase ${
                currentOrder.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                currentOrder.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-200" :
                currentOrder.status === "Shipped" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {currentOrder.status}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-2 font-light">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2.5 border border-neutral-200 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition flex items-center gap-2">
              <HiOutlineDocument className="w-4 h-4" /> Invoice
            </button>
            <button className="px-5 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition flex items-center gap-2">
              <HiOutlineArrowPath className="w-4 h-4" /> Buy Again
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                  <HiOutlineTruck className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Shipment Status
                  </p>
                  <p className="text-sm font-light">{currentOrder.status}</p>
                </div>
              </div>
              {currentOrder.trackingId && (
                <div className="text-right">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">Tracking</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{currentOrder.trackingId}</span>
                    <button onClick={handleCopy} className="text-neutral-400 hover:text-neutral-900 transition">
                      {copied ? <HiCheck className="w-4 h-4 text-emerald-600" /> : <HiOutlineClipboard className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-[2px] bg-neutral-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-neutral-900"
                />
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="flex justify-between">
              {timeline.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-3 h-3 border mb-2 ${
                    step.completed ? "bg-neutral-900 border-neutral-900" : "bg-white border-neutral-300"
                  }`} />
                  <span className={`text-[10px] tracking-wide uppercase ${
                    step.completed ? "text-neutral-900" : "text-neutral-400"
                  }`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-neutral-200"
          >
            <div className="p-6 border-b border-neutral-100">
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                Items ({currentOrder.items.length})
              </p>
            </div>

            <div className="divide-y divide-neutral-100">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="p-6 flex gap-4">
                  <div className="w-20 h-24 bg-neutral-100 relative flex-shrink-0">
                    <Image 
                      src={item.image || "/Hero/Product1.avif"} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-neutral-900 mb-1">{item.name}</p>
                    <p className="text-xs text-neutral-500 mb-2">
                      Size: {item.size} · Color: {item.color}
                    </p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                <HiOutlineMapPin className="w-5 h-5 text-neutral-600" />
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                Shipping Address
              </p>
            </div>
            <div className="text-sm font-light text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-900 mb-1">
                {currentOrder.shippingAddress?.name || "Customer"}
              </p>
              <p>{currentOrder.shippingAddress?.street}</p>
              <p>
                {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.zip}
              </p>
              <p className="mt-2">{currentOrder.shippingAddress?.phone}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-neutral-200 p-6 sticky top-24"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-6">
              Order Summary
            </p>

            <div className="space-y-3 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 italic" : ""}>
                  {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 mt-6 pt-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                  Total
                </span>
                <span className="text-xl font-light">
                  ₹{currentOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t border-neutral-100 mt-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                  <HiOutlineCreditCard className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Payment
                  </p>
                  <p className="text-sm font-light">
                    {currentOrder.paymentMethod || "Razorpay"}
                  </p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-8 p-4 bg-neutral-50 border border-neutral-100">
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">
                Need Help?
              </p>
              <Link 
                href="/account/support"
                className="text-sm font-light text-neutral-600 hover:text-neutral-900 transition underline underline-offset-4"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
