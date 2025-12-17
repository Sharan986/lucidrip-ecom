"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; 
import Image from "next/image";
import { 
  HiArrowLeft, 
  HiOutlinePrinter, 
  HiOutlineEnvelope, // 👈 1. CHANGED THIS (Fixed Import)
  HiOutlineTruck, 
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineUser
} from "react-icons/hi2";

// --- MOCK DATA ---
const ORDER = {
  id: "ORD-9921",
  date: "Dec 14, 2024 at 10:42 am",
  customer: {
    name: "Sumit Kumar",
    email: "sumit@example.com",
    phone: "+91 98765 43210",
    orders_count: 5
  },
  status: "Unfulfilled", 
  payment_status: "Paid", 
  shipping_address: {
    line1: "Flat 402, Sunshine Apartments",
    line2: "Indiranagar, 100ft Road",
    city: "Bangalore",
    state: "KA",
    zip: "560038",
    country: "India"
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
    { id: 1, type: "order_placed", text: "Order placed by Sumit Kumar", date: "Dec 14, 10:42 am" },
    { id: 2, type: "payment_verified", text: "Payment of ₹4,498 verified via UPI", date: "Dec 14, 10:43 am" },
  ]
};

export default function AdminOrderDetails() {
  const params = useParams();
  const [status, setStatus] = useState(ORDER.status);

  // --- HANDLERS ---
  const handleFulfill = () => {
    setStatus("Fulfilled");
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 text-zinc-900 font-sans">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
           <div className="flex items-center gap-4">
              <Link href="/admin/orders" className="p-2 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 text-zinc-500 transition">
                 <HiArrowLeft />
              </Link>
              <div>
                 <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">Order #{ORDER.id}</h1>
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-yellow-200">
                       {ORDER.payment_status}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border ${status === 'Fulfilled' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                       {status}
                    </span>
                 </div>
                 <p className="text-sm text-zinc-500 mt-1">{ORDER.date}</p>
              </div>
           </div>

           <div className="flex gap-2">
              <button className="px-4 py-2 border border-zinc-200 bg-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition flex items-center gap-2">
                 <HiOutlinePrinter className="text-lg" /> Invoice
              </button>
              {status !== "Fulfilled" && (
                 <button 
                   onClick={handleFulfill}
                   className="px-6 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition shadow-lg flex items-center gap-2"
                 >
                    <HiOutlineTruck className="text-lg" /> Fulfill Item
                 </button>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* ====================
               LEFT COLUMN (Details)
           ==================== */}
           <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Order Items */}
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider">Line Items</h3>
                    <p className="text-xs font-bold text-zinc-400">{ORDER.items.length} Items</p>
                 </div>
                 <div className="divide-y divide-zinc-100">
                    {ORDER.items.map((item) => (
                       <div key={item.id} className="p-4 flex gap-4 items-center group hover:bg-zinc-50/50 transition">
                          <div className="relative w-16 h-16 border border-zinc-200 rounded-md overflow-hidden bg-zinc-100">
                             <Image src={item.img} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                             <p className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition cursor-pointer">{item.name}</p>
                             <p className="text-xs text-zinc-500 mt-0.5">{item.variant}</p>
                             <p className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">SKU: {item.sku}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-medium text-zinc-900">₹{item.price.toLocaleString()} x {item.quantity}</p>
                             <p className="text-sm font-bold text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 {/* Financials */}
                 <div className="bg-zinc-50/50 p-6 border-t border-zinc-100 space-y-2">
                    <div className="flex justify-between text-sm text-zinc-500">
                       <span>Subtotal</span>
                       <span>₹{ORDER.totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-500">
                       <span>Shipping</span>
                       <span>₹{ORDER.totals.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-500">
                       <span>Tax</span>
                       <span>₹{ORDER.totals.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-zinc-900 pt-4 border-t border-zinc-200 mt-4">
                       <span>Total</span>
                       <span>₹{ORDER.totals.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 pt-1">
                       <span>Paid by customer</span>
                       <span>₹{ORDER.totals.total.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              {/* 2. Timeline */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider mb-6">Timeline</h3>
                 <div className="space-y-6 relative pl-2">
                    {/* Vertical Line */}
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-zinc-100"></div>
                    
                    {ORDER.timeline.map((event) => (
                       <div key={event.id} className="relative flex gap-4 pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 bg-zinc-200 rounded-full border-2 border-white"></div>
                          <div>
                             <p className="text-sm text-zinc-900">{event.text}</p>
                             <p className="text-xs text-zinc-400 mt-1">{event.date}</p>
                          </div>
                       </div>
                    ))}
                    
                    {/* Add Comment Input */}
                    <div className="relative flex gap-4 pl-6 mt-4">
                       <div className="absolute left-0 top-3 w-4 h-4 bg-zinc-200 rounded-full border-2 border-white"></div>
                       <div className="w-full">
                          <input 
                            type="text" 
                            placeholder="Leave a comment..." 
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-400 transition"
                          />
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* ====================
               RIGHT COLUMN (Customer & Meta)
           ==================== */}
           <div className="lg:col-span-1 space-y-6">
              
              {/* Customer Card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Customer</h3>
                    <Link href={`/admin/customers/${ORDER.customer.email}`} className="text-blue-600 text-xs font-bold hover:underline">View Profile</Link>
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                       <HiOutlineUser className="text-lg" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-zinc-900 hover:text-blue-600 cursor-pointer">{ORDER.customer.name}</p>
                       <p className="text-xs text-zinc-500">{ORDER.customer.orders_count} orders</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3 pt-4 border-t border-zinc-100">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Contact Info</h4>
                       <button className="text-zinc-400 hover:text-black">
                          <HiOutlineEnvelope /> {/* 👈 2. CORRECTED USAGE */}
                       </button>
                    </div>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">{ORDER.customer.email}</p>
                    <p className="text-sm text-zinc-600">{ORDER.customer.phone}</p>
                 </div>
                 
                 <div className="space-y-3 pt-4 border-t border-zinc-100 mt-4">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Shipping Address</h4>
                       <button className="text-zinc-400 hover:text-black"><HiOutlineMapPin /></button>
                    </div>
                    <div className="text-sm text-zinc-600 leading-relaxed">
                       <p>{ORDER.shipping_address.line1}</p>
                       <p>{ORDER.shipping_address.line2}</p>
                       <p>{ORDER.shipping_address.city}, {ORDER.shipping_address.state} {ORDER.shipping_address.zip}</p>
                       <p>{ORDER.shipping_address.country}</p>
                    </div>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-zinc-100 mt-4">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Billing Address</h4>
                    </div>
                    <p className="text-sm text-zinc-500 italic">Same as shipping address</p>
                 </div>
              </div>

              {/* Tags / Notes */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-4">Tags</h3>
                 <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded border border-zinc-200">VIP</span>
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded border border-zinc-200">High Value</span>
                 </div>
                 <input 
                   type="text" 
                   placeholder="Add tag..." 
                   className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 transition"
                 />
              </div>

           </div>

        </div>
      </div>
    </div>
  );
}