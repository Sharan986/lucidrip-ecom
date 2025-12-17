"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowDownTray, 
  HiOutlineEnvelope,
  HiChevronDown,
  HiChevronUp,
  HiOutlineShoppingBag,
  HiChevronLeft,
  HiChevronRight,
  HiEllipsisHorizontal,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineNoSymbol,
  HiOutlinePencilSquare
} from "react-icons/hi2";

// --- TYPES ---
interface OrderHistory {
  id: string;
  date: string;
  items: string;
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
  status: "ACTIVE" | "BLOCKED" | "VIP"; 
  history: OrderHistory[];
}

// --- MOCK DATA ---
const CUSTOMERS: Customer[] = [
  { 
    id: "CUST-001", name: "Sumit Mehta", email: "Sumit.m@gmail.com", location: "Mumbai, IN", totalOrders: 12, totalSpent: 45200, lastActive: "2m ago", status: "VIP",
    history: [
      { id: "ORD-7829", date: "Oct 24", items: "Heavyweight Tee (x3)", amount: 4299, status: "PENDING" },
      { id: "ORD-7510", date: "Sep 12", items: "Cargo Pants (x1)", amount: 3500, status: "DELIVERED" },
    ]
  },
  { 
    id: "CUST-002", name: "Sarah Jenkins", email: "sarah.j@design.co", location: "London, UK", totalOrders: 3, totalSpent: 8500, lastActive: "1d ago", status: "ACTIVE",
    history: [
      { id: "ORD-7100", date: "Aug 05", items: "Graphic Hoodie (x1)", amount: 4500, status: "DELIVERED" },
    ]
  },
  { 
    id: "CUST-003", name: "Rahul Verma", email: "rahul.v@tech.in", location: "Bangalore, IN", totalOrders: 1, totalSpent: 2400, lastActive: "5d ago", status: "ACTIVE",
    history: [
      { id: "ORD-6900", date: "Feb 20", items: "Cap (x1), Socks (x2)", amount: 2400, status: "DELIVERED" }
    ]
  },
  { 
    id: "CUST-004", name: "David Chen", email: "david.c@proton.me", location: "New York, US", totalOrders: 0, totalSpent: 0, lastActive: "1mo ago", status: "BLOCKED",
    history: []
  },
  { 
    id: "CUST-005", name: "Priya Singh", email: "priya.s@fashion.in", location: "Delhi, IN", totalOrders: 8, totalSpent: 28900, lastActive: "3h ago", status: "VIP",
    history: [
      { id: "ORD-7828", date: "Oct 23", items: "Puffer Jacket (x1)", amount: 8900, status: "SHIPPED" },
    ]
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LOGIC ---
  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "ALL" || c.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedData = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleRow = (id: string) => setExpandedRow(expandedRow === id ? null : id);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) setSelectedIds([]);
    else setSelectedIds(paginatedData.map(c => c.id));
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- PAGE HEADER --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-sm text-zinc-500 mt-1">View and manage your user base.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition shadow-sm flex items-center gap-2">
               <HiOutlineArrowDownTray className="text-lg" /> Export CSV
             </button>
             <button className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition shadow-lg flex items-center gap-2">
               <HiOutlineEnvelope className="text-lg" /> Email All
             </button>
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
             {/* Tabs */}
             <div className="flex bg-zinc-100 p-1 rounded-lg">
                {["ALL", "VIP", "ACTIVE", "BLOCKED"].map((f) => (
                   <button
                     key={f}
                     onClick={() => { setFilter(f); setCurrentPage(1); }}
                     className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                       filter === f ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
                     }`}
                   >
                     {f}
                   </button>
                ))}
             </div>

             {/* Search */}
             <div className="relative w-full sm:w-64">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customers..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black transition placeholder:text-zinc-400"
                />
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                   <tr>
                      <th className="px-6 py-4 w-10">
                         <input 
                           type="checkbox" 
                           className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 cursor-pointer"
                           checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                           onChange={toggleSelectAll}
                         />
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Orders</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Spent</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Last Active</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                   {paginatedData.map((c) => (
                      <React.Fragment key={c.id}>
                         {/* ROW */}
                         <tr 
                           className={`group transition-colors ${expandedRow === c.id ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
                         >
                            <td className="px-6 py-4">
                               <input 
                                 type="checkbox" 
                                 className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 cursor-pointer"
                                 checked={selectedIds.includes(c.id)}
                                 onChange={() => toggleSelectOne(c.id)}
                               />
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-200">
                                     {c.name.charAt(0)}
                                  </div>
                                  <div>
                                     <Link href={`/admin/customers/${c.email}`} className="text-sm font-bold text-zinc-900 hover:underline">
                                        {c.name}
                                     </Link>
                                     <p className="text-xs text-zinc-500">{c.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                  c.status === "VIP" ? "bg-black text-white border-black" :
                                  c.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200" :
                                  "bg-red-50 text-red-700 border-red-200 line-through"
                               }`}>
                                  {c.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-zinc-700">
                               {c.totalOrders}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <span className="font-mono text-sm font-medium">₹{c.totalSpent.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-zinc-500 font-mono">
                               {c.lastActive}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end items-center gap-2">
                                  <button onClick={() => toggleRow(c.id)} className="p-1.5 text-zinc-400 hover:text-black hover:bg-white rounded transition border border-transparent hover:border-zinc-200">
                                     {expandedRow === c.id ? <HiChevronUp /> : <HiChevronDown />}
                                  </button>
                                  
                                  {/* Quick Actions Dropdown Trigger (Visual Only) */}
                                  <div className="relative group/menu">
                                     <button className="p-1.5 text-zinc-400 hover:text-black hover:bg-white rounded transition border border-transparent hover:border-zinc-200">
                                        <HiEllipsisHorizontal className="text-lg" />
                                     </button>
                                     {/* Hover Menu */}
                                     <div className="absolute right-0 top-8 w-32 bg-white border border-zinc-200 shadow-xl rounded-lg p-1 z-10 hidden group-hover/menu:block">
                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded text-left">
                                           <HiOutlinePencilSquare /> Edit
                                        </button>
                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded text-left">
                                           <HiOutlineNoSymbol /> Block
                                        </button>
                                     </div>
                                  </div>
                               </div>
                            </td>
                         </tr>

                         {/* EXPANDED DETAILS */}
                         {expandedRow === c.id && (
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                               <td colSpan={7} className="px-6 py-4">
                                  <div className="pl-14">
                                     <div className="flex items-center gap-2 mb-3">
                                        <HiOutlineShoppingBag className="text-zinc-400" />
                                        <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Recent Activity</span>
                                     </div>
                                     {c.history.length > 0 ? (
                                        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                                           <table className="w-full text-left">
                                              <thead className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase">
                                                 <tr>
                                                    <th className="px-4 py-2">Date</th>
                                                    <th className="px-4 py-2">Order</th>
                                                    <th className="px-4 py-2">Items</th>
                                                    <th className="px-4 py-2 text-right">Amount</th>
                                                    <th className="px-4 py-2 text-right">Status</th>
                                                 </tr>
                                              </thead>
                                              <tbody className="divide-y divide-zinc-50">
                                                 {c.history.map((h) => (
                                                    <tr key={h.id} className="text-xs text-zinc-600">
                                                       <td className="px-4 py-2.5">{h.date}</td>
                                                       <td className="px-4 py-2.5 font-mono text-black">#{h.id.split('-')[1]}</td>
                                                       <td className="px-4 py-2.5">{h.items}</td>
                                                       <td className="px-4 py-2.5 text-right font-mono">₹{h.amount.toLocaleString()}</td>
                                                       <td className="px-4 py-2.5 text-right">
                                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                                             h.status === "DELIVERED" ? "bg-zinc-100 border-zinc-200 text-zinc-700" :
                                                             h.status === "PENDING" ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                                                             "bg-white border-zinc-200"
                                                          }`}>
                                                             {h.status}
                                                          </span>
                                                       </td>
                                                    </tr>
                                                 ))}
                                              </tbody>
                                           </table>
                                        </div>
                                     ) : (
                                        <p className="text-xs text-zinc-400 italic">No recent orders.</p>
                                     )}
                                  </div>
                               </td>
                            </tr>
                         )}
                      </React.Fragment>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-zinc-100 px-6 py-4 flex justify-between items-center bg-zinc-50/30">
             <span className="text-xs text-zinc-500">
               Showing <span className="font-bold text-zinc-900">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of {filteredCustomers.length}
             </span>
             <div className="flex gap-2">
               <button 
                 onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                 disabled={currentPage === 1}
                 className="p-1.5 border border-zinc-200 bg-white rounded hover:bg-zinc-50 disabled:opacity-50 transition"
               >
                 <HiChevronLeft className="text-zinc-600" />
               </button>
               <button 
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                 disabled={currentPage === totalPages}
                 className="p-1.5 border border-zinc-200 bg-white rounded hover:bg-zinc-50 disabled:opacity-50 transition"
               >
                 <HiChevronRight className="text-zinc-600" />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}