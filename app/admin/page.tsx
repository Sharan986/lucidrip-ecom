"use client";

import React from "react";
import Link from "next/link";
import { 
  HiOutlineArrowUpRight, 
  HiArrowLongRight,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineBell,
  HiOutlineClock,
  HiCheckCircle,
  HiExclamationCircle
} from "react-icons/hi2";

// --- MOCK DATA ---
const stats = [
  { 
    label: "TODAY'S REVENUE", 
    value: "₹42,500", 
    trend: "+12.5%", 
    desc: "VS YESTERDAY",
    icon: HiOutlineBanknotes,
    status: "good"
  },
  { 
    label: "PENDING ORDERS", 
    value: "12", 
    trend: "+4",
    desc: "REQUIRES ACTION",
    icon: HiOutlineShoppingBag,
    status: "warning"
  },
  { 
    label: "NEW CUSTOMERS", 
    value: "24", 
    trend: "+18%",
    desc: "THIS WEEK",
    icon: HiOutlineUsers,
    status: "good"
  },
  { 
    label: "LOW STOCK ITEMS", 
    value: "3", 
    trend: "-1",
    desc: "RESTOCK NEEDED",
    icon: HiOutlineCube,
    status: "critical"
  },
];

const recentActivity = [
  { id: 1, type: "order", text: "New order #ORD-7829 from Sumit Mehta", time: "2 min ago", amount: "₹4,299" },
  { id: 2, type: "user", text: "New customer registration: Sarah Jenkins", time: "15 min ago", amount: "" },
  { id: 3, type: "alert", text: "Stock alert: 'Classic Beige Knit' is low", time: "1 hr ago", amount: "3 left" },
  { id: 4, type: "payment", text: "Payment failed for order #ORD-7826", time: "2 hrs ago", amount: "₹2,100" },
];

const recentOrders = [
  { id: "ORD-7829", customer: "Sumit Mehta", amount: "4,299", status: "PENDING", items: 3, date: "OCT 24", payment: "UPI" },
  { id: "ORD-7828", customer: "Priya Singh", amount: "1,499", status: "SHIPPED", items: 1, date: "OCT 23", payment: "CC" },
  { id: "ORD-7827", customer: "Rahul Verma", amount: "8,999", status: "DELIVERED", items: 5, date: "OCT 22", payment: "COD" },
  { id: "ORD-7826", customer: "Sneha Kapoor", amount: "2,100", status: "CANCELLED", items: 2, date: "OCT 21", payment: "UPI" },
  { id: "ORD-7825", customer: "Vikram Das", amount: "3,450", status: "PENDING", items: 2, date: "OCT 20", payment: "CC" },
];

// --- COMPONENTS ---

