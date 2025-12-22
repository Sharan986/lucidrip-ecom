"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineEnvelope,
  HiOutlineEllipsisVertical
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAdminDataStore, Customer } from "@/store/useAdminDataStore";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive: "bg-neutral-100 text-neutral-500 border-neutral-200",
    New: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status] || styles.Inactive}`}>
      {status}
    </span>
  );
};

export default function CustomersPage() {
  const { adminToken } = useAdminAuthStore();
  const { customers, customerStats, isLoading, error, fetchCustomers } = useAdminDataStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"spent" | "orders" | "recent">("recent");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (adminToken && !dataLoaded) {
      fetchCustomers(adminToken);
      setDataLoaded(true);
    }
  }, [adminToken, fetchCustomers, dataLoaded]);

  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    if (sortBy === "spent") {
      filtered = [...filtered].sort((a, b) => b.spent - a.spent);
    } else if (sortBy === "orders") {
      filtered = [...filtered].sort((a, b) => b.orders - a.orders);
    }

    return filtered;
  }, [customers, searchQuery, statusFilter, sortBy]);

  const stats = customerStats;

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
          People
        </p>
        <h1 className="text-2xl font-extralight text-neutral-900">
          <span className="italic">Customers</span>
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* --- STATS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Customers", value: isLoading ? "..." : stats.total },
          { label: "Active", value: isLoading ? "..." : stats.active },
          { label: "Total Revenue", value: isLoading ? "..." : `₹${(stats.totalSpent / 1000).toFixed(1)}K` },
          { label: "Avg. Order Value", value: isLoading ? "..." : `₹${stats.avgOrderValue.toLocaleString()}` },
        ].map((stat, i) => (
          <div key={i} className="border border-neutral-200 bg-white p-4">
            <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">
              {stat.label}
            </p>
            <p className="text-xl font-light text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Status Tabs */}
        <div className="flex border border-neutral-200">
          {["All", "Active", "Inactive", "New"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase transition-all ${
                statusFilter === tab 
                  ? "bg-neutral-900 text-white" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "spent" | "orders" | "recent")}
            className="px-4 py-2.5 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="spent">Highest Spent</option>
            <option value="orders">Most Orders</option>
          </select>

          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
            />
          </div>
        </div>
      </div>

      {/* --- CUSTOMER TABLE --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-neutral-200 bg-white overflow-x-auto"
      >
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Customer</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Status</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Orders</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Spent</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Last Order</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Joined</th>
              <th className="text-right py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400 text-sm">
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400 text-sm">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer, i) => (
                <motion.tr 
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition"
                >
                  <td className="py-4 px-6">
                    <Link href={`/admin/customers/${customer.id}`} className="group">
                      <p className="text-sm font-light text-neutral-900 group-hover:underline underline-offset-4">
                        {customer.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{customer.email}</p>
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-light text-neutral-900">{customer.orders}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-light text-neutral-900">₹{customer.spent.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs text-neutral-500">{customer.lastOrder}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs text-neutral-500">{customer.joinedAt}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-neutral-100 transition">
                        <HiOutlineEnvelope className="w-4 h-4 text-neutral-500" />
                      </button>
                      <button className="p-2 hover:bg-neutral-100 transition">
                        <HiOutlineEllipsisVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
