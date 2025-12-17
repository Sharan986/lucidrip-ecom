"use client";

import React, { useState } from "react";
import { 
  HiOutlineArrowDownTray, 
  HiOutlineMagnifyingGlass, 
  HiOutlineFunnel, 
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiEllipsisHorizontal
} from "react-icons/hi2";

// --- TYPES ---
type PaymentStatus = "Succeeded" | "Pending" | "Failed" | "Refunded";

interface Transaction {
  id: string;
  amount: number;
  fee: number;
  net: number;
  currency: string;
  status: PaymentStatus;
  customer: string;
  email: string;
  date: string;
  method: { type: "Card" | "UPI" | "Wallet"; brand?: string; last4?: string };
  risk?: "Normal" | "Elevated";
}

// --- MOCK DATA ---
const TRANSACTIONS: Transaction[] = [
  { 
    id: "txn_3N5k8L2eZvKYlo2C1x", amount: 4500, fee: 135, net: 4365, currency: "INR", 
    status: "Succeeded", customer: "Sumit Mehta", email: "sumit@gmail.com", date: "Oct 24, 10:42 AM",
    method: { type: "Card", brand: "Visa", last4: "4242" }
  },
  { 
    id: "txn_3N5j7K2eZvKYlo2B9z", amount: 1299, fee: 0, net: 1299, currency: "INR", 
    status: "Pending", customer: "Rahul Verma", email: "rahul@tech.in", date: "Oct 24, 09:15 AM",
    method: { type: "UPI" }
  },
  { 
    id: "txn_3N5i6J2eZvKYlo2A8y", amount: 8900, fee: 267, net: 8633, currency: "INR", 
    status: "Failed", customer: "Priya Singh", email: "priya@fashion.in", date: "Oct 23, 04:20 PM",
    method: { type: "Card", brand: "Mastercard", last4: "8821" },
    risk: "Elevated"
  },
  { 
    id: "txn_3N5h5I2eZvKYlo2z7x", amount: 2400, fee: 72, net: 2328, currency: "INR", 
    status: "Refunded", customer: "David Chen", email: "david@proton.me", date: "Oct 23, 01:00 PM",
    method: { type: "Wallet" }
  },
  { 
    id: "txn_3N5g4H2eZvKYlo2y6w", amount: 15600, fee: 468, net: 15132, currency: "INR", 
    status: "Succeeded", customer: "Sarah Jenkins", email: "sarah@design.co", date: "Oct 22, 11:30 AM",
    method: { type: "Card", brand: "Visa", last4: "1122" }
  },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState("All");
  
  // --- HELPERS ---
  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case "Succeeded": return "bg-green-50 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Failed": return "bg-red-50 text-red-700 border-red-200";
      case "Refunded": return "bg-zinc-100 text-zinc-500 border-zinc-200 line-through";
    }
  };

  const MethodIcon = ({ method }: { method: Transaction["method"] }) => {
    if (method.type === "Card") return <span className="font-bold text-[10px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-600 uppercase">{method.brand}</span>;
    if (method.type === "UPI") return <span className="font-bold text-[10px] bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-600">UPI</span>;
    return <span className="font-bold text-[10px] bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-600">WALLET</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- PAGE HEADER --- */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
            <p className="text-sm text-zinc-500 mt-1">Monitor cash flow, refunds, and disputes.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition shadow-sm flex items-center gap-2">
               <HiOutlineArrowDownTray className="text-lg" /> Export CSV
             </button>
             <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition shadow-sm flex items-center gap-2 text-zinc-600">
               <HiOutlineFunnel className="text-lg" /> Filter
             </button>
          </div>
        </div>

        {/* --- STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gross Volume</p>
                 <HiOutlineBanknotes className="text-zinc-300 text-xl" />
              </div>
              <div>
                 <h3 className="text-2xl font-mono font-medium tracking-tight">₹4,50,200</h3>
                 <p className="text-[10px] text-green-600 font-bold mt-1">+12.5% vs last month</p>
              </div>
           </div>
           <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net Revenue</p>
                 <HiOutlineCreditCard className="text-zinc-300 text-xl" />
              </div>
              <div>
                 <h3 className="text-2xl font-mono font-medium tracking-tight">₹4,32,150</h3>
                 <p className="text-[10px] text-zinc-400 font-bold mt-1">After fees & refunds</p>
              </div>
           </div>
           <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pending</p>
                 <HiOutlineArrowPath className="text-zinc-300 text-xl" />
              </div>
              <div>
                 <h3 className="text-2xl font-mono font-medium tracking-tight">₹12,400</h3>
                 <p className="text-[10px] text-zinc-400 font-bold mt-1">Rolling reserve</p>
              </div>
           </div>
           <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Disputes</p>
                 <HiOutlineExclamationTriangle className="text-red-300 text-xl" />
              </div>
              <div>
                 <h3 className="text-2xl font-mono font-medium tracking-tight text-red-600">1</h3>
                 <p className="text-[10px] text-red-400 font-bold mt-1">Action required</p>
              </div>
           </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
             <div className="flex bg-zinc-100 p-1 rounded-lg">
                {["All", "Succeeded", "Refunded", "Failed"].map((f) => (
                   <button
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                       filter === f ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
                     }`}
                   >
                     {f}
                   </button>
                ))}
             </div>
             <div className="relative w-full sm:w-64">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
                <input 
                  placeholder="Search by ID or customer..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black transition placeholder:text-zinc-400"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                   <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32">Amount</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Fee / Net</th>
                      <th className="px-6 py-3 w-10"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                   {TRANSACTIONS.map((txn) => (
                      <tr key={txn.id} className="group hover:bg-zinc-50 transition-colors">
                         <td className="px-6 py-4">
                            <p className="font-mono font-medium text-sm text-zinc-900">₹{txn.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-zinc-400 uppercase font-bold">{txn.currency}</p>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(txn.status)}`}>
                               {txn.status}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <MethodIcon method={txn.method} />
                               <span className="text-xs font-mono text-zinc-500">
                                  {txn.method.last4 ? `•••• ${txn.method.last4}` : txn.id.slice(0, 8)}
                               </span>
                            </div>
                            {txn.risk === "Elevated" && (
                               <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 rounded mt-1 inline-block">RISK DETECTED</span>
                            )}
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-xs font-bold text-zinc-900">{txn.customer}</p>
                            <p className="text-[10px] text-zinc-500">{txn.email}</p>
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-xs text-zinc-600 font-mono">{txn.date}</p>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <p className="text-xs font-mono text-zinc-900">₹{txn.net.toLocaleString()}</p>
                            <p className="text-[10px] font-mono text-zinc-400">-₹{txn.fee}</p>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="p-1 text-zinc-400 hover:text-black hover:bg-zinc-200 rounded transition">
                               <HiEllipsisHorizontal className="text-lg" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="bg-zinc-50 border-t border-zinc-100 px-6 py-3 text-xs text-zinc-400 flex justify-between">
             <span>Showing 5 of 1,234 transactions</span>
             <button className="hover:text-black">Next &rarr;</button>
          </div>

        </div>
      </div>
    </div>
  );
}