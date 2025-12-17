"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  HiOutlineArrowDownTray, 
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineArrowTrendingUp // 👈 CHANGED THIS (Fixed Import)
} from "react-icons/hi2";

// --- IMPORT YOUR DATA ---
import { featuredItems} from "@/data/products"; 

// --- TYPES ---
interface ProductAnalytics {
  id: number;
  name: string;
  price: number;
  img: string;
  category: string; 
  views: number;
  sales: number;
  revenue: number;
  conversion: number;
  stock: number;
}

// --- MOCK DATA GENERATOR ---
const generateAnalyticsData = (): ProductAnalytics[] => {
  return featuredItems.map((item) => {
    const baseSales = Math.floor(Math.random() * 500) + 20;
    const sales = item.price > 3000 ? baseSales / 2 : baseSales; 
    const views = sales * (Math.floor(Math.random() * 20) + 10);
    const revenue = sales * item.price;
    const conversion = (sales / views) * 100;
    const stock = Math.floor(Math.random() * 100);

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      category: item.slug.includes("hoodie") ? "Hoodies" : item.slug.includes("knit") ? "Knitwear" : "Apparel",
      views: Math.floor(views),
      sales: Math.floor(sales),
      revenue: revenue,
      conversion: parseFloat(conversion.toFixed(1)),
      stock: stock
    };
  }).sort((a, b) => b.revenue - a.revenue); 
};

export default function AnalyticsPage() {
  const [data] = useState<ProductAnalytics[]>(generateAnalyticsData());
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  // --- AGGREGATED STATS ---
  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);
  const totalSales = data.reduce((acc, item) => acc + item.sales, 0);
  const totalViews = data.reduce((acc, item) => acc + item.views, 0);
  const avgOrderValue = totalRevenue / totalSales;

  // --- CHART DATA (Mocked Trend) ---
  const chartData = [
    { name: 'Week 1', revenue: totalRevenue * 0.15, sales: totalSales * 0.18 },
    { name: 'Week 2', revenue: totalRevenue * 0.25, sales: totalSales * 0.22 },
    { name: 'Week 3', revenue: totalRevenue * 0.20, sales: totalSales * 0.25 },
    { name: 'Week 4', revenue: totalRevenue * 0.40, sales: totalSales * 0.35 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
            <p className="text-sm text-zinc-500 mt-1">Performance metrics for your {data.length} products.</p>
          </div>
          
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-lg text-sm font-medium shadow-sm">
                <HiOutlineCalendar className="text-zinc-400" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer"
                >
                   <option>Last 7 Days</option>
                   <option>Last 30 Days</option>
                   <option>Year to Date</option>
                </select>
             </div>
             <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition shadow-md">
               <HiOutlineArrowDownTray /> Export Report
             </button>
          </div>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <KpiCard 
             title="Total Revenue" 
             value={`₹${totalRevenue.toLocaleString()}`} 
             trend="+12.5%" 
             icon={HiOutlineCurrencyDollar} 
           />
           <KpiCard 
             title="Units Sold" 
             value={totalSales.toLocaleString()} 
             trend="+8.2%" 
             icon={HiOutlineShoppingBag} 
           />
           <KpiCard 
             title="Store Views" 
             value={totalViews.toLocaleString()} 
             trend="-2.4%" 
             icon={HiOutlineEye} 
             isNegative
           />
           <KpiCard 
             title="Avg. Order Value" 
             value={`₹${Math.floor(avgOrderValue).toLocaleString()}`} 
             trend="+5.1%" 
             icon={HiOutlineArrowTrendingUp} // 👈 USED CORRECT ICON HERE
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           
           {/* --- REVENUE CHART --- */}
           <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6">Revenue Trend</h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', border: 'none' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                       />
                       <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* --- TOP PRODUCTS (Mini Bar) --- */}
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6">Top Performers</h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.slice(0, 5)} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} interval={0} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                       <Bar dataKey="revenue" barSize={20} radius={[0, 4, 4, 0]}>
                          {data.slice(0, 5).map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? '#000' : '#d4d4d8'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* --- DETAILED PRODUCT TABLE --- */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-900">Product Performance</h3>
              <div className="text-xs text-zinc-500">Sorted by Revenue</div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Product</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Price</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Sold</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Stock</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Conversion</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Revenue</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-50">
                    {data.map((item) => (
                       <tr key={item.id} className="hover:bg-zinc-50 transition group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <div className="relative w-10 h-12 bg-zinc-100 rounded border border-zinc-200 overflow-hidden">
                                   <Image src={item.img} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition">{item.name}</p>
                                   <p className="text-[10px] text-zinc-500 font-mono uppercase">ID: {item.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-zinc-600">
                             ₹{item.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-zinc-900 font-bold">
                             {item.sales}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className={`text-xs font-bold px-2 py-1 rounded ${
                                item.stock < 10 ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-600"
                             }`}>
                                {item.stock}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-zinc-600">
                             {item.conversion}%
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm font-bold text-zinc-900">
                             ₹{item.revenue.toLocaleString()}
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

// --- SUB-COMPONENT: KPI CARD ---
const KpiCard = ({ title, value, trend, icon: Icon, isNegative = false }: any) => (
  <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
     <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-zinc-900 font-mono tracking-tight">{value}</h3>
        <div className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
           isNegative ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        }`}>
           {trend} <span className="font-normal text-zinc-400">vs last period</span>
        </div>
     </div>
     <div className="p-3 bg-zinc-50 rounded-lg text-zinc-400">
        <Icon className="text-xl" />
     </div>
  </div>
);