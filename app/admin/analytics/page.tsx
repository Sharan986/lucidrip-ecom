"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  HiOutlineArrowTrendingUp, 
  HiOutlineArrowTrendingDown,
  HiOutlineCalendar
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAdminDataStore } from "@/store/useAdminDataStore";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("6m");
  const { adminToken } = useAdminAuthStore();
  const { 
    kpiData, 
    monthlyRevenue, 
    topProducts, 
    trafficSources,
    totalRevenue,
    avgMonthlyRevenue,
    isLoading, 
    error,
    fetchAnalyticsData 
  } = useAdminDataStore();

  useEffect(() => {
    if (adminToken) {
      fetchAnalyticsData(adminToken, dateRange);
    }
  }, [adminToken, dateRange, fetchAnalyticsData]);

  const maxRevenue = monthlyRevenue.length > 0 
    ? Math.max(...monthlyRevenue.map(m => m.revenue)) 
    : 1;

  // Range label mapping
  const rangeLabels: Record<string, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "6m": "Last 6 months",
    "1y": "Last year"
  };

  // Fallback data
  const displayKPI = kpiData.length > 0 ? kpiData : [
    { label: "Total Revenue", value: "₹0", change: "0%", positive: true },
    { label: "Orders", value: "0", change: "0%", positive: true },
    { label: "Avg. Order Value", value: "₹0", change: "0%", positive: true },
    { label: "Conversion Rate", value: "0%", change: "0%", positive: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Insights
          </p>
          <h1 className="text-2xl font-extralight text-neutral-900">
            <span className="italic">Analytics</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 border border-neutral-200 p-1">
          {["7d", "30d", "6m", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase transition ${
                dateRange === range 
                  ? "bg-neutral-900 text-white" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* --- KPI CARDS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {displayKPI.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-neutral-200 bg-white p-5"
          >
            <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-3">
              {kpi.label}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-light text-neutral-900">
                {isLoading ? "..." : kpi.value}
              </p>
              <div className={`flex items-center gap-1 text-xs ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.positive ? <HiOutlineArrowTrendingUp className="w-4 h-4" /> : <HiOutlineArrowTrendingDown className="w-4 h-4" />}
                {kpi.change}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- REVENUE CHART --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 border border-neutral-200 bg-white p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
              Revenue Overview
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <HiOutlineCalendar className="w-4 h-4" />
              {rangeLabels[dateRange]}
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-2">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                Loading chart...
              </div>
            ) : monthlyRevenue.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                No revenue data available
              </div>
            ) : (
              monthlyRevenue.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-neutral-900 transition-all hover:bg-neutral-700"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: item.revenue > 0 ? '4px' : '0' }}
                  />
                  <span className="text-[10px] tracking-[0.1em] uppercase text-neutral-400">
                    {item.month}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between text-[11px] text-neutral-500">
            <span>Total: ₹{totalRevenue.toLocaleString()}</span>
            <span>Avg: ₹{avgMonthlyRevenue.toLocaleString()}/month</span>
          </div>
        </motion.div>

        {/* --- TRAFFIC SOURCES --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-neutral-200 bg-white p-6"
        >
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6">
            Traffic Sources
          </h2>
          <div className="space-y-4">
            {trafficSources.length === 0 ? (
              <div className="text-neutral-400 text-sm text-center py-8">
                No traffic data
              </div>
            ) : (
              trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-light text-neutral-900">{source.source}</span>
                    <span className="text-xs text-neutral-500">{source.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100">
                    <div 
                      className="h-full bg-neutral-900 transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <p className="text-[11px] text-neutral-500">
              Total: {trafficSources.reduce((sum, s) => sum + s.visitors, 0).toLocaleString()} visitors
            </p>
          </div>
        </motion.div>
      </div>

      {/* --- TOP PRODUCTS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border border-neutral-200 bg-white"
      >
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
            Top Performing Products
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left py-3 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Product</th>
              <th className="text-right py-3 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Units Sold</th>
              <th className="text-right py-3 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-neutral-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : topProducts.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-neutral-400 text-sm">
                  No product sales data available
                </td>
              </tr>
            ) : (
              topProducts.map((product, i) => (
                <tr key={product.name} className="border-b border-neutral-100 last:border-b-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-neutral-100 text-[10px] text-neutral-500">
                        {i + 1}
                      </span>
                      <span className="text-sm font-light text-neutral-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-light text-neutral-600">
                    {product.sales}
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-light text-neutral-900">
                    ₹{product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
