"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// --- TYPES ---
interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  method: "Card" | "UPI" | "Wallet" | "COD";
  amount: number;
  fee: number;
  net: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  date: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalFees: number;
  pending: number;
  refunded: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
    Refunded: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const MethodBadge = ({ method }: { method: string }) => {
  const styles: Record<string, string> = {
    Card: "bg-violet-50 text-violet-700 border-violet-200",
    UPI: "bg-green-50 text-green-700 border-green-200",
    Wallet: "bg-orange-50 text-orange-700 border-orange-200",
    COD: "bg-neutral-100 text-neutral-600 border-neutral-200",
    Razorpay: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[method] || styles.UPI}`}>
      {method}
    </span>
  );
};

export default function PaymentsPage() {
  const { adminToken } = useAdminAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalFees: 0,
    pending: 0,
    refunded: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchPayments = async () => {
      if (!adminToken) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/admin/payments`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }
        
        const data = await response.json();
        setTransactions(data.transactions || []);
        setStats(data.stats || { totalRevenue: 0, totalFees: 0, pending: 0, refunded: 0 });
      } catch (err: any) {
        setError(err.message || "Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [adminToken]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            txn.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || txn.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const handleExport = () => {
    const headers = ["Transaction ID,Order ID,Customer,Method,Amount,Fee,Net,Status,Date\n"];
    const rows = filteredTransactions.map(t => 
      `${t.id},${t.orderId},${t.customer},${t.method},${t.amount},${t.fee},${t.net},${t.status},${t.date}`
    );
    const blob = new Blob([...headers, ...rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Transactions
          </p>
          <h1 className="text-2xl font-extralight text-neutral-900">
            <span className="italic">Payments</span>
          </h1>
        </div>
        <button 
          onClick={handleExport}
          className="px-4 py-2.5 border border-neutral-200 text-neutral-700 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition flex items-center gap-2"
        >
          <HiOutlineArrowDownTray className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* --- STATS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Total Revenue</p>
          <p className="text-2xl font-light text-neutral-900">
            {isLoading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
          </p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Processing Fees</p>
          <p className="text-2xl font-light text-neutral-900">
            {isLoading ? "..." : `₹${stats.totalFees.toLocaleString()}`}
          </p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Pending</p>
          <p className="text-2xl font-light text-amber-600">
            {isLoading ? "..." : stats.pending}
          </p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Refunded</p>
          <p className="text-2xl font-light text-blue-600">
            {isLoading ? "..." : `₹${stats.refunded.toLocaleString()}`}
          </p>
        </div>
      </motion.div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex border border-neutral-200">
          {["All", "Completed", "Pending", "Failed", "Refunded"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-2 text-[10px] tracking-[0.1em] uppercase transition-all ${
                statusFilter === tab 
                  ? "bg-neutral-900 text-white" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..." 
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
          />
        </div>
      </div>

      {/* --- TRANSACTIONS TABLE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-neutral-200 bg-white overflow-x-auto"
      >
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Transaction</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Customer</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Method</th>
              <th className="text-right py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Amount</th>
              <th className="text-right py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Fee</th>
              <th className="text-right py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Net</th>
              <th className="text-left py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Status</th>
              <th className="text-right py-4 px-6 text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-400 text-sm">
                  Loading transactions...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-400 text-sm">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn, i) => (
                <motion.tr 
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-mono text-neutral-900">{txn.id}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{txn.orderId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-light text-neutral-900">{txn.customer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <MethodBadge method={txn.method} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-light text-neutral-900">₹{txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-light text-neutral-500">{txn.fee > 0 ? `-₹${txn.fee}` : "—"}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-light text-neutral-900">₹{txn.net.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-xs text-neutral-500">{txn.date}</span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
