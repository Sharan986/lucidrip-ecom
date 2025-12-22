"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiArrowLongRight, HiPlus, HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

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

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist, items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 8));
        }
      } catch (error) {
        // Silently handle fetch errors
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch wishlist on mount if user is logged in
  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token, fetchWishlist]);

  const handleQuickAdd = useCallback((e: React.MouseEvent, item: Product) => {
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
  }, [addItem]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!token) {
      router.push("/login?redirect=/products");
      return;
    }

    setWishlistLoadingId(item._id);

    const inWishlist = isInWishlist(item._id);

    if (inWishlist) {
      // Find the wishlist item to remove
      const wishlistItem = wishlistItems.find(w => w.productId === item._id);
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem._id);
      }
    } else {
      // Add to wishlist
      await addToWishlist({
        productId: item._id,
        name: item.name,
        price: item.price,
        img: item.image,
        slug: item.slug,
      });
    }

    setWishlistLoadingId(null);
  }, [token, router, isInWishlist, wishlistItems, removeFromWishlist, addToWishlist]);

  if (isLoading) {
    return (
      <section className="bg-[#fafafa] py-16">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fafafa]">
      {/* Section Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-4"
              >
                Curated Selection
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extralight text-gray-900 tracking-tight"
              >
                New <span className="italic font-normal">Arrivals</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href="/products"
                className="group inline-flex items-center gap-4 text-sm tracking-widest uppercase text-gray-900 hover:text-gray-600 transition-colors"
              >
                View All
                <span className="w-12 h-px bg-gray-900 group-hover:w-16 transition-all duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {products.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group border-b border-r border-gray-200 last:border-r-0 lg:[&:nth-child(4n)]:border-r-0"
            >
              <Link href={`/product/${item.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Wishlist Button */}
                  <motion.button
                    onClick={(e) => handleWishlistToggle(e, item)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isInWishlist(item._id)
                        ? "bg-red-500 text-white opacity-100" 
                        : "bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {wishlistLoadingId === item._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isInWishlist(item._id) ? (
                      <HiHeart className="text-lg" />
                    ) : (
                      <HiOutlineHeart className="text-lg" />
                    )}
                  </motion.button>

                  {/* Quick Add Button */}
                  <motion.button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      addedId === item._id 
                        ? "bg-green-500 text-white" 
                        : "bg-white text-black opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white"
                    }`}
                  >
                    {loadingId === item._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : addedId === item._id ? (
                      <span className="text-xs font-bold">✓</span>
                    ) : (
                      <HiPlus className="text-lg" />
                    )}
                  </motion.button>

                  {/* Badge */}
                  {index === 0 && (
                    <span className="absolute top-4 left-4 text-[10px] tracking-widest uppercase bg-black text-white px-3 py-1.5">
                      Bestseller
                    </span>
                  )}
                  {index === 1 && (
                    <span className="absolute top-4 left-4 text-[10px] tracking-widest uppercase bg-white text-black px-3 py-1.5 border border-gray-200">
                      New
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-6">
                  <h3 className="text-sm md:text-base text-gray-900 mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden px-6 py-8 text-center border-t border-gray-200">
        <Link 
          href="/products"
          className="inline-flex items-center gap-3 text-sm tracking-widest uppercase"
        >
          View All Products
          <HiArrowLongRight className="text-xl" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
