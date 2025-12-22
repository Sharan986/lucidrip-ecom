"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HiArrowRight,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineClock,
  HiArrowTrendingUp,
  HiArrowTrendingDown
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAdminDataStore, DashboardStat } from "@/store/useAdminDataStore";

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toUpperCase();
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
    SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-neutral-100 text-neutral-500 border-neutral-200"
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[normalizedStatus] || styles.PENDING}`}>
      {(normalizedStatus === "PENDING" || normalizedStatus === "PROCESSING") && <span className="w-1 h-1 bg-amber-500 animate-pulse" />}
      {status}
    </span>
  );
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Today's Revenue": HiOutlineBanknotes,
  "Pending Orders": HiOutlineShoppingBag,
  "New Customers": HiOutlineUsers,
  "Low Stock Items": HiOutlineCube,
};

export default function AdminDashboard() {
  const { adminToken } = useAdminAuthStore();
  const { 
    dashboardStats, 
    recentActivity, 
    recentOrders, 
    isLoading, 
    error,
    fetchDashboardData 
  } = useAdminDataStore();
  
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (adminToken && !dataLoaded) {
      fetchDashboardData(adminToken);
      setDataLoaded(true);
    }
  }, [adminToken, fetchDashboardData, dataLoaded]);

  // Refresh data every 30 seconds for live updates
  useEffect(() => {
    if (!adminToken) return;
    
    const interval = setInterval(() => {
      fetchDashboardData(adminToken);
    }, 30000);

    return () => clearInterval(interval);
  }, [adminToken, fetchDashboardData]);

  // Fallback stats when no data
  const displayStats: DashboardStat[] = dashboardStats.length > 0 ? dashboardStats : [
    { label: "Today's Revenue", value: "₹0", trend: "0%", desc: "vs yesterday", positive: true },
    { label: "Pending Orders", value: "0", trend: "0", desc: "requires action", positive: true },
    { label: "New Customers", value: "0", trend: "+0", desc: "this week", positive: true },
    { label: "Low Stock Items", value: "0", trend: "0", desc: "restock needed", positive: true },
  ];

  return (
    <div className="space-y-8">
      
      {/* --- WELCOME HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl md:text-3xl font-extralight text-neutral-900">
            Welcome <span className="italic">back</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products/add"
            className="px-4 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition flex items-center gap-2"
          >
            Add Product
            <HiArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {displayStats.map((stat, i) => {
          const Icon = iconMap[stat.label] || HiOutlineCube;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group border border-neutral-200 p-6 hover:border-neutral-900 transition-colors bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center group-hover:border-neutral-900 transition-colors">
                  <Icon className="w-4 h-4 text-neutral-600" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {stat.positive ? <HiArrowTrendingUp className="w-3 h-3" /> : <HiArrowTrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              
              <h3 className="text-2xl font-extralight text-neutral-900 mb-1">
                {isLoading ? "..." : stat.value}
              </h3>
              <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                {stat.label}
              </p>
              <p className="text-[10px] text-neutral-400 mt-1 font-light">
                {stat.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* --- ACTIVITY FEED --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-1 border border-neutral-200 bg-white"
        >
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">
                Live Feed
              </p>
              <h2 className="text-sm font-light text-neutral-900">Recent Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-neutral-400">Live</span>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-100">
            {isLoading ? (
              <div className="p-8 text-center text-neutral-400 text-sm">Loading...</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-sm">No recent activity</div>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${
                      item.type === 'order' ? 'bg-blue-500' :
                      item.type === 'alert' ? 'bg-red-500' :
                      item.type === 'payment' ? 'bg-emerald-500' : 'bg-neutral-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-light text-neutral-900 leading-relaxed">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <HiOutlineClock className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] text-neutral-400">{item.time}</span>
                        {item.amount && (
                          <span className="text-[10px] font-medium text-neutral-600 ml-auto">
                            {item.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-neutral-200 text-center">
            <Link href="/admin/orders" className="text-xs font-light text-neutral-500 hover:text-neutral-900 transition underline underline-offset-4">
              View all activity
            </Link>
          </div>
        </motion.div>

        {/* --- RECENT ORDERS TABLE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2 border border-neutral-200 bg-white"
        >
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">
                Transactions
              </p>
              <h2 className="text-sm font-light text-neutral-900">Recent Orders</h2>
            </div>
            <Link 
              href="/admin/orders" 
              className="text-xs font-light text-neutral-500 hover:text-neutral-900 transition flex items-center gap-1"
            >
              View all <HiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                    Order
                  </th>
                  <th className="px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">
                    Method
                  </th>
                  <th className="px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal text-right">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-400 text-sm">
                      Loading orders...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-400 text-sm">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="text-xs font-light text-neutral-900 hover:underline">
                          #{order.id.includes('-') ? order.id.split('-').slice(-1)[0] : order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-light text-neutral-900">{order.customer}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{order.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] tracking-wide px-2 py-1 border border-neutral-200 text-neutral-600">
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-light text-neutral-900">₹{order.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* --- QUICK ACTIONS --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Product", href: "/admin/products/add", icon: HiOutlineCube },
            { label: "View Orders", href: "/admin/orders", icon: HiOutlineShoppingBag },
            { label: "Customers", href: "/admin/customers", icon: HiOutlineUsers },
            { label: "Payments", href: "/admin/payments", icon: HiOutlineBanknotes },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="group p-4 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 transition-all"
              >
                <Icon className="w-5 h-5 text-neutral-400 group-hover:text-white mb-3 transition-colors" />
                <p className="text-xs font-light text-neutral-900 group-hover:text-white transition-colors">
                  {action.label}
                </p>
                <HiArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-white mt-2 transition-colors" />
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
