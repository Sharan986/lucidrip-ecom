"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowDownTray, 
  HiOutlineEye, 
  HiOutlineTruck, 
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

// --- TYPES ---
type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Out for Delivery" | "Returned";

interface Order {
  _id: string;
  orderNumber: string;
  userId: { username: string; email: string } | null;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  status: OrderStatus;
  items: Array<{ productId: string; name: string; quantity: number }>;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  paymentMethod: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    "Out for Delivery": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-neutral-100 text-neutral-500 border-neutral-200",
    Returned: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status] || styles.Processing}`}>
      {status === "Processing" && <span className="w-1 h-1 bg-amber-500 animate-pulse" />}
      {status}
    </span>
  );
};

const PaymentBadge = ({ payment }: { payment: string }) => {
  const styles: Record<string, string> = {
    Paid: "text-emerald-600",
    Refunded: "text-neutral-500",
    Pending: "text-amber-600",
    Failed: "text-red-600",
  };

  return (
    <span className={`text-[10px] tracking-[0.1em] uppercase ${styles[payment] || ''}`}>
      {payment}
    </span>
  );
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function OrdersPage() {
  const { adminToken } = useAdminAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!adminToken) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [adminToken]);

  const filteredData = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.status === activeTab;
      const customerName = order.userId?.username || order.shippingAddress?.name || "";
      const customerEmail = order.userId?.email || order.shippingAddress?.email || "";
      const matchesSearch = 
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMarkShipped = async (orderId: string) => {
    if (!adminToken) return;
    
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "Shipped" }),
      });

      if (response.ok) {
        setOrders((prev) => 
          prev.map(order => 
            order._id === orderId ? { ...order, status: "Shipped" as OrderStatus } : order
          )
        );
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleExport = () => {
    const headers = ["Order ID,Customer,Email,Date,Amount,Status,Payment\n"];
    const rows = filteredData.map(o => {
      const customerName = o.userId?.username || o.shippingAddress?.name || "N/A";
      const customerEmail = o.userId?.email || o.shippingAddress?.email || "N/A";
      return `${o.orderNumber},${customerName},${customerEmail},${formatDate(o.createdAt)},${o.totalAmount},${o.status},${o.paymentStatus}`;
    });
    const blob = new Blob([...headers, ...rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Management
          </p>
          <h1 className="text-2xl font-extralight text-neutral-900">
            <span className="italic">Orders</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2.5 border border-neutral-200 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition flex items-center gap-2"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex border border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase transition-all ${
                activeTab === tab 
                  ? "bg-neutral-900 text-white" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-neutral-200 bg-white"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                  Payment
                </th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400 text-sm">
                    Loading orders...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400 text-sm">
                    No orders found
                  </td>
                </tr>
              ) : (
                paginatedData.map((order) => {
                  const customerName = order.userId?.username || order.shippingAddress?.name || "N/A";
                  const customerEmail = order.userId?.email || order.shippingAddress?.email || "";
                  
                  return (
                    <tr key={order._id} className="group hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link 
                          href={`/admin/orders/${order._id}`} 
                          className="text-xs font-light text-neutral-900 hover:underline underline-offset-4"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-light text-neutral-900">{customerName}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{customerEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-light text-neutral-600">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <PaymentBadge payment={order.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-light text-neutral-900">₹{order.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/orders/${order._id}`}
                            className="p-2 border border-neutral-200 hover:border-neutral-900 transition"
                          >
                            <HiOutlineEye className="w-3 h-3 text-neutral-500" />
                          </Link>
                          {order.status === "Processing" && (
                            <button 
                              onClick={() => handleMarkShipped(order._id)}
                              className="p-2 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition"
                            >
                              <HiOutlineTruck className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
          <p className="text-xs font-light text-neutral-500">
            {filteredData.length > 0 
              ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length}`
              : "No orders"
            }
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-neutral-200 hover:border-neutral-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-xs font-light text-neutral-600 px-2">
              {currentPage} / {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-neutral-200 hover:border-neutral-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
