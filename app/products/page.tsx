"use client";

import React, { useState, useEffect, useMemo } from "react";
import { featuredItems } from "@/data/products";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { 
  HiOutlineShoppingBag, 
  HiCheck, 
  HiChevronDown, 
  HiAdjustmentsHorizontal 
} from "react-icons/hi2";

// --- TYPES ---
type SortOption = "newest" | "price-low" | "price-high";
type FilterOption = "all" | "hoodies" | "tees" | "pants";

const ProductsList = () => {
  const addItem = useCartStore((state) => state.addItem);
  
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("newest");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  // --- INITIAL LOAD SIMULATION ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...featuredItems];

    // Filter
    if (activeFilter !== "all") {
      result = result.filter((item) => {
        const name = item.name.toLowerCase();
        if (activeFilter === "hoodies") return name.includes("hoodie") || name.includes("pullover") || name.includes("sweater");
        if (activeFilter === "tees") return name.includes("tee") || name.includes("top");
        if (activeFilter === "pants") return name.includes("pant") || name.includes("sweat");
        return true;
      });
    }

    // Sort
    if (activeSort === "price-low") result.sort((a, b) => a.price - b.price);
    if (activeSort === "price-high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeFilter, activeSort]);

  // --- ADD TO CART HANDLER ---
  const handleQuickAdd = (e: React.MouseEvent, item: typeof featuredItems[0]) => {
    e.preventDefault(); 
    e.stopPropagation();
    setLoadingId(item.id);

    addItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: "Medium", 
      color: "Standard",
      img: item.img,
    });

    setTimeout(() => {
      setLoadingId(null);
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- STICKY TOOLBAR (Mobile Optimized) --- */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3">
          
          <div className="flex items-center justify-between gap-4">
            
            {/* LEFT: Horizontal Scrollable Filters */}
            <div className="flex-1 overflow-x-auto scrollbar-hide"> 
              <div className="flex items-center gap-2 pr-4">
                {(["all", "hoodies", "tees", "pants"] as FilterOption[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                      activeFilter === cat 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {cat === "all" ? "All Items" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Compact Sort Dropdown */}
            <div className="relative pl-4 border-l border-gray-200 shrink-0">
              <div className="relative group">
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 cursor-pointer">
                  <span className="hidden sm:inline">Sort</span>
                  <HiAdjustmentsHorizontal className="sm:hidden text-xl" /> 
                  <HiChevronDown className="text-gray-400" />
                </div>
                
                <select 
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as SortOption)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
        
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          
          // Empty State
          <div className="py-20 text-center text-gray-500">
            <p>No products found.</p>
            <button onClick={() => setActiveFilter("all")} className="text-black underline mt-2 font-medium">Clear Filters</button>
          </div>

        ) : (
          
          // Product Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.map((item) => (
              <div key={item.id} className="group relative flex flex-col">
                
                {/* Image Card */}
                {/* 🔴 FIXED: Changed item.id to item.slug */}
                <Link href={`/product/${item.slug}`} className="block relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-3">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  
                  {/* Floating Add Button */}
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    disabled={loadingId === item.id}
                    className={`absolute bottom-3 right-3 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 z-10 
                      ${addedId === item.id 
                        ? "bg-green-500 text-white scale-110" 
                        : "bg-white text-black hover:bg-black hover:text-white"
                      }
                    `}
                  >
                    {loadingId === item.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : addedId === item.id ? (
                      <HiCheck className="text-lg" />
                    ) : (
                      <HiOutlineShoppingBag className="text-lg" />
                    )}
                  </button>
                </Link>

                {/* Info */}
                <div>
                  {/* 🔴 FIXED: Changed item.id to item.slug */}
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductsList;