"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  HiArrowLeft, 
  HiOutlineCloudArrowUp, 
  HiXMark,
  HiOutlineCurrencyRupee,
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineListBullet,
  HiOutlineLink
} from "react-icons/hi2";

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Pricing State for Margin Calc
  const [price, setPrice] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);

  const profit = price - cost;
  const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : 0;

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 font-sans text-zinc-900">
      
      {/* --- HEADER (Sticky Actions) --- */}
      <div className="sticky top-0 z-30 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-200 mb-8">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/products" className="p-2 hover:bg-zinc-200 rounded-full transition text-zinc-500 hover:text-black">
                <HiArrowLeft className="text-lg" />
              </Link>
              <h1 className="text-xl font-bold tracking-tight">Add Product</h1>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-lg transition">
                 Discard
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isLoading}
                 className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition shadow-lg disabled:opacity-70 flex items-center gap-2"
               >
                 {isLoading ? <span className="animate-pulse">Saving...</span> : "Save Product"}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN FORM GRID --- */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ====================
            LEFT COLUMN (Main)
        ==================== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Title & Description */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold uppercase text-zinc-500 mb-2 tracking-wider">Title</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Oversized Heavyweight T-Shirt" 
                     className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-zinc-300"
                   />
                </div>
                
                {/* Rich Text Editor Mock */}
                <div>
                   <label className="block text-xs font-bold uppercase text-zinc-500 mb-2 tracking-wider">Description</label>
                   <div className="border border-zinc-200 rounded-lg overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition">
                      <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-2 flex gap-2">
                         <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><HiOutlineBold /></button>
                         <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><HiOutlineItalic /></button>
                         <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><HiOutlineListBullet /></button>
                         <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><HiOutlineLink /></button>
                      </div>
                      <textarea 
                        rows={8}
                        className="w-full px-4 py-3 text-sm font-medium focus:outline-none resize-none"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* 2. Media */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
             <label className="block text-xs font-bold uppercase text-zinc-500 mb-4 tracking-wider">Media</label>
             
             {/* Upload Area */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-zinc-200 rounded-xl h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 hover:border-zinc-400 transition-all group"
             >
                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                <div className="flex items-center gap-2 text-zinc-500 group-hover:text-black transition">
                   <HiOutlineCloudArrowUp className="text-xl" />
                   <span className="text-sm font-bold underline decoration-zinc-300 underline-offset-4">Click to upload</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 font-mono">ACCEPTING: PNG, JPG, GIF</p>
             </div>

             {/* Image Grid */}
             {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                   {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square border border-zinc-200 rounded-lg overflow-hidden group bg-zinc-50">
                         <img src={img} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => removeImage(idx)}
                              className="bg-white p-2 rounded-full text-red-600 hover:scale-110 transition"
                            >
                               <HiXMark />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* 3. Pricing & Profit */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
             <label className="block text-xs font-bold uppercase text-zinc-500 mb-6 tracking-wider">Pricing</label>
             
             <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Price</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-7 pr-4 py-2 border border-zinc-200 rounded-lg text-sm font-mono font-medium focus:outline-none focus:border-black" 
                      />
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Compare-at price</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                      <input type="number" placeholder="0.00" className="w-full pl-7 pr-4 py-2 border border-zinc-200 rounded-lg text-sm font-mono font-medium focus:outline-none focus:border-black" />
                   </div>
                </div>
             </div>

             <div className="flex gap-6 pt-6 border-t border-zinc-100">
                <div className="flex-1">
                   <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Cost per item</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        onChange={(e) => setCost(Number(e.target.value))}
                        className="w-full pl-7 pr-4 py-2 border border-zinc-200 rounded-lg text-sm font-mono font-medium focus:outline-none focus:border-black" 
                      />
                   </div>
                   <p className="text-[10px] text-zinc-400 mt-1">Customers won't see this</p>
                </div>
                <div className="flex-1 flex gap-4 items-center">
                   <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Margin</p>
                      <p className="text-sm font-mono font-medium text-zinc-900">{isNaN(Number(margin)) ? 0 : margin}%</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Profit</p>
                      <p className="text-sm font-mono font-medium text-zinc-900">₹{profit.toLocaleString()}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* 4. Inventory */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
             <label className="block text-xs font-bold uppercase text-zinc-500 mb-6 tracking-wider">Inventory</label>
             
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 mb-1 block">SKU (Stock Keeping Unit)</label>
                   <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:border-black" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Barcode (ISBN, UPC, GTIN, etc.)</label>
                   <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:border-black" />
                </div>
             </div>

             <div className="mt-6 flex items-center gap-3">
               <input type="checkbox" id="track" className="w-4 h-4 accent-black" defaultChecked />
               <label htmlFor="track" className="text-sm font-medium text-zinc-700">Track quantity</label>
             </div>
             
             <div className="mt-4 border-t border-zinc-100 pt-4">
               <div className="flex items-center gap-3 mb-4">
                 <input type="checkbox" id="continue" className="w-4 h-4 accent-black" />
                 <label htmlFor="continue" className="text-sm font-medium text-zinc-700">Continue selling when out of stock</label>
               </div>
               
               <div className="w-1/2">
                  <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Quantity</label>
                  <input type="number" defaultValue={0} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:border-black" />
               </div>
             </div>
          </div>

          {/* 5. SEO Preview */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <label className="block text-xs font-bold uppercase text-zinc-500 tracking-wider">Search Engine Listing</label>
                <button className="text-xs text-blue-600 font-bold hover:underline">Edit</button>
             </div>
             <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <p className="text-xs text-zinc-500 mb-1">https://yourstore.com/products/oversized-t-shirt</p>
                <p className="text-sm font-medium text-blue-700 truncate">Oversized Heavyweight T-Shirt | Premium Streetwear</p>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                   Shop the latest oversized tees. 100% Cotton, 240GSM. Available in Black, White, and Beige. Free shipping on orders over ₹2000.
                </p>
             </div>
          </div>

        </div>

        {/* ====================
            RIGHT COLUMN (Sidebar)
        ==================== */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* 1. Status */}
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-4 tracking-wider">Status</label>
              <select className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black cursor-pointer appearance-none">
                 <option>Active</option>
                 <option>Draft</option>
                 <option>Archived</option>
              </select>
              <div className="mt-4 pt-4 border-t border-zinc-100">
                 <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Online Store</label>
                 <p className="text-xs text-zinc-400">Schedule availability</p>
              </div>
           </div>

           {/* 2. Organization */}
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
              <label className="block text-xs font-bold uppercase text-zinc-500 tracking-wider">Product Organization</label>
              
              <div>
                 <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Category</label>
                 <select className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black">
                    <option>Select...</option>
                    <option>Streetwear</option>
                    <option>Accessories</option>
                 </select>
              </div>

              <div>
                 <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Product Type</label>
                 <input type="text" placeholder="e.g. T-Shirt" className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black" />
              </div>

              <div>
                 <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Vendor</label>
                 <input type="text" placeholder="e.g. Nike" className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black" />
              </div>

              <div>
                 <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Collections</label>
                 <input type="text" placeholder="Search collections..." className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black" />
              </div>

              <div>
                 <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Tags</label>
                 <input type="text" placeholder="e.g. Summer, Cotton" className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black" />
                 <p className="text-[10px] text-zinc-400 mt-1">Press enter to add</p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}