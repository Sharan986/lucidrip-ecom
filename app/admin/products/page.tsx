"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  HiPlus, 
  HiOutlineMagnifyingGlass, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineEye
} from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAdminDataStore, AdminProduct } from "@/store/useAdminDataStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft: "bg-amber-50 text-amber-700 border-amber-200",
    "Low Stock": "bg-red-50 text-red-600 border-red-200",
    Archived: "bg-neutral-100 text-neutral-500 border-neutral-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status] || styles.Active}`}>
      {status}
    </span>
  );
};

export default function ProductsPage() {
  const { adminToken } = useAdminAuthStore();
  const { products, productCount, isLoading, error, fetchProducts } = useAdminDataStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (adminToken && !dataLoaded) {
      fetchProducts(adminToken);
      setDataLoaded(true);
    }
  }, [adminToken, fetchProducts, dataLoaded]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    if (!adminToken) return;
    
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      
      if (response.ok) {
        // Refresh products list
        fetchProducts(adminToken);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const tabs = ["All", "Active", "Low Stock", "Draft"];

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Inventory
          </p>
          <h1 className="text-2xl font-extralight text-neutral-900">
            <span className="italic">Products</span>
          </h1>
          {!isLoading && (
            <p className="text-xs text-neutral-500 mt-1">{productCount} products total</p>
          )}
        </div>
        <Link href="/admin/products/add">
          <button className="px-4 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition flex items-center gap-2">
            <HiPlus className="w-4 h-4" /> Add Product
          </button>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex border border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase transition-all ${
                statusFilter === tab 
                  ? "bg-neutral-900 text-white" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
          />
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      {isLoading ? (
        <div className="text-center py-16 border border-neutral-200">
          <p className="text-sm font-light text-neutral-500">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-neutral-200">
          <p className="text-sm font-light text-neutral-500">No products found</p>
          <Link href="/admin/products/add" className="text-xs text-neutral-900 underline underline-offset-4 mt-2 inline-block">
            Add your first product
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group border border-neutral-200 bg-white hover:border-neutral-900 transition-colors"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                <Image 
                  src={product.img} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={product.status} />
                </div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Link 
                    href={`/product/${product.slug}`}
                    className="p-3 bg-white hover:bg-neutral-100 transition"
                  >
                    <HiOutlineEye className="w-4 h-4 text-neutral-900" />
                  </Link>
                  <Link 
                    href={`/admin/products/edit/${product._id}`}
                    className="p-3 bg-white hover:bg-neutral-100 transition"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4 text-neutral-900" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="p-3 bg-white hover:bg-red-50 transition"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">
                  {product.category}
                </p>
                <h3 className="text-sm font-light text-neutral-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-neutral-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className={`text-[10px] ${product.stock > 20 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  SKU: {product.sku}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
