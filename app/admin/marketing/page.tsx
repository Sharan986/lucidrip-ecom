"use client";

import React from "react";
import Link from "next/link";
import { 
  HiPlus, 
  HiOutlineTag, 
  HiOutlineClipboard, 
  HiOutlineChartBar,
  HiOutlineClock
} from "react-icons/hi2";

// --- MOCK DATA ---
const COUPONS = [
  { 
    id: "CPN-001", 
    code: "WELCOME20", 
    type: "Percentage", 
    value: "20%", 
    usage: { used: 1450, limit: null }, 
    status: "Active", 
    revenue: 450000, 
    ends: "No Expiry" 
  },
  { 
    id: "CPN-002", 
    code: "FLASHSALE", 
    type: "Fixed Amount", 
    value: "₹500", 
    usage: { used: 450, limit: 500 }, 
    status: "Active", 
    revenue: 225000, 
    ends: "Dec 31, 2024" 
  },
  { 
    id: "CPN-003", 
    code: "VIPSECRET", 
    type: "Percentage", 
    value: "30%", 
    usage: { used: 12, limit: 50 }, 
    status: "Scheduled", 
    revenue: 0, 
    ends: "Starts Jan 1" 
  },
  { 
    id: "CPN-004", 
    code: "BLACKFRIDAY", 
    type: "Percentage", 
    value: "50%", 
    usage: { used: 2000, limit: 2000 }, 
    status: "Expired", 
    revenue: 1200000, 
    ends: "Nov 30, 2024" 
  },
];

const STATS = [
  { label: "Active Coupons", value: "8", icon: HiOutlineTag },
  { label: "Total Discounts Given", value: "₹4.5L", icon: HiOutlineChartBar },
  { label: "Revenue from Coupons", value: "₹18.2L", icon: HiOutlineClock }, // ROI Metric
];

export default function MarketingPage() {
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Expired": return "bg-zinc-100 text-zinc-500 border-zinc-200";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Add toast notification logic here
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketing & Discounts</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage coupon codes and automatic discounts.</p>
          </div>
          <Link href="/admin/marketing/new">
            <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg">
              <HiPlus className="text-lg" /> Create Coupon
            </button>
          </Link>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-zinc-900 font-mono mt-1">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* --- COUPONS TABLE --- */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
             <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">All Codes</h3>
             <div className="flex gap-2">
                <button className="text-xs font-bold text-zinc-500 hover:text-black">Active</button>
                <span className="text-zinc-300">|</span>
                <button className="text-xs font-bold text-zinc-500 hover:text-black">Expired</button>
             </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-white border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-48">Code</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Value</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Usage</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sales</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {COUPONS.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-mono font-bold text-sm text-zinc-900 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">{coupon.code}</span>
                       <button onClick={() => copyToClipboard(coupon.code)} className="text-zinc-400 hover:text-black opacity-0 group-hover:opacity-100 transition">
                          <HiOutlineClipboard />
                       </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase">{coupon.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(coupon.status)}`}>
                      {coupon.status}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1">{coupon.ends}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {coupon.value} OFF
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                       <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1">
                          <span>{coupon.usage.used} used</span>
                          <span>{coupon.usage.limit ? coupon.usage.limit : '∞'}</span>
                       </div>
                       {coupon.usage.limit ? (
                         <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-black rounded-full" 
                              style={{ width: `${(coupon.usage.used / coupon.usage.limit) * 100}%` }}
                            ></div>
                         </div>
                       ) : (
                         <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full opacity-20"></div>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    ₹{coupon.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}