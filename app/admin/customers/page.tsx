"use client";

import React, { useState, useMemo } from "react";
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowDownTray, 
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiChevronDown,
  HiChevronUp,
  HiOutlineShoppingBag,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi2";

// --- TYPES ---
interface OrderHistory {
  id: string;
  date: string;
  items: string; // e.g., "Oversized Hoodie (x2)"
  amount: number;
  status: "DELIVERED" | "PENDING" | "SHIPPED" | "CANCELLED";
}

interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  joinDate: string;
  status: "ACTIVE" | "BLOCKED" | "VIP"; // Status is now derived or explicitly set
  history: OrderHistory[];
}

// --- MOCK DATA ---
const CUSTOMERS: Customer[] = [
  { 
    id: "CUST-001", name: "Arjun Mehta", email: "arjun.m@gmail.com", location: "Mumbai, IN", totalOrders: 12, totalSpent: 45200, lastActive: "2 mins ago", joinDate: "2023-11-01", status: "VIP",
    history: [
      { id: "ORD-7829", date: "2025-10-24", items: "Heavyweight Tee (x3)", amount: 4299, status: "PENDING" },
      { id: "ORD-7510", date: "2025-09-12", items: "Cargo Pants (x1)", amount: 3500, status: "DELIVERED" },
    ]
  },
  { 
    id: "CUST-002", name: "Sarah Jenkins", email: "sarah.j@design.co", location: "London, UK", totalOrders: 3, totalSpent: 8500, lastActive: "1 day ago", joinDate: "2024-01-15", status: "ACTIVE",
    history: [
      { id: "ORD-7100", date: "2025-08-05", items: "Graphic Hoodie (x1)", amount: 4500, status: "DELIVERED" },
    ]
  },
  { 
    id: "CUST-003", name: "Rahul Verma", email: "rahul.v@tech.in", location: "Bangalore, IN", totalOrders: 1, totalSpent: 2400, lastActive: "5 days ago", joinDate: "2024-02-20", status: "ACTIVE",
    history: [
      { id: "ORD-6900", date: "2025-02-20", items: "Cap (x1), Socks (x2)", amount: 2400, status: "DELIVERED" }
    ]
  },
  { 
    id: "CUST-004", name: "David Chen", email: "david.c@proton.me", location: "New York, US", totalOrders: 0, totalSpent: 0, lastActive: "1 month ago", joinDate: "2023-12-10", status: "BLOCKED",
    history: []
  },
  { 
    id: "CUST-005", name: "Priya Singh", email: "priya.s@fashion.in", location: "Delhi, IN", totalOrders: 8, totalSpent: 28900, lastActive: "3 hours ago", joinDate: "2024-03-05", status: "VIP",
    history: [
      { id: "ORD-7828", date: "2025-10-23", items: "Puffer Jacket (x1)", amount: 8900, status: "SHIPPED" },
      { id: "ORD-7620", date: "2025-09-01", items: "Oversized Tee (x4)", amount: 6000, status: "DELIVERED" },
    ]
  },
  { 
    id: "CUST-006", name: "Mike Ross", email: "mike.r@legal.com", location: "Toronto, CA", totalOrders: 2, totalSpent: 5600, lastActive: "1 week ago", joinDate: "2024-01-22", status: "ACTIVE",
    history: [
      { id: "ORD-7800", date: "2025-05-12", items: "Sneakers (x1)", amount: 5600, status: "DELIVERED" }
    ]
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LOGIC ---

  // 1. Filtering
  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "ALL" || c.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  // 2. Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedData = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Toggle Details
  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // 4. Export
  const handleExport = () => {
    const headers = ["ID,Name,Email,Location,Spent,Status\n"];
    const rows = filteredCustomers.map(c => `${c.id},${c.name},${c.email},${c.location},${c.totalSpent},${c.status}`);
    const blob = new Blob([...headers, ...rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_export.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20 font-sans">
      
      {/* --- TOP BAR --- */}
      <div className="border-b border-zinc-200">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">DATABASE // CUSTOMERS</p>
          <div className="flex gap-4 text-xs font-mono text-zinc-500">
             <span>ACTIVE: {CUSTOMERS.filter(c => c.status === "ACTIVE").length}</span>
             <span className="text-zinc-300">|</span>
             <span>VIP: {CUSTOMERS.filter(c => c.status === "VIP").length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Profiles</h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Manage user accounts and purchase history.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="SEARCH DATABASE..." 
                className="pl-10 pr-4 py-3 w-64 bg-zinc-50 border border-zinc-200 outline-none focus:border-black focus:bg-white transition-colors text-xs font-bold tracking-wider placeholder:text-zinc-400 uppercase"
              />
            </div>
            <button 
              onClick={handleExport}
              className="px-6 py-3 bg-black text-white border border-black text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <HiOutlineArrowDownTray className="text-base" /> Export
            </button>
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="border border-zinc-200">
          
          {/* Filters */}
          <div className="flex border-b border-zinc-200 bg-white overflow-x-auto">
            {["ALL", "VIP", "ACTIVE", "BLOCKED"].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={`px-8 py-4 text-[10px] font-bold tracking-widest uppercase border-r border-zinc-200 hover:bg-zinc-50 transition-colors whitespace-nowrap ${
                  filter === f ? "bg-black text-white hover:bg-black" : "text-zinc-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white">
            <table className="w-full text-left table-auto">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase w-16">Avatar</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Orders</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Total Spent</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Last Active</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedData.length > 0 ? (
                  paginatedData.map((c) => (
                    <React.Fragment key={c.id}>
                      {/* MAIN ROW */}
                      <tr 
                        className={`group transition-colors cursor-pointer ${expandedRow === c.id ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
                        onClick={() => toggleRow(c.id)}
                      >
                        <td className="px-6 py-5">
                          <div className={`w-10 h-10 border flex items-center justify-center text-sm font-black transition-colors ${
                            c.status === "VIP" ? "bg-black text-white border-black" : "bg-zinc-100 border-zinc-200 text-zinc-900"
                          }`}>
                            {c.name.charAt(0)}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-zinc-900">{c.name}</span>
                            <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                              <HiOutlineEnvelope /> {c.email}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                              <HiOutlineMapPin /> {c.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-sm text-zinc-900">{c.totalOrders}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-sm font-bold text-zinc-900">₹{c.totalSpent.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">{c.lastActive}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className={`
                              inline-flex items-center px-3 py-1 text-[9px] font-bold tracking-widest border
                              ${c.status === "VIP" ? "bg-black text-white border-black" : ""}
                              ${c.status === "ACTIVE" ? "bg-white text-zinc-900 border-zinc-200" : ""}
                              ${c.status === "BLOCKED" ? "bg-red-50 text-red-600 border-red-100 line-through" : ""}
                            `}>
                              {c.status}
                            </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="text-zinc-400 hover:text-black transition-colors">
                            {expandedRow === c.id ? <HiChevronUp className="text-xl" /> : <HiChevronDown className="text-xl" />}
                          </button>
                        </td>
                      </tr>

                      {/* EXPANDED ROW (ORDER HISTORY) */}
                      {expandedRow === c.id && (
                        <tr className="bg-zinc-50 border-b border-zinc-200">
                          <td colSpan={7} className="px-6 py-6">
                            <div className="bg-white border border-zinc-200 p-6">
                              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
                                <HiOutlineShoppingBag /> Recent Purchase History
                              </div>
                              
                              {c.history.length > 0 ? (
                                <table className="w-full text-left">
                                  <thead className="bg-zinc-100 text-[9px] font-bold uppercase text-zinc-500">
                                    <tr>
                                      <th className="px-4 py-2">Order ID</th>
                                      <th className="px-4 py-2">Date</th>
                                      <th className="px-4 py-2">Items</th>
                                      <th className="px-4 py-2">Total</th>
                                      <th className="px-4 py-2 text-right">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-100">
                                    {c.history.map((order) => (
                                      <tr key={order.id} className="text-xs font-mono text-zinc-600">
                                        <td className="px-4 py-3 font-bold text-black">#{order.id}</td>
                                        <td className="px-4 py-3">{order.date}</td>
                                        <td className="px-4 py-3 font-sans">{order.items}</td>
                                        <td className="px-4 py-3">₹{order.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                          <span className={`px-2 py-0.5 text-[9px] border font-bold ${
                                            order.status === "DELIVERED" ? "bg-zinc-900 text-white border-black" : "bg-white text-zinc-900 border-zinc-300"
                                          }`}>
                                            {order.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-xs font-mono text-zinc-400 italic">No recent orders found for this user.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-xs font-mono uppercase text-zinc-400">No records found matching filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- PAGINATION --- */}
          <div className="border-t border-zinc-200 bg-white p-4 flex justify-between items-center">
             <span className="text-[10px] font-mono text-zinc-400 uppercase">
               Viewing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
             </span>
             <div className="flex gap-2">
               <button 
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className="px-3 py-2 border border-zinc-200 text-zinc-600 disabled:text-zinc-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
               >
                 <HiChevronLeft />
               </button>
               <button 
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages || totalPages === 0}
                 className="px-3 py-2 border border-zinc-200 text-zinc-600 disabled:text-zinc-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
               >
                 <HiChevronRight />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}