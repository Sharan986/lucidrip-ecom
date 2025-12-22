"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineShoppingBag, 
  HiOutlineTruck,
  HiChevronRight,
  HiXMark
} from "react-icons/hi2";
import { useOrderStore, Order } from "@/store/useOrderStore";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Delivered": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "Shipped": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    case "Processing": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    case "Cancelled": return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };
    case "Returned": return { bg: "bg-neutral-100", text: "text-neutral-600", border: "border-neutral-200" };
    default: return { bg: "bg-neutral-50", text: "text-neutral-600", border: "border-neutral-200" };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "HISTORY">("ALL");
  const { orders, isLoading, fetchOrders, cancelOrder } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order: Order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return ["Processing", "Shipped"].includes(order.status);
    if (activeTab === "HISTORY") return ["Delivered", "Cancelled", "Returned"].includes(order.status);
    return true;
  });

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      await cancelOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
              Purchases
            </p>
            <h2 className="text-2xl font-extralight tracking-wide">
              Order <span className="italic">History</span>
            </h2>
          </div>
          
          {/* Tabs */}
          <div className="flex border border-neutral-200">
            {(["ALL", "ACTIVE", "HISTORY"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-xs tracking-[0.1em] uppercase transition-all ${
                  activeTab === tab 
                    ? "bg-neutral-900 text-white" 
                    : "text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {tab === "ALL" ? "All" : tab === "ACTIVE" ? "Active" : "Past"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-neutral-200 p-16 text-center"
          >
            <div className="w-8 h-8 border border-neutral-900 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-500">Loading orders...</p>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-neutral-200 p-16 text-center"
          >
            <div className="w-20 h-20 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
              <HiOutlineShoppingBag className="w-10 h-10 text-neutral-300" />
            </div>
            <h3 className="text-lg font-extralight text-neutral-900 mb-2">
              No orders found
            </h3>
            <p className="text-sm text-neutral-500 mb-8 max-w-xs mx-auto">
              {activeTab === "ALL" 
                ? "You haven't placed any orders yet" 
                : `No ${activeTab.toLowerCase()} orders`}
            </p>
            <Link 
              href="/products"
              className="inline-block bg-neutral-900 text-white px-8 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, index) => {
              const statusStyle = getStatusStyles(order.status);
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-neutral-100">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-0.5">
                          Order
                        </p>
                        <p className="font-mono font-medium">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-0.5">
                          Date
                        </p>
                        <p className="font-light">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-0.5">
                          Total
                        </p>
                        <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                        <span className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {order.status}
                        </span>
                        <Link 
                          href={`/account/orders/${order._id}`}
                          className="flex items-center gap-1 text-xs font-light text-neutral-600 hover:text-neutral-900 transition group"
                        >
                          Details
                          <HiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex-shrink-0 flex gap-4">
                          <div className="w-16 h-20 bg-neutral-100 relative">
                            <Image 
                              src={item.image || "/Hero/Product1.avif"} 
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-light text-neutral-900 mb-1 truncate max-w-[150px]">
                              {item.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {item.size} · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-20 bg-neutral-100 flex items-center justify-center">
                          <span className="text-sm text-neutral-500">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100">
                      {order.trackingId && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <HiOutlineTruck className="w-4 h-4" />
                          <span className="font-mono text-xs">{order.trackingId}</span>
                        </div>
                      )}
                      {order.status === "Processing" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="ml-auto flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition"
                        >
                          <HiXMark className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
