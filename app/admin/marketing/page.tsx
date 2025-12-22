"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  HiPlus, 
  HiOutlineTrash, 
  HiOutlinePencilSquare,
  HiOutlineClipboardDocument
} from "react-icons/hi2";

// --- TYPES ---
interface Coupon {
  id: string;
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  status: "Active" | "Expired" | "Scheduled";
  expiresAt: string;
}

// --- MOCK DATA ---
const INITIAL_COUPONS: Coupon[] = [
  { id: "1", code: "SUMMER20", type: "Percentage", value: 20, minOrder: 1500, usageLimit: 500, used: 234, status: "Active", expiresAt: "Jun 30, 2024" },
  { id: "2", code: "FLAT500", type: "Fixed", value: 500, minOrder: 3000, usageLimit: 200, used: 200, status: "Expired", expiresAt: "May 15, 2024" },
  { id: "3", code: "NEWUSER10", type: "Percentage", value: 10, minOrder: 0, usageLimit: 1000, used: 567, status: "Active", expiresAt: "Dec 31, 2024" },
  { id: "4", code: "MONSOON25", type: "Percentage", value: 25, minOrder: 2000, usageLimit: 300, used: 0, status: "Scheduled", expiresAt: "Jul 15, 2024" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Expired: "bg-neutral-100 text-neutral-500 border-neutral-200",
    Scheduled: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Delete this coupon?")) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const stats = {
    active: coupons.filter(c => c.status === "Active").length,
    totalUsed: coupons.reduce((sum, c) => sum + c.used, 0),
    avgDiscount: Math.round(coupons.filter(c => c.type === "Percentage").reduce((sum, c) => sum + c.value, 0) / coupons.filter(c => c.type === "Percentage").length) || 0
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Promotions
          </p>
          <h1 className="text-2xl font-extralight text-neutral-900">
            <span className="italic">Marketing</span>
          </h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition flex items-center gap-2"
        >
          <HiPlus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* --- STATS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Active Coupons</p>
          <p className="text-2xl font-light text-neutral-900">{stats.active}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Total Redemptions</p>
          <p className="text-2xl font-light text-neutral-900">{stats.totalUsed}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Avg. Discount</p>
          <p className="text-2xl font-light text-neutral-900">{stats.avgDiscount}%</p>
        </div>
      </motion.div>

      {/* --- COUPONS TABLE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-neutral-200 bg-white overflow-x-auto"
      >
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Code</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Discount</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Min. Order</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Usage</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Expires</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Status</th>
              <th className="text-right py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, i) => (
              <motion.tr 
                key={coupon.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-medium text-neutral-900 bg-neutral-100 px-2 py-1">
                      {coupon.code}
                    </span>
                    <button 
                      onClick={() => copyCode(coupon.code)}
                      className="p-1 hover:bg-neutral-100 transition"
                    >
                      <HiOutlineClipboardDocument className={`w-4 h-4 ${copiedCode === coupon.code ? 'text-emerald-600' : 'text-neutral-400'}`} />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-light text-neutral-900">
                    {coupon.type === "Percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-light text-neutral-600">
                    {coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString()}` : "None"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <span className="text-sm font-light text-neutral-900">
                      {coupon.used} / {coupon.usageLimit}
                    </span>
                    <div className="mt-1 h-1 bg-neutral-100 w-20">
                      <div 
                        className="h-full bg-neutral-900" 
                        style={{ width: `${(coupon.used / coupon.usageLimit) * 100}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs text-neutral-500">{coupon.expiresAt}</span>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={coupon.status} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 hover:bg-neutral-100 transition">
                      <HiOutlinePencilSquare className="w-4 h-4 text-neutral-500" />
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 hover:bg-red-50 transition"
                    >
                      <HiOutlineTrash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* --- CREATE COUPON MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md p-6 border border-neutral-200"
          >
            <h3 className="text-lg font-light text-neutral-900 mb-6">Create Coupon</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">Code</label>
                <input type="text" placeholder="e.g. SUMMER20" className="w-full px-4 py-2.5 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">Type</label>
                  <select className="w-full px-4 py-2.5 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition bg-white">
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">Value</label>
                  <input type="number" placeholder="20" className="w-full px-4 py-2.5 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">Min. Order</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-2.5 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">Usage Limit</label>
                  <input type="number" placeholder="100" className="w-full px-4 py-2.5 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] tracking-[0.1em] uppercase text-neutral-600 mb-2 block">Expires</label>
                <input type="date" className="w-full px-4 py-2.5 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition" />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-neutral-200 text-neutral-600 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
