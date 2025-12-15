"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineChevronRight, HiOutlineShoppingBag } from "react-icons/hi2";

// 1. DUMMY DATA
// 1. Create a placeholder string (It renders a simple grey "Product" box)
const MOCK_ORDERS = [
  {
    id: "ORD-9921",
    date: "Dec 12, 2024",
    total: 2499,
    status: "Delivered",
    img: "/Hero/Product1.avif",
    itemsCount: 2,
    itemName: "Oversized Street Hoodie",
    slug: "oversized-street-hoodie", // ✅ Added Slug
  },
  {
    id: "ORD-9922",
    date: "Dec 14, 2024",
    total: 1899,
    status: "Processing",
    img: "/Hero/Product2.avif",
    itemsCount: 1,
    itemName: "Classic Beige Knit",
    slug: "classic-beige-knit",
  },
  {
    id: "ORD-9923",
    date: "Nov 20, 2024",
    total: 2100,
    status: "Cancelled",
    img: "/Hero/Product3.avif",
    itemsCount: 1,
    itemName: "Urban Cargo Sweatshirt",
    slug: "urban-cargo-sweatshirt",
  },
  {
    id: "ORD-9924",
    date: "Oct 05, 2024",
    total: 1599,
    status: "Delivered",
    img: "/Hero/Product4.avif",
    itemsCount: 1,
    itemName: "Signature Fleece Pullover",
    slug: "signature-fleece-pullover",
  },
  {
    id: "ORD-9925",
    date: "Sep 28, 2024",
    total: 1299,
    status: "Delivered",
    img: "/Hero/Product2.avif",
    itemsCount: 3,
    itemName: "Essential Crewneck",
    slug: "essential-crewneck",
  },
  {
    id: "ORD-9926",
    date: "Aug 15, 2024",
    total: 2800,
    status: "Returned",
    img: "/Hero/Product1.avif",
    itemsCount: 1,
    itemName: "Vintage Cable Knit",
    slug: "vintage-cable-knit",
  },
  {
    id: "ORD-9927",
    date: "Jul 10, 2024",
    total: 3200,
    status: "Delivered",
    img: "/Hero/Product2.avif",
    itemsCount: 2,
    itemName: "Striped Wool Cardigan",
    slug: "striped-wool-cardigan",
  },
  {
    id: "ORD-9928",
    date: "Jun 01, 2024",
    total: 1999,
    status: "Delivered",
    img: "/Hero/Product3.avif",
    itemsCount: 1,
    itemName: "Thermal Zip-Up Hoodie",
    slug: "thermal-zip-up-hoodie",
  },
];
const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div 
            key={order.id} 
            className="group bg-white border border-gray-100 rounded-xl p-4 md:p-6 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            {/* Image Preview */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
              <Image 
                src={order.img} 
                alt="Product" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{order.itemName}</h3>
                  <p className="text-sm text-gray-500">
                    {order.itemsCount > 1 ? `+ ${order.itemsCount - 1} other items` : ""}
                  </p>
                </div>
                {/* Price (Visible on Desktop) */}
                <p className="hidden md:block font-bold text-lg">₹{order.total.toLocaleString()}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Ordered on {order.date}
                </span>
              </div>
            </div>

            {/* Mobile Price & Action */}
            <div className="w-full md:w-auto flex justify-between items-center md:flex-col md:items-end gap-2 pl-2 md:pl-0 border-t md:border-0 border-gray-50 pt-3 md:pt-0">
               <span className="md:hidden font-bold text-lg">₹{order.total.toLocaleString()}</span>
               
              <Link 
      href={`/product/${order.slug}`} 
      className="flex items-center gap-2 text-sm font-bold text-black hover:underline underline-offset-4"
    >
      View Details <HiOutlineChevronRight />
    </Link>``
            </div>
          </div>
        ))}
        
        {/* Empty State (Hidden if orders exist) */}
        {MOCK_ORDERS.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <HiOutlineShoppingBag className="text-3xl" />
             </div>
             <h3 className="font-bold text-gray-900">No orders yet</h3>
             <p className="text-sm text-gray-500 mb-6">Go buy some drip first.</p>
             <Link href="/" className="bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800">
               Start Shopping
             </Link>
          </div>
        )}

      </div>
    </div>
  );
}