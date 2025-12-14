"use client";

import React from "react";
import Link from "next/link";
import { 
  HiOutlineArrowUpRight, 
  HiArrowLongRight,
  HiOutlineCube,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA ---
const stats = [
  { 
    label: "TOTAL REVENUE", 
    value: "4,50,200", 
    trend: "+12.5%", 
    desc: "NET INCOME",
    isMain: true 
  },
  { 
    label: "TOTAL ORDERS", 
    value: "1,240", 
    trend: "+8.2%",
    desc: "PROCESSED"
  },
  { 
    label: "AVG. ORDER VALUE", 
    value: "3,150", 
    trend: "+2.1%",
    desc: "PER CUSTOMER"
  },
  { 
    label: "STOCK LEVEL", 
    value: "845", 
    trend: "-14",
    desc: "UNITS AVAILABLE"
  },
];

const recentOrders = [
  { id: "ORD-7829", customer: "Arjun Mehta", amount: "4,299", status: "PENDING", items: 3, date: "OCT 24" },
  { id: "ORD-7828", customer: "Priya Singh", amount: "1,499", status: "SHIPPED", items: 1, date: "OCT 23" },
  { id: "ORD-7827", customer: "Rahul Verma", amount: "8,999", status: "DELIVERED", items: 5, date: "OCT 22" },
  { id: "ORD-7826", customer: "Sneha Kapoor", amount: "2,100", status: "CANCELLED", items: 2, date: "OCT 21" },
  { id: "ORD-7825", customer: "Vikram Das", amount: "3,450", status: "PENDING", items: 2, date: "OCT 20" },
];

const revenueData = [
  { name: 'OCT 18', value: 12500 },
  { name: 'OCT 19', value: 18400 },
  { name: 'OCT 20', value: 15600 },
  { name: 'OCT 21', value: 9800 },
  { name: 'OCT 22', value: 24500 },
  { name: 'OCT 23', value: 19200 },
  { name: 'OCT 24', value: 28400 },
];

// --- COMPONENTS ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-3 border border-zinc-800 shadow-xl">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1">{label}</p>
        <p className="text-sm font-mono">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const StatusIndicator = ({ status }: { status: string }) => {
  const isPending = status === "PENDING";
  const isShipped = status === "SHIPPED";
  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";

  return (
    <span className={`
      inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold tracking-widest border whitespace-nowrap
      ${isPending ? "bg-zinc-100 text-zinc-900 border-zinc-200" : ""}
      ${isShipped ? "bg-zinc-900 text-white border-black" : ""}
      ${isDelivered ? "bg-white text-zinc-900 border-zinc-300" : ""}
      ${isCancelled ? "bg-white text-zinc-400 border-zinc-100 line-through" : ""}
    `}>
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      
      {/* --- TOP BAR --- */}
      <div className="border-b border-zinc-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-auto md:h-16 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
          <p className="text-xs font-mono text-zinc-400">ADMIN // DASHBOARD</p>
          <p className="text-xs font-mono text-zinc-900">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* --- SECTION 1: KEY METRICS --- */}
        {/* Responsive Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 border-t border-l border-zinc-200 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="border-r border-b border-zinc-200 p-6 md:p-8 hover:bg-zinc-50 transition-colors group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{stat.label}</p>
                <span className="text-[10px] font-mono text-zinc-900 bg-zinc-100 px-1.5 py-0.5">{stat.trend}</span>
              </div>
              
              <div className="flex items-baseline gap-1">
                {stat.label.includes("REVENUE") && <span className="text-xl font-light text-zinc-400">₹</span>}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 font-sans break-all">
                  {stat.value}
                </h3>
              </div>
              
              <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase">{stat.desc}</p>
              
              <HiOutlineArrowUpRight className="absolute top-4 right-4 text-2xl text-zinc-200 group-hover:text-black transition-colors" />
            </div>
          ))}
        </div>

        {/* --- SECTION 2: REVENUE CHART --- */}
        <div className="mb-16 border border-zinc-200 p-4 md:p-8 bg-white">
          {/* Header wraps on mobile */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 md:gap-0">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Revenue Analytics</h2>
              <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase">Oct 18 - Oct 24 Performance</p>
            </div>
            <div className="flex gap-2">
               {['7D', '1M', '1Y'].map(range => (
                 <button key={range} className="px-3 py-1 border border-zinc-200 text-[10px] font-bold hover:bg-black hover:text-white transition-colors">
                   {range}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace'}}
                  tickFormatter={(value) => `₹${value}`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#000000" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- SECTION 3: ORDERS TABLE & ACTIONS --- */}
        {/* Stacks on mobile/tablet, side-by-side on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          
          <div className="xl:col-span-2">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Incoming Orders</h2>
              <Link href="/admin/orders" className="text-xs font-bold border-b border-black pb-0.5 hover:opacity-60 transition-opacity flex items-center gap-2 whitespace-nowrap">
                VIEW ALL <span className="hidden md:inline">LOGS</span> <HiArrowLongRight />
              </Link>
            </div>

            <div className="border border-zinc-200 bg-white w-full overflow-hidden">
              {/* Scroll wrapper for mobile table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">ID / Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="group hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-zinc-500 group-hover:text-black transition-colors">#{order.id}</span>
                          <div className="text-[10px] text-zinc-400 font-mono mt-1 uppercase">{order.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-zinc-900">{order.customer}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{order.items} ITEMS</p>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-zinc-900">
                          ₹{order.amount}
                        </td>
                        <td className="px-6 py-4">
                          <StatusIndicator status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/admin/products/add" className="block group">
                  <div className="border border-zinc-200 p-5 flex items-center justify-between hover:bg-black hover:border-black transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                        <HiOutlineCube className="text-xl text-zinc-900 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-white">ADD PRODUCT</p>
                        <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Inventory update</p>
                      </div>
                    </div>
                    <HiArrowLongRight className="text-zinc-300 group-hover:text-white" />
                  </div>
                </Link>

                <Link href="/admin/orders" className="block group">
                  <div className="border border-zinc-200 p-5 flex items-center justify-between hover:bg-black hover:border-black transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                        <HiOutlineShoppingBag className="text-xl text-zinc-900 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-white">MANAGE ORDERS</p>
                        <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400">12 Pending</p>
                      </div>
                    </div>
                    <HiArrowLongRight className="text-zinc-300 group-hover:text-white" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}