"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { 
  HiArrowLeft, 
  HiOutlineClipboard, 
  HiCheck, 
  HiOutlineTruck, 
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShoppingBag
} from "react-icons/hi2";

// --- MOCK DATA ---
const MOCK_ORDER_DATA = {
  date: "Dec 14, 2024",
  total: 4398,
  subtotal: 4199,
  shipping: 199,
  tax: 0,
  status: "In Transit", 
  trackingId: "1Z999AA10123456784",
  carrier: "FedEx Express",
  estimatedDelivery: "Monday, Dec 18",
  
  timeline: [
    { status: "Ordered", date: "Dec 14", completed: true },
    { status: "Processing", date: "Dec 14", completed: true },
    { status: "Shipped", date: "Dec 15", completed: true }, 
    { status: "Out for Delivery", date: "Pending", completed: false },
    { status: "Delivered", date: "--", completed: false },
  ],

  items: [
    { 
      id: 101, 
      name: "Oversized Street Hoodie", 
      slug: "oversized-street-hoodie", 
      img: "/Hero/Product1.avif", 
      price: 2499, 
      size: "L", 
      color: "Black",
      quantity: 1 
    },
    { 
      id: 102, 
      name: "Classic Beige Knit", 
      slug: "classic-beige-knit", 
      img: "/Hero/Product2.avif", 
      price: 1899, 
      size: "M", 
      color: "Beige",
      quantity: 1 
    },
  ],

  shippingAddress: {
    name: "Arjun Kumar",
    line1: "Flat 402, Sunshine Apartments",
    line2: "Indiranagar, 100ft Road",
    city: "Bangalore, KA 560038",
    phone: "+91 98765 43210"
  },

  paymentMethod: {
    type: "Credit Card",
    last4: "4242",
    brand: "Visa"
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.slug as string; 
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_ORDER_DATA.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* --- HEADER SECTION --- */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <Link href="/account/orders" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition mb-6">
            <HiArrowLeft /> Back to History
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
                   Order <span className="font-mono font-normal text-gray-400">#{orderId}</span>
                 </h1>
                 <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wide rounded-full">
                    {MOCK_ORDER_DATA.status}
                 </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Placed on {MOCK_ORDER_DATA.date}</p>
            </div>

            <div className="flex gap-3">
               <button className="px-6 py-3 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wide hover:border-black transition flex items-center gap-2">
                  <HiOutlineDocumentText className="text-base" /> Invoice
               </button>
               <button className="px-6 py-3 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-zinc-800 transition flex items-center gap-2">
                  <HiOutlineShoppingBag className="text-base" /> Buy Again
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* =========================================
              LEFT COLUMN (Main Content)
              Span 8/12 columns
          ========================================= */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. TRACKING SECTION */}
            <section>
               <div className="flex justify-between items-end mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Estimated Delivery: {MOCK_ORDER_DATA.estimatedDelivery}</h2>
                  <div className="text-right">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tracking Number</p>
                     <div className="flex items-center gap-2 justify-end">
                        <span className="font-mono text-sm font-bold">{MOCK_ORDER_DATA.trackingId}</span>
                        <button onClick={handleCopy} className="text-gray-400 hover:text-black">
                           {copied ? <HiCheck className="text-green-500" /> : <HiOutlineClipboard />}
                        </button>
                     </div>
                  </div>
               </div>

               {/* Clean Progress Bar */}
               <div className="relative">
                  <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-gray-100">
                     {/* Calculate width based on completed steps */}
                     <div style={{ width: '60%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500"></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                     {MOCK_ORDER_DATA.timeline.map((step, i) => (
                        <div key={i} className={`flex flex-col items-center ${step.completed ? 'text-black font-bold' : ''}`}>
                           <span>{step.status}</span>
                           <span className="text-[10px] text-gray-400 font-normal mt-1">{step.date}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            <hr className="border-gray-100" />

            {/* 2. ITEMS LIST (Clean Rows) */}
            <section>
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Shipment Details</h3>
               <div className="space-y-8">
                  {MOCK_ORDER_DATA.items.map((item) => (
                     <div key={item.id} className="flex gap-6">
                        {/* Image */}
                        <div className="relative w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                           <Image src={item.img} alt={item.name} fill className="object-cover" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                           <div className="flex justify-between items-start">
                              <div>
                                 <Link href={`/product/${item.slug}`} className="font-bold text-base text-gray-900 hover:underline">
                                    {item.name}
                                 </Link>
                                 <p className="text-sm text-gray-500 mt-1">{item.size} / {item.color}</p>
                              </div>
                              <p className="font-mono text-sm font-bold">₹{item.price.toLocaleString()}</p>
                           </div>
                           
                           <div className="flex justify-between items-end">
                              <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                              <div className="flex gap-4">
                                 <button className="text-xs font-bold text-gray-400 hover:text-black transition">Return</button>
                                 <button className="text-xs font-bold text-black border-b border-black pb-0.5 hover:opacity-70">Write Review</button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
          </div>

          {/* =========================================
              RIGHT COLUMN (Sidebar / Receipt)
              Span 4/12 columns
          ========================================= */}
          <div className="lg:col-span-4">
             <div className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-8 sticky top-8">
                
                {/* Summary */}
                <div>
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Summary</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-500">
                         <span>Subtotal</span>
                         <span className="font-mono">₹{MOCK_ORDER_DATA.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                         <span>Shipping</span>
                         <span className="font-mono">₹{MOCK_ORDER_DATA.shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                         <span>Tax</span>
                         <span className="font-mono">₹{MOCK_ORDER_DATA.tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-200 my-4 pt-4 flex justify-between items-center">
                         <span className="font-bold text-gray-900">Total</span>
                         <span className="text-xl font-black text-gray-900 tracking-tight">₹{MOCK_ORDER_DATA.total.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                <hr className="border-gray-200" />

                {/* Shipping Details */}
                <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <HiOutlineMapPin /> Shipping To
                   </h3>
                   <div className="text-sm text-gray-600 leading-relaxed font-medium">
                      <p className="text-black font-bold">{MOCK_ORDER_DATA.shippingAddress.name}</p>
                      <p>{MOCK_ORDER_DATA.shippingAddress.line1}</p>
                      <p>{MOCK_ORDER_DATA.shippingAddress.line2}</p>
                      <p>{MOCK_ORDER_DATA.shippingAddress.city}</p>
                   </div>
                </div>

                <hr className="border-gray-200" />

                {/* Payment */}
                <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <HiOutlineCreditCard /> Payment
                   </h3>
                   <div className="flex items-center gap-3">
                      <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                         <span className="text-[10px] font-bold">VISA</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">•••• {MOCK_ORDER_DATA.paymentMethod.last4}</p>
                   </div>
                </div>

                {/* Support Link */}
                <div className="pt-4">
                   <button className="w-full py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-black hover:bg-black hover:text-white transition shadow-sm flex items-center justify-center gap-2">
                      <HiOutlineChatBubbleLeftRight /> Order Help
                   </button>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}