// Minimalist Status Dot
const StatusIndicator = ({ status }: { status: string }) => {
  const styles = {
    PENDING: "bg-yellow-500",
    SHIPPED: "bg-blue-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500"
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${styles[status as keyof typeof styles] || "bg-gray-400"}`} />
      <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">{status}</span>
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20 font-sans">
      
      {/* --- TOP BAR (Technical) --- */}
      <div className="border-b border-zinc-200 sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-black animate-pulse"></div>
             <p className="text-xs font-bold tracking-widest uppercase">Live Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded text-[10px] font-mono text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                SYSTEM HEALTH: 100%
             </div>
             <p className="text-[10px] font-mono font-medium text-zinc-400">
               {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-6">
        
        {/* --- SECTION 1: METRICS GRID (Operational Focus) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="group relative border border-zinc-200 p-6 hover:border-black transition-colors duration-300 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-zinc-400 group-hover:text-black transition-colors">
                     <Icon className="text-lg" />
                     <p className="text-[10px] font-bold tracking-widest uppercase">{stat.label}</p>
                  </div>
                  {stat.status === 'good' && <HiCheckCircle className="text-green-500" />}
                  {stat.status === 'warning' && <HiExclamationCircle className="text-yellow-500" />}
                  {stat.status === 'critical' && <HiExclamationCircle className="text-red-500" />}
                </div>
                
                <div className="flex items-baseline gap-2 mt-4">
                  <h3 className="text-3xl font-medium tracking-tight text-zinc-900 font-mono">
                    {stat.value}
                  </h3>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 ${stat.trend.includes('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {stat.trend}
                  </span>
                </div>
                
                <p className="text-[10px] font-bold text-zinc-300 mt-2 uppercase tracking-wide group-hover:text-zinc-500 transition-colors">{stat.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* --- SECTION 2: LIVE ACTIVITY FEED (Replacement for Chart) --- */}
          <div className="xl:col-span-2 border border-zinc-200 bg-white p-0">
             <div className="flex justify-between items-center p-6 border-b border-zinc-200 bg-zinc-50/30">
                <div className="flex items-center gap-2">
                   <HiOutlineBell className="text-zinc-400" />
                   <h2 className="text-sm font-bold uppercase tracking-widest">Live Activity</h2>
                </div>
                <button className="text-[10px] font-bold uppercase border-b border-black hover:opacity-50">View All</button>
             </div>
             
             <div className="divide-y divide-zinc-100">
                {recentActivity.map((item) => (
                   <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${
                            item.type === 'order' ? 'bg-blue-500' :
                            item.type === 'alert' ? 'bg-red-500' :
                            item.type === 'payment' ? 'bg-yellow-500' : 'bg-zinc-300'
                         }`}></div>
                         <div>
                            <p className="text-sm font-medium text-zinc-900">{item.text}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <HiOutlineClock className="text-[10px] text-zinc-400" />
                               <span className="text-[10px] text-zinc-400 font-mono uppercase">{item.time}</span>
                            </div>
                         </div>
                      </div>
                      {item.amount && (
                         <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded">{item.amount}</span>
                      )}
                   </div>
                ))}
             </div>
             <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-center">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Real-time updates enabled</p>
             </div>
          </div>

          {/* --- SECTION 3: QUICK ACTIONS (Command Center) --- */}
          <div className="xl:col-span-1 border border-zinc-200 bg-white p-8">
             <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Operations</h2>
             
             <div className="space-y-4">
                <Link href="/admin/products/add" className="block group">
                   <div className="p-4 border border-zinc-100 bg-zinc-50 hover:bg-black hover:border-black transition-all duration-300 flex items-center justify-between">
                      <div>
                         <p className="text-xs font-bold text-zinc-900 group-hover:text-white uppercase mb-1">Add Product</p>
                         <p className="text-[10px] text-zinc-400 group-hover:text-zinc-500 font-mono">INVENTORY + SKU</p>
                      </div>
                      <HiOutlineCube className="text-zinc-300 group-hover:text-white text-xl" />
                   </div>
                </Link>

                <Link href="/admin/orders" className="block group">
                   <div className="p-4 border border-zinc-100 bg-zinc-50 hover:bg-black hover:border-black transition-all duration-300 flex items-center justify-between">
                      <div>
                         <p className="text-xs font-bold text-zinc-900 group-hover:text-white uppercase mb-1">Manage Orders</p>
                         <p className="text-[10px] text-zinc-400 group-hover:text-zinc-500 font-mono">12 PENDING</p>
                      </div>
                      <HiOutlineShoppingBag className="text-zinc-300 group-hover:text-white text-xl" />
                   </div>
                </Link>

                <div className="mt-8 pt-8 border-t border-zinc-100">
                   <div className="flex items-center justify-between text-xs mb-4">
                      <span className="font-bold text-zinc-400 uppercase tracking-widest">Server Load</span>
                      <span className="font-mono text-zinc-900">24%</span>
                   </div>
                   <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-1/4"></div>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* --- SECTION 4: RECENT ORDERS TABLE (Data Dense) --- */}
        <div className="mt-8 border border-zinc-200 bg-white">
           <div className="flex justify-between items-center p-6 border-b border-zinc-200 bg-zinc-50/30">
              <h2 className="text-sm font-bold uppercase tracking-widest">Recent Transactions</h2>
              <Link href="/admin/orders" className="text-[10px] font-bold uppercase border-b border-black hover:opacity-50 flex items-center gap-1">
                 View All <HiArrowLongRight />
              </Link>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-white border-b border-zinc-100">
                    <tr>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase w-32">Order ID</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Customer</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Method</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase text-right">Amount</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100">
                    {recentOrders.map((order) => (
                       <tr key={order.id} className="group hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-medium text-zinc-500 group-hover:text-black">
                             #{order.id.split('-')[1]}
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs font-bold text-zinc-900">{order.customer}</p>
                             <p className="text-[10px] text-zinc-400 mt-0.5">{order.date}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-[10px] font-mono border border-zinc-200 px-2 py-1 rounded bg-white text-zinc-600">{order.payment}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-xs font-medium text-zinc-900">
                             ₹{order.amount}
                          </td>
                          <td className="px-6 py-4 flex justify-end">
                             <StatusIndicator status={order.status} />
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}