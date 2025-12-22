"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineShoppingBag, HiCheck, HiArrowRight } from "react-icons/hi2";
import { useCartStore } from "@/store/useCartStore"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
  category?: string;
}

// --- 1. DEFINE COMPONENT OUTSIDE (Fixes the Error) ---
interface QuickAddProps {
  item: Product;
  customClass?: string;
  loadingId: string | null;
  addedId: string | null;
  onAdd: (e: React.MouseEvent, item: Product) => void;
}

const QuickAddButton = ({ item, customClass, loadingId, addedId, onAdd }: QuickAddProps) => (
  <button
    onClick={(e) => onAdd(e, item)}
    className={`flex items-center justify-center rounded-full shadow-xl transition-all duration-300 z-20 
      ${addedId === item._id 
        ? "bg-green-500 text-white scale-110" 
        : "bg-white text-black hover:bg-black hover:text-white hover:scale-110"
      }
      ${customClass}
    `}
    title="Add to Cart"
  >
      {loadingId === item._id ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : addedId === item._id ? (
        <HiCheck className="text-xl" />
      ) : (
        <HiOutlineShoppingBag className="text-xl" />
      )}
  </button>
);

// --- MAIN COMPONENT ---
const FeaturedProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const heroProduct = products[0];
  const gridProducts = products.slice(1, 5);

  // --- CART LOGIC ---
  const addItem = useCartStore((state) => state.addItem);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, item: Product) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    setLoadingId(item._id);

    addItem({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: item.sizes?.[0] || "Medium", 
      color: item.colors?.[0] || "Standard",
      img: item.image,
    });

    setTimeout(() => {
      setLoadingId(null);
      setAddedId(item._id);
      setTimeout(() => setAddedId(null), 2000);
    }, 500);
  };

  if (isLoading || !heroProduct) {
    return (
      <section className="py-16 max-w-8xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${i === 0 ? "col-span-2 lg:col-span-1 aspect-[4/5]" : "aspect-square"} bg-gray-200 animate-pulse rounded-xl`} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-8xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
           <h2 className="text-3xl md:text-5xl font-medium text-gray-900 ">
             New Arrivals
           </h2>
           <p>Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>
        </div>
        <Link href="/products" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:underline">
           View all products <HiArrowRight />
        </Link>
      </div>

      {/* --- LAYOUT CONTAINER --- */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 h-auto lg:h-[600px]">
        
        {/* === 1. HERO PRODUCT === */}
        <div className="relative group w-full aspect-[4/5] lg:aspect-auto lg:h-full overflow-hidden rounded-xl bg-gray-100">
           <Link href={`/product/${heroProduct.slug}`} className="block h-full w-full">
             <Image
               src={heroProduct.image}
               alt={heroProduct.name}
               fill
               className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
               priority 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                  Best Seller
                </span>
                <h3 className="text-2xl md:text-3xl text-white font-bold mb-2">{heroProduct.name}</h3>
                <p className="text-gray-200 text-lg font-medium">Rs. {heroProduct.price.toLocaleString()}</p>
             </div>
           </Link>
           
           {/* Passed props explicitly here */}
           <QuickAddButton 
             item={heroProduct} 
             loadingId={loadingId}
             addedId={addedId}
             onAdd={handleQuickAdd}
             customClass="absolute bottom-6 right-6 w-12 h-12 md:bottom-8 md:right-8 md:w-14 md:h-14 text-2xl" 
           />
        </div>

        {/* === 2. GRID PRODUCTS === */}
        <div className="grid grid-cols-2 gap-4 h-auto lg:h-full">
          {gridProducts.map((item) => (
            <div key={item._id} className="group relative flex flex-col aspect-square lg:aspect-auto lg:h-full bg-gray-50 rounded-xl overflow-hidden">
              
              <Link href={`/product/${item.slug}`} className="relative block flex-1 overflow-hidden h-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                {/* Passed props explicitly here */}
                <QuickAddButton 
                  item={item} 
                  loadingId={loadingId}
                  addedId={addedId}
                  onAdd={handleQuickAdd}
                  customClass="absolute bottom-3 right-3 w-10 h-10 lg:translate-y-14 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100" 
                />
              </Link>

              <div className="p-3 md:p-4 bg-white/90 backdrop-blur-sm absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 lg:static lg:translate-y-0 lg:bg-transparent">
                 <Link href={`/product/${item.slug}`}>
                   <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                 </Link>
                 <p className="text-xs text-gray-500 font-medium">Rs. {item.price.toLocaleString()}</p>
              </div>

            </div>
          ))}
        </div>

      </div>

      <div className="mt-10 text-center md:hidden">
         <Link 
           href="/products" 
           className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-full font-medium hover:border-black hover:bg-black hover:text-white transition-all w-full"
         >
            View All Products <HiArrowRight />
         </Link>
      </div>

    </section>
  );
};

export default FeaturedProductsSection;