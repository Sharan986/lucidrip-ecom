"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  HiPlus, 
  HiOutlineMagnifyingGlass, 
  HiOutlineFunnel, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiEllipsisVertical,
  HiCheck
} from "react-icons/hi2";

// --- TYPES ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Archived";
  img: string;
  sku: string;
}

// --- MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  { id: "PRD-001", name: "Oversized Street Hoodie", category: "Hoodies", price: 2499, stock: 124, status: "Active", img: "/Hero/Product1.avif", sku: "HD-BLK-01" },
  { id: "PRD-002", name: "Classic Beige Knit", category: "Knitwear", price: 1899, stock: 0, status: "Draft", img: "/Hero/Product2.avif", sku: "KN-BGE-02" },
  { id: "PRD-003", name: "Tactical Cargo Pant", category: "Bottoms", price: 3200, stock: 45, status: "Active", img: "/Hero/Product3.avif", sku: "PN-GRN-03" },
  { id: "PRD-004", name: "Graphic Print Tee", category: "T-Shirts", price: 999, stock: 200, status: "Active", img: "/Hero/Product4.avif", sku: "TS-WHT-04" },
  { id: "PRD-005", name: "Utility Bomber Jacket", category: "Jackets", price: 5499, stock: 15, status: "Archived", img: "/Hero/Product1.avif", sku: "JK-OLV-05" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // --- ACTIONS (Functional Logic) ---

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: Product["status"]) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price)) {
      setProducts(products.map(p => p.id === id ? { ...p, price } : p));
    }
  };

  const handleStockChange = (id: string, newStock: string) => {
    const stock = parseInt(newStock);
    if (!isNaN(stock)) {
      setProducts(products.map(p => p.id === id ? { ...p, stock } : p));
    }
  };

  // --- FILTERING ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your catalog, prices, and inventory.</p>
          </div>
          <Link href="/admin/products/add">
            <button className="bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition shadow-lg flex items-center gap-2">
              <HiPlus className="text-lg" /> Add Product
            </button>
          </Link>
        </div>

        {/* --- TABLE CARD --- */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
             
             {/* Search */}
             <div className="relative w-full sm:w-80">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or SKU..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black transition placeholder:text-zinc-400"
                />
             </div>

             {/* Filters */}
             <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                   <select 
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="appearance-none bg-zinc-50 border border-zinc-200 text-zinc-700 py-2 pl-4 pr-10 rounded-lg text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-black cursor-pointer"
                   >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                   </select>
                   <HiOutlineFunnel className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-16">Image</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Product Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32">Price (₹)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32">Inventory</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                   {filteredProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-zinc-50/80 transition-colors">
                         
                         {/* Image */}
                         <td className="px-6 py-4">
                            <div className="w-12 h-14 bg-zinc-100 rounded border border-zinc-200 relative overflow-hidden">
                               <Image src={product.img} alt={product.name} fill className="object-cover" />
                            </div>
                         </td>

                         {/* Details */}
                         <td className="px-6 py-4">
                            <Link href={`/admin/products/add?id=${product.id}`} className="block">
                               <p className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition">{product.name}</p>
                               <p className="text-xs text-zinc-500 mt-0.5 font-mono">{product.sku}</p>
                            </Link>
                         </td>

                         {/* Status Dropdown (Functional) */}
                         <td className="px-6 py-4">
                            <select 
                              value={product.status}
                              onChange={(e) => handleStatusChange(product.id, e.target.value as Product["status"])}
                              className={`text-[10px] font-bold uppercase px-2 py-1 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/5 ${
                                product.status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
                                product.status === "Draft" ? "bg-zinc-100 text-zinc-600 border-zinc-200" :
                                "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                               <option value="Active">Active</option>
                               <option value="Draft">Draft</option>
                               <option value="Archived">Archived</option>
                            </select>
                         </td>

                         {/* Price (Editable) */}
                         <td className="px-6 py-4">
                            <input 
                              type="number"
                              value={product.price}
                              onChange={(e) => handlePriceChange(product.id, e.target.value)}
                              className="w-24 px-2 py-1 text-sm font-mono font-medium bg-transparent hover:bg-white border border-transparent hover:border-zinc-200 rounded focus:bg-white focus:border-black focus:outline-none transition-all"
                            />
                         </td>

                         {/* Stock (Editable) */}
                         <td className="px-6 py-4">
                            <input 
                              type="number"
                              value={product.stock}
                              onChange={(e) => handleStockChange(product.id, e.target.value)}
                              className={`w-20 px-2 py-1 text-sm font-mono font-medium bg-transparent hover:bg-white border border-transparent hover:border-zinc-200 rounded focus:bg-white focus:border-black focus:outline-none transition-all ${product.stock === 0 ? "text-red-500" : "text-zinc-900"}`}
                            />
                         </td>

                         {/* Actions */}
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Link href={`/admin/products/add?id=${product.id}`}>
                                  <button className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit Full Details">
                                     <HiOutlinePencilSquare className="text-lg" />
                                  </button>
                               </Link>
                               <button 
                                 onClick={() => handleDelete(product.id)}
                                 className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition" 
                                 title="Delete"
                               >
                                  <HiOutlineTrash className="text-lg" />
                               </button>
                            </div>
                         </td>

                      </tr>
                   ))}
                   
                   {/* Empty State */}
                   {filteredProducts.length === 0 && (
                      <tr>
                         <td colSpan={6} className="px-6 py-24 text-center text-zinc-400">
                            No products found matching your search.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* Footer */}
          <div className="bg-zinc-50 border-t border-zinc-100 px-6 py-3 text-xs text-zinc-400 flex justify-between">
             <span>Showing {filteredProducts.length} items</span>
             <span>Use inputs to quick-edit price and stock</span>
          </div>

        </div>
      </div>
    </div>
  );
}