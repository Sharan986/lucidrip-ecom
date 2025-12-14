"use client";

import React, { useState, useMemo } from "react";
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineFunnel, 
  HiOutlineEye, 
  HiOutlineTruck, 
  HiOutlineArrowDownTray,
  HiChevronLeft,
  HiChevronRight
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

// --- MOCK DATA (Expanded for Pagination) ---
const INITIAL_ORDERS: Order[] = [
  { id: "#ORD-7829", customer: "Arjun Mehta", email: "arjun@gmail.com", date: "Oct 24, 2025", amount: 4299, status: "Pending", items: 3, payment: "Paid" },
  { id: "#ORD-7828", customer: "Priya Singh", email: "priya@yahoo.com", date: "Oct 23, 2025", amount: 1499, status: "Shipped", items: 1, payment: "Paid" },
  { id: "#ORD-7827", customer: "Rahul Verma", email: "rahul@outlook.com", date: "Oct 22, 2025", amount: 8999, status: "Delivered", items: 5, payment: "Paid" },
  { id: "#ORD-7826", customer: "Sneha Kapoor", email: "sneha@live.com", date: "Oct 21, 2025", amount: 2100, status: "Cancelled", items: 2, payment: "Refunded" },
  { id: "#ORD-7825", customer: "Vikram Das", email: "vikram@tech.com", date: "Oct 20, 2025", amount: 3450, status: "Pending", items: 2, payment: "Unpaid" },
  { id: "#ORD-7824", customer: "Anjali Roy", email: "anjali@art.com", date: "Oct 19, 2025", amount: 1200, status: "Delivered", items: 1, payment: "Paid" },
  { id: "#ORD-7823", customer: "Kabir Khan", email: "kabir@gym.com", date: "Oct 18, 2025", amount: 5600, status: "Shipped", items: 4, payment: "Paid" },
  { id: "#ORD-7822", customer: "Meera Reddy", email: "meera@design.com", date: "Oct 17, 2025", amount: 999, status: "Pending", items: 1, payment: "Paid" },
];

// --- COMPONENT: STATUS BADGE (Modern Dot Style) ---
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    Pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    Shipped: "bg-blue-50 text-blue-700 ring-blue-700/10",
    Delivered: "bg-green-50 text-green-700 ring-green-600/20",
    Cancelled: "bg-red-50 text-red-700 ring-red-600/10",
  };

  const dotStyles = {
    Pending: "bg-yellow-400",
    Shipped: "bg-blue-400",
    Delivered: "bg-green-400",
    Cancelled: "bg-red-400",
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
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

  // --- FUNCTIONAL LOGIC ---

  // 1. Filtering & Searching
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

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Action: Mark as Shipped
  const handleMarkShipped = (id: string) => {
    if (confirm(`Mark order ${id} as Shipped?`)) {
      setOrders((prev) => 
        prev.map(order => order.id === id ? { ...order, status: "Shipped" } : order)
      );
    }
  };

  // 4. Action: Export CSV
  const handleExport = () => {
    const headers = ["Order ID,Customer,Date,Amount,Status,Payment\n"];
    const rows = filteredData.map(o => 
      `${o.id},${o.customer},${o.date},${o.amount},${o.status},${o.payment}`
    );
    
    const blob = new Blob([...headers, ...rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
             <p className="text-sm text-gray-500 mt-1">
               Overview of all {orders.length} orders
             </p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleExport}
               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors shadow-sm"
             >
               <HiOutlineArrowDownTray className="text-lg" /> 
               Export
             </button>
             <button className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-md transition-all active:scale-95">
               <HiOutlineTruck className="text-lg" />
               Create Shipment
             </button>
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
           
           {/* Toolbar */}
           <div className="border-b border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
             
             {/* Tabs */}
             <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
                {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                      activeTab === tab 
                        ? "bg-white text-black shadow-sm ring-1 ring-black/5" 
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             {/* Search */}
             <div className="relative w-full sm:w-72">
               <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
               <input 
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 placeholder="Search orders..." 
                 className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400"
               />
             </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">Order ID</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {paginatedData.length > 0 ? (
                   paginatedData.map((order) => (
                     <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4">
                         <span className="text-sm font-bold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                           {order.id}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                           <span className="text-xs text-gray-400">{order.email}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-500">
                         {order.date}
                       </td>
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
                         ₹{order.amount.toLocaleString()}
                         <span className="text-xs text-gray-400 font-normal ml-1">({order.items} items)</span>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`text-xs font-medium px-2 py-1 rounded border ${
                           order.payment === "Paid" ? "bg-green-50 text-green-700 border-green-100" :
                           order.payment === "Refunded" ? "bg-gray-100 text-gray-600 border-gray-200" :
                           "bg-orange-50 text-orange-700 border-orange-100"
                         }`}>
                           {order.payment}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <StatusBadge status={order.status} />
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all shadow-sm opacity-0 group-hover:opacity-100" title="View Details">
                              <HiOutlineEye className="text-lg" />
                            </button>
                            
                            {order.status === "Pending" && (
                              <button 
                                onClick={() => handleMarkShipped(order.id)}
                                className="p-2 text-blue-500 hover:text-white hover:bg-blue-600 border border-transparent rounded-lg transition-all shadow-sm opacity-0 group-hover:opacity-100" 
                                title="Mark as Shipped"
                              >
                                <HiOutlineTruck className="text-lg" />
                              </button>
                            )}
                         </div>
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={7} className="px-6 py-16 text-center">
                       <div className="flex flex-col items-center justify-center text-gray-400">
                         <HiOutlineFunnel className="text-4xl mb-3 opacity-20" />
                         <p className="text-sm">No orders found matching your filters.</p>
                         <button 
                           onClick={() => {setSearchQuery(""); setActiveTab("All")}}
                           className="mt-2 text-xs font-semibold text-black underline hover:no-underline"
                         >
                           Clear Filters
                         </button>
                       </div>
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
           
           {/* Pagination */}
           <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
              <span className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-gray-900">{filteredData.length}</span> entries
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                >
                  <HiChevronLeft className="text-gray-600" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, i) => (
                   <button
                     key={i}
                     onClick={() => setCurrentPage(i + 1)}
                     className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                       currentPage === i + 1 
                         ? "bg-black text-white shadow-md" 
                         : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                     }`}
                   >
                     {i + 1}
                   </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                >
                  <HiChevronRight className="text-gray-600" />
                </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}