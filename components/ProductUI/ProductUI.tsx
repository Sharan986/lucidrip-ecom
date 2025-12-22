"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore"; 
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { 
  HiOutlineMinus, 
  HiCheck, 
  HiOutlineHeart,
  HiHeart,
  HiOutlineTruck,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiChevronDown,
  HiArrowLeft,
  HiArrowRight
} from "react-icons/hi2";
import { GoPlus } from "react-icons/go";


export interface Product {
  _id: string;       
  name: string;
  slug: string;
  price: number;
  image: string;    
  description: string;
  sizes: string[];
  colors: string[];
  stock: number;    
  category?: string;
}

export default function ProductUI({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  
  // --- HOOKS ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist, items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { token } = useAuthStore();
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token, fetchWishlist]);

  // --- DATA LOGIC ---
  const galleryImages = [product.image, product.image, product.image, product.image];
  const isStocked = product.stock > 0; 

  // --- URL STATE ---
  const defaultSize = product.sizes?.length > 0 ? product.sizes[0] : "M";
  const defaultColor = product.colors?.length > 0 ? product.colors[0] : "Black";

  const selectedSize = searchParams.get("size") || defaultSize;
  const selectedColor = searchParams.get("color") || defaultColor;

  // --- LOCAL STATE ---
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [isAdding, setIsAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  // --- HANDLERS ---
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = () => {
    if (!isStocked) return;
    setIsAdding(true);

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      img: product.image,
    });

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setQuantity(1);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 600);
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      router.push(`/login?redirect=/product/${product.slug}`);
      return;
    }

    setWishlistLoading(true);

    if (isWishlisted) {
      const wishlistItem = wishlistItems.find(w => w.productId === product._id);
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem._id);
      }
    } else {
      await addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        img: product.image,
        slug: product.slug,
      });
    }

    setWishlistLoading(false);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const getColorCode = (name: string) => {
    const map: Record<string, string> = {
      black: "#171717", white: "#ffffff", cream: "#f5f5dc", 
      beige: "#d1cba8", grey: "#808080", navy: "#0f172a", 
      olive: "#556b2f", red: "#b91c1c", charcoal: "#36454F",
      taupe: "#483C32", mustard: "#FFDB58", burgundy: "#800020",
      "forest green": "#228B22", "slate blue": "#6A5ACD",
      "army green": "#4B5320", pink: "#FFC0CB", mint: "#98FF98",
      brown: "#A52A2A", "neon green": "#39FF14", "washed black": "#1F1F1F",
      "faded blue": "#778899", sage: "#9DC183", oatmeal: "#E0DCC8"
    };
    if (name.includes("/")) {
      return `linear-gradient(to bottom right, ${map[name.split("/")[0].toLowerCase()] || 'gray'}, ${map[name.split("/")[1].toLowerCase()] || 'white'})`;
    }
    return map[name.toLowerCase()] || "#cccccc";
  };

  const accordionItems = [
    { 
      id: "details", 
      title: "Product Details", 
      content: product.description 
    },
    { 
      id: "shipping", 
      title: "Shipping & Returns", 
      content: "Free standard shipping on orders over ₹2,500. Express delivery available. Easy 14-day returns on all unworn items." 
    },
    { 
      id: "care", 
      title: "Care Instructions", 
      content: "Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed." 
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="bg-black text-white px-8 py-4 flex items-center gap-4 shadow-2xl">
              <span className="w-5 h-5 bg-emerald-500 flex items-center justify-center">
                <HiCheck className="text-white text-xs" />
              </span>
              <span className="text-sm tracking-wide">Added to Bag</span>
              <Link href="/cart" className="text-xs tracking-[0.1em] uppercase underline underline-offset-4 ml-4">
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BREADCRUMBS */}
      <div className="border-b border-neutral-100">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-xs tracking-[0.1em] text-neutral-400">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </div>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          
          {/* LEFT: GALLERY */}
          <div className="w-full lg:w-[60%] lg:border-r border-neutral-100">
            
            {/* Desktop Gallery */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2">
                {galleryImages.map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative aspect-[3/4] border-b border-r border-neutral-100 overflow-hidden group"
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} view ${i + 1}`} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      priority={i === 0} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Gallery */}
            <div className="lg:hidden relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={galleryImages[activeImage]} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                      priority 
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <HiArrowLeft className="text-sm" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <HiArrowRight className="text-sm" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2 h-2 transition-all ${activeImage === i ? 'bg-black w-6' : 'bg-black/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="w-full lg:w-[40%]">
            <div className="lg:sticky lg:top-0 p-6 md:p-12 lg:p-16">
              
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-3">
                  {product.category || "Essentials"}
                </p>
                <h1 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4">
                  {product.name.split(' ').slice(0, -1).join(' ')} <span className="italic">{product.name.split(' ').slice(-1)}</span>
                </h1>
                <p className="text-xl font-medium">₹{product.price.toLocaleString()}</p>
              </motion.div>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-neutral-600 text-sm leading-relaxed mb-8 pb-8 border-b border-neutral-100"
              >
                {product.description}
              </motion.p>

              {/* Selectors */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8 mb-8"
              >
                {/* Color */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">Color</span>
                      <span className="text-xs tracking-wide text-neutral-900">{selectedColor}</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((color) => {
                        const bg = getColorCode(color);
                        return (
                          <button 
                            key={color} 
                            onClick={() => updateURL("color", color)} 
                            className={`w-10 h-10 flex items-center justify-center transition-all
                              ${selectedColor === color ? 'ring-1 ring-black ring-offset-2' : 'hover:ring-1 hover:ring-neutral-300 hover:ring-offset-2'}
                            `}
                          >
                            <div 
                              className="w-full h-full border border-neutral-200" 
                              style={{ background: bg }} 
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">Size</span>
                      <button className="text-xs tracking-wide underline underline-offset-4 text-neutral-500 hover:text-black transition-colors">
                        Size Guide
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button 
                          key={size} 
                          onClick={() => updateURL("size", size)} 
                          className={`py-3 text-xs tracking-[0.1em] uppercase border transition-all
                            ${selectedSize === size 
                              ? 'border-black bg-black text-white' 
                              : 'border-neutral-200 hover:border-black'
                            }
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4 block">Quantity</span>
                  <div className="flex items-center border border-neutral-200 w-32">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="flex-1 py-3 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      <HiOutlineMinus className="text-sm" />
                    </button>
                    <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="flex-1 py-3 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      <GoPlus className="text-sm" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden lg:flex gap-3 mb-8"
              >
                <button 
                  onClick={handleAddToCart} 
                  disabled={isAdding || !isStocked} 
                  className={`flex-1 py-4 text-xs tracking-[0.2em] uppercase transition-all
                    ${isStocked 
                      ? 'bg-black text-white hover:bg-neutral-800' 
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border border-current border-t-transparent animate-spin" />
                      Adding...
                    </span>
                  ) : isStocked ? "Add to Bag" : "Sold Out"}
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-14 flex items-center justify-center border transition-all
                    ${isWishlisted 
                      ? 'bg-black border-black text-white' 
                      : 'border-neutral-200 hover:border-black'
                    }
                  `}
                >
                  {wishlistLoading ? (
                    <div className="w-5 h-5 border border-current border-t-transparent animate-spin" />
                  ) : isWishlisted ? (
                    <HiHeart className="text-lg" />
                  ) : (
                    <HiOutlineHeart className="text-lg" />
                  )}
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 py-8 border-y border-neutral-100 mb-8"
              >
                <div className="text-center">
                  <HiOutlineTruck className="text-xl mx-auto mb-2 text-neutral-400" />
                  <p className="text-[10px] tracking-[0.1em] uppercase text-neutral-500">Free Shipping</p>
                </div>
                <div className="text-center">
                  <HiOutlineArrowPath className="text-xl mx-auto mb-2 text-neutral-400" />
                  <p className="text-[10px] tracking-[0.1em] uppercase text-neutral-500">Easy Returns</p>
                </div>
                <div className="text-center">
                  <HiOutlineShieldCheck className="text-xl mx-auto mb-2 text-neutral-400" />
                  <p className="text-[10px] tracking-[0.1em] uppercase text-neutral-500">Secure Payment</p>
                </div>
              </motion.div>

              {/* Accordions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {accordionItems.map((item) => (
                  <div key={item.id} className="border-b border-neutral-100">
                    <button 
                      onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)} 
                      className="flex justify-between items-center w-full py-5 text-left"
                    >
                      <span className="text-xs tracking-[0.15em] uppercase">{item.title}</span>
                      <HiChevronDown className={`text-sm transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-neutral-500 leading-relaxed pb-5">
                            {item.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
      <div className="border-t border-neutral-100">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 md:py-24">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-3">Complete the Look</p>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">
                You May Also <span className="italic">Like</span>
              </h2>
            </div>
            <Link 
              href="/products" 
              className="hidden md:block text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 4).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/product/${item.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <h3 className="text-sm tracking-wide group-hover:underline underline-offset-4 decoration-neutral-300">
                    {item.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">₹{item.price.toLocaleString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-4 lg:hidden z-50 flex gap-3 safe-area-pb">
        <button 
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`w-14 h-14 flex items-center justify-center border transition-all
            ${isWishlisted 
              ? 'bg-black border-black text-white' 
              : 'border-neutral-200'
            }
          `}
        >
          {wishlistLoading ? (
            <div className="w-5 h-5 border border-current border-t-transparent animate-spin" />
          ) : isWishlisted ? (
            <HiHeart className="text-xl" />
          ) : (
            <HiOutlineHeart className="text-xl" />
          )}
        </button>
        <button 
          onClick={handleAddToCart} 
          disabled={isAdding || !isStocked} 
          className={`flex-1 h-14 text-xs tracking-[0.2em] uppercase transition-all
            ${isStocked 
              ? 'bg-black text-white' 
              : 'bg-neutral-100 text-neutral-400'
            }
          `}
        >
          {isAdding ? "Adding..." : isStocked ? `Add to Bag — ₹${(product.price * quantity).toLocaleString()}` : "Sold Out"}
        </button>
      </div>

    </div>
  );
}
