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
  HiAdjustmentsHorizontal,
  HiOutlineHeart,
  HiHeart,
  HiSquares2X2,
  HiListBullet,
  HiOutlineFunnel
} from "react-icons/hi2";

// --- TYPES ---
type SortOption = "newest" | "price-low" | "price-high";
type FilterOption = "all" | "hoodies" | "tees" | "pants" | "accessories";
type ViewMode = "grid" | "list";

// --- COMPONENT: PRODUCT CARD (Optimized) ---
const ProductCard = ({ item, viewMode }: { item: any, viewMode: ViewMode }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    // Add default variant
    addItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: "M", // Default
      color: "Black", // Default
      img: item.img,
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div 
      className={`group relative flex ${viewMode === 'list' ? 'flex-row gap-6 border-b border-gray-100 py-6' : 'flex-col'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- IMAGE SECTION --- */}
      <Link 
        href={`/product/${item.slug}`} 
        className={`relative block overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'w-1/3 max-w-[200px] aspect-[3/4]' : 'w-full aspect-[3/4]'}`}
      >
        <Image
          src={item.img}
          alt={item.name}
          fill
          className={`object-cover object-center transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={toggleWishlist}
             className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition text-black"
           >
             {isWishlisted ? <HiHeart className="text-red-500 text-lg" /> : <HiOutlineHeart className="text-lg" />}
           </button>
        </div>

        {/* Quick Add Button (Floating) */}
        <button
          onClick={handleQuickAdd}
          disabled={isLoading || isAdded}
          className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
            ${isAdded ? "bg-green-500 text-white" : "bg-white text-black hover:bg-black hover:text-white"}
          `}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isAdded ? (
            <HiCheck className="text-lg" />
          ) : (
            <HiOutlineShoppingBag className="text-lg" />
          )}
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {item.price > 10000 && (
             <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">Premium</span>
          )}
          {item.id % 3 === 0 && (
             <span className="bg-white text-black text-[10px] font-bold uppercase px-2 py-1 tracking-wider shadow-sm">New</span>
          )}
        </div>
      </Link>

      {/* --- INFO SECTION --- */}
      <div className={`mt-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center items-start' : ''}`}>
        <div className="flex justify-between items-start w-full">
          <div className="flex-1">
            <Link href={`/product/${item.slug}`}>
              <h3 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-tight hover:underline decoration-1 underline-offset-4">
                {item.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1 font-medium capitalize">{item.category || "Unisex"}</p>
          </div>
          <p className="text-sm md:text-base font-bold text-gray-900">
            ₹{item.price.toLocaleString()}
          </p>
        </div>

        {/* Fake Color Swatches (Aesthetic) */}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-3 h-3 rounded-full bg-black border border-gray-200 cursor-pointer hover:scale-125 transition"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-200 cursor-pointer hover:scale-125 transition"></div>
          <div className="w-3 h-3 rounded-full bg-[#f5f5dc] border border-gray-300 cursor-pointer hover:scale-125 transition"></div>
          <span className="text-[10px] text-gray-400 ml-1">+2</span>
        </div>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
const ProductsList = () => {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(8); // Pagination simulation

  // --- INITIAL LOAD SIMULATION ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...featuredItems];

    // Filter
    if (activeFilter !== "all") {
      result = result.filter((item) => {
        const name = item.name.toLowerCase();
        if (activeFilter === "hoodies") return name.includes("hoodie") || name.includes("pullover");
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

  // Handle Load More
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HERO BANNER (Simple) --- */}
      <div className="bg-gray-50 border-b border-gray-100 py-12 md:py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black mb-4">
          All Products
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto font-medium">
          Explore our latest collection of premium streetwear, crafted for the modern minimalist.
        </p>
      </div>

      {/* --- STICKY TOOLBAR --- */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* LEFT: Filters */}
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide pb-2 md:pb-0"> 
               <div className="flex items-center gap-1 font-bold text-sm text-gray-900 border-r border-gray-200 pr-6 mr-2">
                  <HiOutlineFunnel className="text-lg" /> Filter
               </div>
               
               <div className="flex gap-4">
                {(["all", "hoodies", "tees", "pants"] as FilterOption[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`text-sm font-bold uppercase tracking-wider transition-colors relative
                      ${activeFilter === cat ? "text-black" : "text-gray-400 hover:text-black"}
                    `}
                  >
                    {cat}
                    {activeFilter === cat && (
                      <span className="absolute -bottom-5 left-0 w-full h-[2px] bg-black"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Sort & View */}
            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              
              {/* Product Count */}
              <span className="text-xs font-bold text-gray-400 hidden lg:block">
                 {filteredProducts.length} Results
              </span>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-400 hover:text-black'}`}
                >
                  <HiSquares2X2 />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-400 hover:text-black'}`}
                >
                  <HiListBullet />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer hover:text-gray-600">
                  <span className="hidden sm:inline">Sort By</span>
                  <HiChevronDown />
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
      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        
        {isLoading ? (
          // Skeleton Loading
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-sm mb-4"></div>
                <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty State
          <div className="py-32 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">Try changing your filters or checking back later.</p>
            <button 
              onClick={() => setActiveFilter("all")} 
              className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-800 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-x-4 md:gap-x-6 gap-y-12`}>
              {visibleProducts.map((item) => (
                <ProductCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-20 text-center">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Showing {visibleProducts.length} of {filteredProducts.length}
                 </p>
                 <div className="w-48 h-1 bg-gray-100 mx-auto rounded-full mb-8 overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-500" 
                      style={{ width: `${(visibleProducts.length / filteredProducts.length) * 100}%` }}
                    />
                 </div>
                 <button 
                   onClick={handleLoadMore}
                   className="border border-black text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all uppercase tracking-wide"
                 >
                   Load More Products
                 </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProductsList;