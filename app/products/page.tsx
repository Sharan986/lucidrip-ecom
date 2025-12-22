"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  HiOutlineShoppingBag, 
  HiCheck, 
  HiChevronDown, 
  HiOutlineHeart,
  HiHeart,
  HiXMark,
  HiAdjustmentsHorizontal
} from "react-icons/hi2";

// --- INTERFACE FOR BACKEND DATA ---
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;    
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

type SortOption = "newest" | "price-low" | "price-high";
type FilterOption = "all" | "hoodies" | "tees" | "pants" | "accessories";

// --- MODERN PRODUCT CARD COMPONENT ---
const ProductCard = ({ item, index }: { item: Product; index: number }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = isInWishlist(item._id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    addItem({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: item.sizes?.[0] || "M", 
      color: item.colors?.[0] || "Black",
      img: item.image,
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 500);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(item._id);
      } else {
        await addToWishlist({
          productId: item._id,
          name: item.name,
          price: item.price,
          img: item.image,
          slug: item.slug,
        });
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group"
    >
      {/* Image Container */}
      <Link href={`/product/${item.slug}`} className="block relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Cinematic Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          
          {/* Top Actions */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
            {/* Badge */}
            {index % 4 === 0 && (
              <span className="text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 font-medium">
                New
              </span>
            )}
            
            {/* Wishlist Button */}
            <button 
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className={`ml-auto w-10 h-10 flex items-center justify-center border transition-all duration-300
                ${isWishlisted 
                  ? "bg-black border-black text-white" 
                  : "bg-white/90 border-transparent hover:border-black"
                }
                opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
              `}
            >
              {wishlistLoading ? (
                <div className="w-4 h-4 border border-current border-t-transparent animate-spin" />
              ) : isWishlisted ? (
                <HiHeart className="text-base" />
              ) : (
                <HiOutlineHeart className="text-base" />
              )}
            </button>
          </div>
          
          {/* Bottom Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button
              onClick={handleQuickAdd}
              disabled={isLoading || isAdded}
              className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300
                ${isAdded 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white hover:bg-black hover:text-white"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border border-current border-t-transparent animate-spin" />
                  Adding...
                </span>
              ) : isAdded ? (
                <span className="flex items-center justify-center gap-2">
                  <HiCheck className="text-sm" />
                  Added to Bag
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <HiOutlineShoppingBag className="text-sm" />
                  Quick Add
                </span>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <Link href={`/product/${item.slug}`}>
          <h3 className="text-sm tracking-wide text-neutral-900 group-hover:underline underline-offset-4 decoration-neutral-300">
            {item.name}
          </h3>
        </Link>
        <p className="text-xs text-neutral-500 tracking-wide uppercase">
          {item.category || "Essentials"}
        </p>
        <p className="text-sm text-neutral-900 font-medium pt-1">
          ₹{item.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};


// --- MAIN PAGE COMPONENT ---
const ProductsList = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const { fetchWishlist } = useWishlistStore();
  const { token } = useAuthStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Backend Error:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchProducts();
    
    if (token) {
      fetchWishlist();
    }
  }, [token, fetchWishlist, API_URL]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeFilter !== "all") {
      result = result.filter((item) => {
        const name = item.name.toLowerCase();
        const cat = item.category?.toLowerCase() || "";
        
        if (activeFilter === "hoodies") return name.includes("hoodie") || name.includes("pullover") || cat.includes("hoodies");
        if (activeFilter === "tees") return name.includes("tee") || name.includes("top") || cat.includes("tops");
        if (activeFilter === "pants") return name.includes("pant") || name.includes("sweat");
        return true;
      });
    }

    if (activeSort === "price-low") result.sort((a, b) => a.price - b.price);
    if (activeSort === "price-high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, activeFilter, activeSort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 8);

  const filterOptions: { key: FilterOption; label: string }[] = [
    { key: "all", label: "All Products" },
    { key: "hoodies", label: "Hoodies & Sweaters" },
    { key: "tees", label: "T-Shirts & Tops" },
    { key: "pants", label: "Pants & Bottoms" },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "newest", label: "Newest Arrivals" },
    { key: "price-low", label: "Price: Low to High" },
    { key: "price-high", label: "Price: High to Low" },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION --- */}
      <div ref={heroRef} className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <Image
            src="/Hero/Coll2.avif"
            alt="Products Collection"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs tracking-[0.3em] uppercase mb-4"
          >
            The Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight"
          >
            All <span className="italic font-light">Products</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-sm md:text-base font-light tracking-wide max-w-md opacity-80"
          >
            Explore our curated selection of premium essentials crafted for the modern minimalist
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-white/30 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white"
            />
          </div>
        </motion.div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between px-6 md:px-12 py-4">
            
            {/* Left: Filter Toggle & Active Filter */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm tracking-wide hover:opacity-60 transition-opacity"
              >
                <HiAdjustmentsHorizontal className="text-lg" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
              
              <span className="text-sm text-neutral-500">
                {filteredProducts.length} products
              </span>
            </div>

            {/* Center: Category Pills (Desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300
                    ${activeFilter === option.key 
                      ? "bg-black text-white" 
                      : "text-neutral-600 hover:bg-neutral-100"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Right: Sort */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm tracking-wide hover:opacity-60 transition-opacity">
                <span>Sort</span>
                <HiChevronDown className="text-sm transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white border border-neutral-200 shadow-lg min-w-[200px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setActiveSort(option.key)}
                      className={`w-full px-4 py-3 text-left text-sm tracking-wide transition-colors
                        ${activeSort === option.key 
                          ? "bg-neutral-100" 
                          : "hover:bg-neutral-50"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FILTER PANEL (Slide Down) --- */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-neutral-50 border-b border-neutral-200"
          >
            <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-8">
              <div className="flex flex-wrap gap-12">
                
                {/* Categories */}
                <div>
                  <h4 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">Category</h4>
                  <div className="flex flex-col gap-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setActiveFilter(option.key)}
                        className={`text-left text-sm tracking-wide transition-colors
                          ${activeFilter === option.key 
                            ? "text-black font-medium" 
                            : "text-neutral-500 hover:text-black"
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">Sort By</h4>
                  <div className="flex flex-col gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setActiveSort(option.key)}
                        className={`text-left text-sm tracking-wide transition-colors
                          ${activeSort === option.key 
                            ? "text-black font-medium" 
                            : "text-neutral-500 hover:text-black"
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              {activeFilter !== "all" && (
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs tracking-[0.15em] uppercase text-neutral-500">Active:</span>
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs tracking-wide"
                    >
                      {filterOptions.find(f => f.key === activeFilter)?.label}
                      <HiXMark className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PRODUCTS GRID --- */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {isLoading ? (
          // Modern Skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-neutral-100 w-3/4" />
                  <div className="h-3 bg-neutral-100 w-1/2" />
                  <div className="h-4 bg-neutral-100 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty State
          <div className="py-32 text-center">
            <p className="text-sm tracking-[0.2em] uppercase text-neutral-400 mb-4">No Results</p>
            <h2 className="text-3xl md:text-4xl font-extralight mb-6">
              No products <span className="italic">found</span>
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Try adjusting your filters or browse our full collection.
            </p>
            <button 
              onClick={() => setActiveFilter("all")} 
              className="px-8 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
              {visibleProducts.map((item, index) => (
                <ProductCard 
                  key={item._id}
                  item={item} 
                  index={index} 
                />
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-20 md:mt-32 text-center"
              >
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-6">
                  Showing {visibleProducts.length} of {filteredProducts.length}
                </p>
                
                {/* Progress Bar */}
                <div className="w-32 h-px bg-neutral-200 mx-auto mb-8 overflow-hidden">
                  <motion.div 
                    className="h-full bg-black origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: visibleProducts.length / filteredProducts.length }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                
                <button 
                  onClick={handleLoadMore}
                  className="group relative px-12 py-4 border border-black text-xs tracking-[0.2em] uppercase overflow-hidden"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    Load More
                  </span>
                  <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* --- BOTTOM BANNER --- */}
      <div className="border-t border-neutral-200">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4">Need Help?</p>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6">
                Personal <span className="italic">styling</span> assistance
              </h2>
              <p className="text-neutral-500 mb-8 max-w-md">
                Our style advisors are here to help you find the perfect pieces for your wardrobe.
              </p>
              <Link 
                href="/contact"
                className="inline-block px-8 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-2">
                {["/Hero/Product1.avif", "/Hero/Product2.avif", "/Hero/Product3.avif"].map((src, i) => (
                  <div key={i} className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={src}
                      alt={`Style ${i + 1}`}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
