"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  HiOutlineChevronRight, 
  HiOutlineShoppingBag, 
  HiOutlineTruck,
  HiOutlineDocumentText,
  HiOutlineArrowPath,
  HiMagnifyingGlass
} from "react-icons/hi2";

// --- TYPES ---
interface OrderItem {
  name: string;
  slug: string;
  img: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  items: OrderItem[];
  trackingId?: string;
}

// --- DUMMY DATA (Expanded for realism) ---
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-8821-XJ",
    date: "Dec 14, 2024",
    total: 4398,
    status: "Processing",
    trackingId: "FEDEX-992123",
    items: [
      { name: "Oversized Street Hoodie", slug: "oversized-hoodie", img: "/Hero/Product1.avif", quantity: 1 },
      { name: "Classic Beige Knit", slug: "beige-knit", img: "/Hero/Product2.avif", quantity: 1 },
    ]
  },
  {
    id: "ORD-8819-AB",
    date: "Nov 20, 2024",
    total: 2100,
    status: "Delivered",
    trackingId: "DHL-112933",
    items: [
      { name: "Urban Cargo Sweatshirt", slug: "urban-cargo", img: "/Hero/Product3.avif", quantity: 1 }
    ]
  },
  {
    id: "ORD-8750-CK",
    date: "Oct 05, 2024",
    total: 1599,
    status: "Delivered",
    items: [
      { name: "Signature Fleece Pullover", slug: "fleece-pullover", img: "/Hero/Product4.avif", quantity: 1 }
    ]
  },
  {
    id: "ORD-8600-ZZ",
    date: "Aug 15, 2024",
    total: 2800,
    status: "Returned",
    items: [
      { name: "Vintage Cable Knit", slug: "cable-knit", img: "/Hero/Product1.avif", quantity: 1 }
    ]
  },
];

// --- HELPER: Status Styles ---
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-700 border-green-200";
    case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Processing": return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
    case "Returned": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-gray-50 text-gray-600";
  }
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "HISTORY">("ALL");

  // Filter Logic
  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return ["Processing", "Shipped"].includes(order.status);
    if (activeTab === "HISTORY") return ["Delivered", "Cancelled", "Returned"].includes(order.status);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* --- HEADER & TABS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Order History</h2>
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
          {(["ALL", "ACTIVE", "HISTORY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeTab === tab 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* --- ORDERS LIST --- */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
           // --- EMPTY STATE ---
           <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                <HiOutlineShoppingBag className="text-4xl" />
             </div>
             <h3 className="font-bold text-gray-900 text-lg mb-2">No orders found</h3>
             <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven&apos;t placed any orders in this category yet.</p>
             <Link href="/products" className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition">
               Start Shopping
             </Link>
           </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors shadow-sm"
            >
              
              {/* 1. ORDER HEADER (Meta Data) */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                      <p className="text-sm font-mono font-medium text-gray-900">{order.id}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date Placed</p>
                      <p className="text-sm font-medium text-gray-900">{order.date}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                      <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {order.trackingId && (
                      <div className="hidden md:block text-right">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tracking #</p>
                         <p className="text-sm font-mono text-blue-600 hover:underline cursor-pointer">{order.trackingId}</p>
                      </div>
                   )}
                   <Link 
                      href={`/account/orders/${order.id}`} // Assuming you'll make a detail page
                      className="text-xs font-bold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                   >
                      View Details
                   </Link>
                </div>
              </div>

              {/* 2. ORDER CONTENT */}
              <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                 
                 {/* Status Badge */}
                 <div className="w-full md:w-40 flex-shrink-0">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyles(order.status)}`}>
                       {order.status === 'Processing' && <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"/>}
                       {order.status === 'Delivered' && <span className="w-2 h-2 bg-green-500 rounded-full"/>}
                       {order.status}
                    </span>
                    {order.status === 'Processing' && (
                       <p className="text-xs text-gray-400 mt-2">Est. Delivery: Tomorrow</p>
                    )}
                 </div>

                 {/* Products List */}
                 <div className="flex-1 w-full space-y-4">
                    {order.items.map((item, idx) => (
                       <div key={idx} className="flex gap-4 items-center">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                             <Image src={item.img} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                             <Link href={`/product/${item.slug}`} className="font-bold text-sm text-gray-900 hover:underline line-clamp-1">
                                {item.name}
                             </Link>
                             <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Action Buttons */}
                 <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-gray-100">
                    {order.status === 'Delivered' ? (
                       <>
                         <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-zinc-800 transition">
                            <HiOutlineArrowPath className="text-base" /> Buy Again
                         </button>
                         <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition">
                            <HiOutlineDocumentText className="text-base" /> Invoice
                         </button>
                       </>
                    ) : order.status === 'Processing' ? (
                       <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-700 transition">
                          <HiOutlineTruck className="text-base" /> Track Package
                       </button>
                    ) : null}
                 </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}