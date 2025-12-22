"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; 
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  HiOutlineArrowLeft, 
  HiOutlinePrinter, 
  HiOutlineTruck, 
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlinePhone
} from "react-icons/hi2";

// --- MOCK DATA ---
const ORDER = {
  id: "ORD-9921",
  date: "Dec 14, 2024",
  time: "10:42 AM",
  customer: {
    name: "Sumit Kumar",
    email: "sumit@example.com",
    phone: "+91 98765 43210",
    orders_count: 5
  },
  status: "Processing", 
  payment: {
    status: "Paid",
    method: "UPI"
  },
  shipping: {
    line1: "Flat 402, Sunshine Apartments",
    line2: "Indiranagar, 100ft Road",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560038"
  },
  items: [
    { id: 101, name: "Oversized Street Hoodie", sku: "HD-BLK-L", price: 2499, quantity: 1, img: "/Hero/Product1.avif", variant: "L / Black" },
    { id: 102, name: "Classic Beige Knit", sku: "KN-BGE-M", price: 1899, quantity: 1, img: "/Hero/Product2.avif", variant: "M / Beige" },
  ],
  totals: {
    subtotal: 4398,
    discount: 0,
    shipping: 100,
    tax: 0,
    total: 4498
  },
  timeline: [
    { id: 1, status: "Order Placed", date: "Dec 14, 10:42 AM", completed: true },
    { id: 2, status: "Payment Confirmed", date: "Dec 14, 10:43 AM", completed: true },
    { id: 3, status: "Processing", date: "Dec 14, 11:00 AM", completed: true },
    { id: 4, status: "Shipped", date: "—", completed: false },
    { id: 5, status: "Delivered", date: "—", completed: false },
  ]
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Shipped: "bg-violet-50 text-violet-700 border-violet-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

export default function OrderDetailPage() {
  const params = useParams();
  const [orderStatus, setOrderStatus] = useState(ORDER.status);

  const handleFulfill = () => {
    setOrderStatus("Shipped");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders"
            className="p-2 border border-neutral-200 hover:border-neutral-900 transition"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extralight text-neutral-900">
                <span className="italic">{ORDER.id}</span>
              </h1>
              <StatusBadge status={ORDER.payment.status} />
              <StatusBadge status={orderStatus} />
            </div>
            <p className="text-[11px] text-neutral-500">{ORDER.date} at {ORDER.time}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2.5 border border-neutral-200 text-neutral-700 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition flex items-center gap-2">
            <HiOutlinePrinter className="w-4 h-4" /> Invoice
          </button>
          {orderStatus !== "Shipped" && orderStatus !== "Delivered" && (
            <button 
              onClick={handleFulfill}
              className="px-4 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition flex items-center gap-2"
            >
              <HiOutlineTruck className="w-4 h-4" /> Ship Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-neutral-200 bg-white"
          >
            <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                Order Items
              </h2>
              <span className="text-[10px] text-neutral-500">{ORDER.items.length} items</span>
            </div>
            
            <div className="divide-y divide-neutral-100">
              {ORDER.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 items-center hover:bg-neutral-50/50 transition">
                  <div className="relative w-16 h-20 bg-neutral-100 flex-shrink-0">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-neutral-900">{item.name}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{item.variant}</p>
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">₹{item.price.toLocaleString()} × {item.quantity}</p>
                    <p className="text-sm font-light text-neutral-900 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 space-y-2">
              <div className="flex justify-between text-sm font-light">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-900">₹{ORDER.totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-light">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-900">₹{ORDER.totals.shipping.toLocaleString()}</span>
              </div>
              {ORDER.totals.discount > 0 && (
                <div className="flex justify-between text-sm font-light">
                  <span className="text-neutral-500">Discount</span>
                  <span className="text-emerald-600">-₹{ORDER.totals.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-light pt-3 border-t border-neutral-200 mt-3">
                <span className="text-neutral-900">Total</span>
                <span className="text-neutral-900">₹{ORDER.totals.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-neutral-200 bg-white p-6"
          >
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
              Order Timeline
            </h2>
            
            <div className="space-y-4">
              {ORDER.timeline.map((event, i) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 border-2 ${event.completed ? 'bg-neutral-900 border-neutral-900' : 'bg-white border-neutral-300'}`} />
                    {i < ORDER.timeline.length - 1 && (
                      <div className={`w-px h-8 ${event.completed ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
                    )}
                  </div>
                  <div className="-mt-0.5">
                    <p className={`text-sm font-light ${event.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {event.status}
                    </p>
                    <p className="text-[11px] text-neutral-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-neutral-200 bg-white p-6"
          >
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
              Customer
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-light text-neutral-900">{ORDER.customer.name}</p>
                <p className="text-[11px] text-neutral-500">{ORDER.customer.orders_count} orders</p>
              </div>
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <div className="flex items-center gap-3">
                  <HiOutlineEnvelope className="w-4 h-4 text-neutral-400" />
                  <a href={`mailto:${ORDER.customer.email}`} className="text-sm font-light text-neutral-900 hover:underline underline-offset-4">
                    {ORDER.customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlinePhone className="w-4 h-4 text-neutral-400" />
                  <a href={`tel:${ORDER.customer.phone}`} className="text-sm font-light text-neutral-900 hover:underline underline-offset-4">
                    {ORDER.customer.phone}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-neutral-200 bg-white p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineMapPin className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                Shipping Address
              </h2>
            </div>
            <div className="text-sm font-light text-neutral-900 leading-relaxed">
              <p>{ORDER.shipping.line1}</p>
              <p>{ORDER.shipping.line2}</p>
              <p>{ORDER.shipping.city}, {ORDER.shipping.state}</p>
              <p>{ORDER.shipping.zip}</p>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-neutral-200 bg-white p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineCreditCard className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                Payment
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-light text-neutral-900">{ORDER.payment.method}</span>
              <StatusBadge status={ORDER.payment.status} />
            </div>
            <p className="text-lg font-light text-neutral-900 mt-3">
              ₹{ORDER.totals.total.toLocaleString()}
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <button className="w-full py-3 border border-neutral-200 text-neutral-700 text-[10px] tracking-[0.15em] uppercase hover:border-neutral-900 transition flex items-center justify-center gap-2">
              <HiOutlineEnvelope className="w-4 h-4" /> Email Customer
            </button>
            <button className="w-full py-3 border border-red-200 text-red-600 text-[10px] tracking-[0.15em] uppercase hover:bg-red-50 transition">
              Cancel Order
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
