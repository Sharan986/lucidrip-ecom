"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineFunnel, 
  HiOutlineEye, 
  HiOutlineTruck, 
  HiOutlineArrowDownTray,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePrinter,
  HiPlus
} from "react-icons/hi2";

// --- TYPES ---
type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: OrderStatus;
  items: number;
  payment: "Paid" | "Refunded" | "Unpaid";
}

// --- MOCK DATA ---
const INITIAL_ORDERS: Order[] = [
  { id: "ORD-7829", customer: "Sumit Mehta", email: "Sumit@gmail.com", date: "Oct 24, 2025", amount: 4299, status: "Pending", items: 3, payment: "Paid" },
  { id: "ORD-7828", customer: "Priya Singh", email: "priya@yahoo.com", date: "Oct 23, 2025", amount: 1499, status: "Shipped", items: 1, payment: "Paid" },
  { id: "ORD-7827", customer: "Rahul Verma", email: "rahul@outlook.com", date: "Oct 22, 2025", amount: 8999, status: "Delivered", items: 5, payment: "Paid" },
  { id: "ORD-7826", customer: "Sneha Kapoor", email: "sneha@live.com", date: "Oct 21, 2025", amount: 2100, status: "Cancelled", items: 2, payment: "Refunded" },
  { id: "ORD-7825", customer: "Vikram Das", email: "vikram@tech.com", date: "Oct 20, 2025", amount: 3450, status: "Pending", items: 2, payment: "Unpaid" },
  { id: "ORD-7824", customer: "Anjali Roy", email: "anjali@art.com", date: "Oct 19, 2025", amount: 1200, status: "Delivered", items: 1, payment: "Paid" },
  { id: "ORD-7823", customer: "Kabir Khan", email: "kabir@gym.com", date: "Oct 18, 2025", amount: 5600, status: "Shipped", items: 4, payment: "Paid" },
  { id: "ORD-7822", customer: "Meera Reddy", email: "meera@design.com", date: "Oct 17, 2025", amount: 999, status: "Pending", items: 1, payment: "Paid" },
];

// --- COMPONENT: STATUS BADGE ---
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Shipped: "bg-blue-100 text-blue-800 border-blue-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-zinc-100 text-zinc-600 border-zinc-200 line-through",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status]}`}>
      {status === "Pending" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />}
      {status}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LOGIC ---
  const filteredData = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.status === activeTab;
      const matchesSearch = 
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMarkShipped = (id: string) => {
    // In a real app, you'd call an API here
    setOrders((prev) => 
      prev.map(order => order.id === id ? { ...order, status: "Shipped" } : order)
    );
  };

  const handleExport = () => {
    // Simple CSV Export Logic
    const headers = ["Order ID,Customer,Date,Amount,Status,Payment\n"];
    const rows = filteredData.map(o => 
      `${o.id},${o.customer},${o.date},${o.amount},${o.status},${o.payment}`
    );
    const blob = new Blob([...headers, ...rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
             <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
             <p className="text-sm text-zinc-500 mt-1">Manage and track customer orders.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleExport}
               className="px-4 py-2 border border-zinc-200 bg-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition flex items-center gap-2"
             >
               <HiOutlineArrowDownTray className="text-lg" /> Export
             </button>
             <button className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition shadow-lg flex items-center gap-2">
               <HiPlus className="text-lg" /> Create Order
             </button>
          </div>
        </div>

        {/* --- MAIN CONTENT CARD --- */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
           
           {/* Toolbar: Tabs & Search */}
           <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              
              {/* Tabs (Segmented Control Style) */}
              <div className="flex p-1 bg-zinc-100 rounded-lg w-full sm:w-auto overflow-x-auto scrollbar-hide">
                 {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md whitespace-nowrap transition-all ${
                        activeTab === tab 
                          ? "bg-white text-black shadow-sm" 
                          : "text-zinc-500 hover:text-black hover:bg-zinc-200/50"
                      }`}
                    >
                      {tab}
                    </button>
                 ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                 <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
                 <input 
                   value={searchQuery}
                   onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                   placeholder="Search ID, customer, email..." 
                   className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-zinc-400"
                 />
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32">Order ID</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-50">
                    {paginatedData.length > 0 ? (
                       paginatedData.map((order) => (
                          <tr key={order.id} className="group hover:bg-zinc-50 transition-colors">
                             <td className="px-6 py-4">
                                <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-bold text-black hover:underline bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                                   {order.id.replace('#', '')}
                                </Link>
                             </td>
                             <td className="px-6 py-4">
                                <div>
                                   <p className="text-sm font-bold text-zinc-900">{order.customer}</p>
                                   <p className="text-xs text-zinc-500">{order.email}</p>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                                {order.date}
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-sm font-mono font-medium text-zinc-900">₹{order.amount.toLocaleString()}</span>
                                <span className="text-[10px] text-zinc-400 ml-1">({order.items})</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                   order.payment === "Paid" ? "bg-green-50 border-green-100 text-green-700" :
                                   order.payment === "Refunded" ? "bg-zinc-100 border-zinc-200 text-zinc-600" :
                                   "bg-orange-50 border-orange-100 text-orange-700"
                                }`}>
                                   {order.payment}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <StatusBadge status={order.status} />
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Link href={`/admin/orders/${order.id}`}>
                                      <button className="p-1.5 text-zinc-400 hover:text-black hover:bg-white border border-transparent hover:border-zinc-200 rounded transition" title="View Details">
                                         <HiOutlineEye className="text-lg" />
                                      </button>
                                   </Link>
                                   {order.status === "Pending" && (
                                      <button 
                                        onClick={() => handleMarkShipped(order.id)}
                                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded transition" 
                                        title="Mark as Shipped"
                                      >
                                         <HiOutlineTruck className="text-lg" />
                                      </button>
                                   )}
                                   <button className="p-1.5 text-zinc-400 hover:text-black hover:bg-white border border-transparent hover:border-zinc-200 rounded transition" title="Print Invoice">
                                      <HiOutlinePrinter className="text-lg" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))
                    ) : (
                       <tr>
                          <td colSpan={7} className="px-6 py-24 text-center">
                             <div className="flex flex-col items-center justify-center text-zinc-400">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                   <HiOutlineFunnel className="text-2xl opacity-20" />
                                </div>
                                <p className="text-sm font-medium text-zinc-900">No orders found</p>
                                <p className="text-xs text-zinc-500 mt-1 max-w-xs">We couldn't find any orders matching your filters. Try adjusting your search or filter settings.</p>
                                <button 
                                  onClick={() => {setSearchQuery(""); setActiveTab("All")}}
                                  className="mt-4 text-xs font-bold text-black border-b border-black hover:opacity-60 transition"
                                >
                                  Clear all filters
                                </button>
                             </div>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>

           {/* Pagination */}
           <div className="border-t border-zinc-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-50/50">
              <p className="text-xs text-zinc-500">
                 Showing <span className="font-bold text-zinc-900">{paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-bold text-zinc-900">{filteredData.length}</span> entries
              </p>
              
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                   disabled={currentPage === 1}
                   className="p-2 border border-zinc-200 rounded-lg hover:bg-white hover:border-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white shadow-sm"
                 >
                    <HiChevronLeft className="text-zinc-600" />
                 </button>
                 
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                        currentPage === i + 1 
                          ? "bg-black text-white shadow-md" 
                          : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                 ))}

                 <button 
                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                   disabled={currentPage === totalPages || totalPages === 0}
                   className="p-2 border border-zinc-200 rounded-lg hover:bg-white hover:border-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white shadow-sm"
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