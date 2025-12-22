"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";

// Define the shape of an Order (matches your Backend Model)
interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
  };
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CONNECT TO BACKEND ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // This URL talks to the Backend Route you just made
        const res = await fetch("http://localhost:5000/api/orders");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">Loading Orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black mb-4">No Orders Found</h2>
        <Link href="/" className="underline">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-8">Recent Orders</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
              
              {/* Order Info */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Order ID: {order._id}</p>
                <h3 className="font-bold text-lg">
                  {order.customer.firstName} {order.customer.lastName}
                </h3>
                <p className="text-sm text-gray-500">{order.customer.email}</p>
                <div className="mt-2 text-xs font-medium bg-gray-100 inline-block px-2 py-1 rounded">
                   {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Status & Total */}
              <div className="text-left md:text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 
                  ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {order.status}
                </span>
                <p className="text-2xl font-black">₹{order.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{order.items.length} Items</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}