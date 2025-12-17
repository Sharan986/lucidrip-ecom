"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore"; 
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { featuredItems } from "@/data/products"; // ✅ Import your real data

// Icons
import { 
  HiOutlineMinus, 
  HiOutlinePlus, 
  HiCheck, 
  HiOutlineHeart,
  HiHeart,
  HiOutlineShare,
  HiStar,
  HiOutlineShieldCheck
} from "react-icons/hi2";
import { GoPlus } from "react-icons/go";

// --- TYPES ---
// This matches your FeatureItem type structure
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  img: string; 
  images?: string[]; 
  description: string;
  sizes: string[];
  colors: string[];
  inStock?: boolean; 
  rating?: number;
  reviews?: number;
}

export default function ProductUI({ product }: { product: Product }) {
  // --- HOOKS ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  // --- DATA LOGIC ---
  // 1. Gallery: Use provided images or fallback to main image x4
  const galleryImages = product.images && product.images.length > 0
    ? product.images 
    : [product.img, product.img, product.img, product.img];
    
  // 2. Stock: Default to true if not specified
  const isStocked = product.inStock ?? true; 

  // 3. Related Products: Get 4 items from your data, excluding current one
  const relatedProducts = featuredItems
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  // --- URL STATE ---
  const selectedSize = searchParams.get("size") || product.sizes[0];
  const selectedColor = searchParams.get("color") || product.colors[0];

  // --- LOCAL STATE ---
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      img: product.img,
    });

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setQuantity(1);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 600);
  };

  // Helper to get hex codes for colors
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
    // Handle split colors like "Navy/White" for gradients
    if (name.includes("/")) {
      return `linear-gradient(to bottom right, ${map[name.split("/")[0].toLowerCase()] || 'gray'}, ${map[name.split("/")[1].toLowerCase()] || 'white'})`;
    }
    return map[name.toLowerCase()] || "#cccccc";
  };

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-0 font-sans text-black">
      
      {/* SUCCESS TOAST */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${showSuccess ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
           <span className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center"><HiCheck className="text-white text-xs" /></span>
           <span className="text-sm font-bold">Added to Bag</span>
           <Link href="/cart" className="text-xs font-bold underline ml-2">View Cart</Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumbs */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-black">Home</Link> / <Link href="/products" className="hover:text-black">Shop</Link> / <span className="text-black">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
          
          {/* LEFT: GALLERY */}
          <div className="w-full lg:w-[60%]">
             <div className="hidden lg:grid grid-cols-2 gap-4">
               {galleryImages.map((img, i) => (
                 <div key={i} className={`relative bg-gray-50 rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'col-span-1 aspect-[3/4]'}`}>
                    <Image src={img} alt="Product" fill className="object-cover hover:scale-105 transition-transform duration-700" priority={i === 0} />
                 </div>
               ))}
            </div>
            {/* Mobile Slider */}
            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="snap-center flex-shrink-0 w-full relative aspect-[3/4] bg-gray-50">
                   <Image src={img} alt="Product" fill className="object-cover" priority={i === 0} />
                </div>
              ))}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Swipe</div>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-full lg:w-[40%] relative">
            <div className="lg:sticky lg:top-24">
              
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-start mb-2">
                   <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 leading-none">{product.name}</h1>
                   <button onClick={() => setIsWishlisted(!isWishlisted)}>
                      {isWishlisted ? <HiHeart className="text-2xl text-red-500" /> : <HiOutlineHeart className="text-2xl text-gray-400" />}
                   </button>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">₹{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Selectors */}
              <div className="space-y-6 mb-8">
                {/* Color */}
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 block">Color: <span className="text-gray-500">{selectedColor}</span></span>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => {
                      const bg = getColorCode(color);
                      return (
                        <button key={color} onClick={() => updateURL("color", color)} className={`w-10 h-10 rounded-full flex items-center justify-center border ${selectedColor === color ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}>
                          <div className="w-8 h-8 rounded-full border border-gray-100" style={{ background: bg }} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Size: {selectedSize}</span>
                    <button className="text-xs underline text-gray-500">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button key={size} onClick={() => updateURL("size", size)} className={`py-3 rounded-lg text-sm font-bold border ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex gap-4">
                 <div className="flex items-center border border-gray-300 rounded-full px-4 w-32 justify-between">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-500"><HiOutlineMinus /></button>
                    <span className="font-bold text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-500"><GoPlus /></button>
                 </div>
                 <button onClick={handleAddToCart} disabled={isAdding || !isStocked} className={`flex-1 py-4 rounded-full font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all ${isStocked ? 'bg-black text-white hover:bg-zinc-800' : 'bg-gray-200 text-gray-400'}`}>
                   {isAdding ? "Adding..." : isStocked ? "Add to Cart" : "Sold Out"}
                 </button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <HiOutlineShieldCheck className="text-lg" /> Secure Checkout
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <HiOutlineShare className="text-lg" /> Free Shipping
                 </div>
              </div>

              {/* Accordions */}
              <div className="mt-8 border-t border-gray-100">
                {[{ id: "details", title: "Details", content: product.description }, { id: "shipping", title: "Shipping", content: "Free shipping over ₹2500." }].map((item) => (
                  <div key={item.id} className="border-b border-gray-100 py-4">
                     <button onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)} className="flex justify-between w-full font-bold text-xs uppercase tracking-widest">
                       {item.title} <GoPlus className={`text-lg transition ${activeAccordion === item.id ? 'rotate-45' : ''}`} />
                     </button>
                     <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === item.id ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-sm text-gray-500">{item.content}</p>
                     </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* =================================================
            RECOMMENDED PRODUCTS SECTION (From your Data)
        ================================================= */}
        <div className="border-t border-gray-100 pt-16">
           <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">You May Also Like</h2>
              <Link href="/products" className="text-sm font-bold underline underline-offset-4 hidden md:block">View All</Link>
           </div>
           
           {/* Recommendation Grid */}
           <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {relatedProducts.map((item) => (
                 <Link href={`/product/${item.slug}`} key={item.id} className="snap-start flex-shrink-0 w-[260px] md:w-auto group cursor-pointer block">
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4">
                       <Image 
                         src={item.img} 
                         alt={item.name} 
                         fill 
                         className="object-cover transition-transform duration-700 group-hover:scale-105" 
                       />
                       {/* Quick View Button on Hover */}
                       <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                          <button className="w-full bg-white text-black font-bold uppercase text-xs py-3 rounded-full shadow-md hover:bg-black hover:text-white">
                            View Product
                          </button>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 group-hover:underline decoration-1 underline-offset-4 line-clamp-1">{item.name}</h3>
                       <p className="text-sm text-gray-500 mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                 </Link>
              ))}
           </div>
        </div>

      </div>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 lg:hidden z-50 flex gap-3 shadow-lg pb-6">
         <div className="flex items-center border border-gray-200 rounded-full px-4 h-14 w-32 justify-between bg-white">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl text-gray-400">-</button>
            <span className="font-bold text-base">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-xl text-black">+</button>
         </div>
         <button onClick={handleAddToCart} disabled={isAdding || !isStocked} className={`flex-1 h-14 font-bold uppercase tracking-widest text-sm rounded-full shadow-xl ${isStocked ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
           {isAdding ? "Adding..." : "Add to Cart"}
         </button>
      </div>

    </div>
  );
}