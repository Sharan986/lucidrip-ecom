"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { 
  HiCloudArrowUp, 
  HiXMark, 
  HiPlus, 
  HiTrash, 
  HiOutlineCurrencyRupee,
  HiOutlineCube,
  HiArrowLongLeft
} from "react-icons/hi2";
import Link from "next/link";

// --- TYPES ---
interface ProductFormData {
  name: string;
  price: string;
  description: string;
  slug: string;
}

export default function AddProductPage() {
  // --- STATE ---
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    slug: "",
  });

  const [sizes, setSizes] = useState<string[]>([]);
  const [currentSize, setCurrentSize] = useState<string>("");

  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>("");

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- MEMORY CLEANUP ---
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // --- HANDLERS ---
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        if (name === "name") {
          newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }
        return newData;
      });
    },
    []
  );

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.type.startsWith("image/"));
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  }, []);

  const removeImage = useCallback((indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  }, []);

  const addTag = useCallback((
    value: string, 
    currentList: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    clearInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !currentList.includes(trimmed)) {
      setList((prev) => [...prev, trimmed]);
      clearInput("");
    }
  }, []);

  const removeTag = useCallback((
    valueToRemove: string, 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev) => prev.filter((item) => item !== valueToRemove));
  }, []);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) { alert("Product Name is required"); setIsSubmitting(false); return; }
    if (!formData.price || isNaN(Number(formData.price))) { alert("Valid Price is required"); setIsSubmitting(false); return; }
    if (images.length === 0) { alert("At least one image is required"); setIsSubmitting(false); return; }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("slug", formData.slug);
      data.append("sizes", JSON.stringify(sizes));
      data.append("colors", JSON.stringify(colors));
      images.forEach((file) => data.append("images", file));

      console.log("PAYLOAD:", Object.fromEntries(data));
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      alert("Product Created Successfully!");
      
      setFormData({ name: "", price: "", description: "", slug: "" });
      setSizes([]);
      setColors([]);
      setImages([]);
      setPreviews([]);
      
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20 font-sans">
      
      {/* --- TOP BAR --- */}
      <div className="border-b border-zinc-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-zinc-400 hover:text-black transition-colors">
              <HiArrowLongLeft className="text-xl" />
            </Link>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:block">INVENTORY // NEW ITEM</p>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest sm:hidden">NEW ITEM</p>
          </div>
          <p className="text-xs font-mono text-zinc-900">DRAFT MODE</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">Create Product</h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Define specifications for new stock unit.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button 
              type="button" 
              className="w-full sm:w-auto px-8 py-4 border border-zinc-200 text-xs font-bold tracking-widest uppercase hover:bg-zinc-50 transition-colors text-center"
            >
              Discard
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 bg-black text-white border border-black text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 text-center"
            >
              {isSubmitting ? "Processing..." : "Publish Unit"}
            </button>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN (Main Specs) --- */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">
            
            {/* Section 1: Identity */}
            <div className="border-t border-zinc-200 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-black"></span>
                01. Identification
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Product Name</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleTextChange}
                    placeholder="E.G. OVERSIZED HEAVY KNIT" 
                    className="w-full bg-zinc-50 border-b border-zinc-200 p-4 outline-none focus:border-black focus:bg-white transition-colors font-mono text-sm placeholder:text-zinc-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Price (INR)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiOutlineCurrencyRupee className="text-zinc-400" />
                      </div>
                      <input 
                        name="price" 
                        type="number" 
                        value={formData.price} 
                        onChange={handleTextChange}
                        placeholder="0.00" 
                        className="w-full bg-zinc-50 border-b border-zinc-200 pl-10 p-4 outline-none focus:border-black focus:bg-white transition-colors font-mono text-sm placeholder:text-zinc-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Generated Slug</label>
                    <div className="flex items-center px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono text-sm overflow-hidden">
                      <span className="mr-1 whitespace-nowrap">/product/</span>
                      <input 
                        name="slug" 
                        value={formData.slug} 
                        readOnly
                        className="bg-transparent w-full outline-none text-zinc-900 truncate"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Technical Description</label>
                  <textarea 
                    name="description" 
                    rows={6} 
                    value={formData.description}
                    onChange={handleTextChange}
                    placeholder="MATERIAL COMPOSITION, FIT DETAILS, CARE INSTRUCTIONS..." 
                    className="w-full bg-zinc-50 border-b border-zinc-200 p-4 outline-none focus:border-black focus:bg-white transition-colors font-mono text-sm placeholder:text-zinc-300 resize-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Visuals */}
            <div className="border-t border-zinc-200 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-zinc-300"></span>
                02. Visual Assets
              </h3>

              <div className="bg-zinc-50 border border-zinc-200 border-dashed p-6 md:p-8">
                <div className="flex flex-col items-center justify-center mb-8 text-center">
                  <div className="w-16 h-16 bg-white border border-zinc-200 flex items-center justify-center mb-4">
                    <HiCloudArrowUp className="text-2xl text-zinc-900" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">Upload Assets</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1">SUPPORTED: JPG, PNG, WEBP (MAX 5MB)</p>
                  
                  <label className="mt-6 px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-colors w-full sm:w-auto text-center">
                    Select Files
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {/* Grid */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-8 border-t border-zinc-200 border-dashed">
                    {previews.map((src, index) => (
                      <div key={src} className="group relative aspect-[3/4] bg-white border border-zinc-200">
                        <Image src={src} alt="preview" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 p-2 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white text-black text-[9px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          IMG_0{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Configuration) --- */}
          <div className="lg:col-span-4 space-y-10 md:space-y-12">
            
            <div className="border-t border-zinc-200 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-zinc-300"></span>
                03. Configuration
              </h3>

              <div className="space-y-8">
                
                {/* Sizes Input */}
                <div className="bg-zinc-50 border border-zinc-200 p-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Size Range</label>
                  
                  <div className="flex gap-0 mb-4">
                    <input 
                      value={currentSize}
                      onChange={(e) => setCurrentSize(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(currentSize, sizes, setSizes, setCurrentSize))}
                      placeholder="ADD SIZE" 
                      className="flex-1 min-w-0 bg-white border border-zinc-200 p-3 outline-none focus:border-black font-mono text-xs placeholder:text-zinc-300"
                    />
                    <button type="button" onClick={() => addTag(currentSize, sizes, setSizes, setCurrentSize)} className="px-4 bg-black text-white hover:bg-zinc-800">
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <span key={s} className="inline-flex items-center border border-black bg-white px-3 py-1.5 text-xs font-mono font-bold">
                        {s}
                        <button onClick={() => removeTag(s, setSizes)} className="ml-3 hover:text-red-500"><HiXMark className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {sizes.length === 0 && <span className="text-[10px] font-mono text-zinc-400">NO SIZES DEFINED</span>}
                  </div>
                </div>

                {/* Colors Input */}
                <div className="bg-zinc-50 border border-zinc-200 p-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Colorways</label>
                  
                  <div className="flex gap-0 mb-4">
                    <input 
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(currentColor, colors, setColors, setCurrentColor))}
                      placeholder="ADD COLOR" 
                      className="flex-1 min-w-0 bg-white border border-zinc-200 p-3 outline-none focus:border-black font-mono text-xs placeholder:text-zinc-300"
                    />
                    <button type="button" onClick={() => addTag(currentColor, colors, setColors, setCurrentColor)} className="px-4 bg-black text-white hover:bg-zinc-800">
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <span key={c} className="inline-flex items-center bg-black text-white px-3 py-1.5 text-xs font-mono font-bold">
                        {c}
                        <button onClick={() => removeTag(c, setColors)} className="ml-3 hover:text-zinc-400"><HiXMark className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {colors.length === 0 && <span className="text-[10px] font-mono text-zinc-400">NO COLORS DEFINED</span>}
                  </div>
                </div>

                {/* Status Box */}
                <div className="bg-black text-white p-6 relative overflow-hidden">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-2">SYSTEM STATUS</p>
                  <h4 className="text-xl font-bold uppercase">Ready to Push</h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-2 border-t border-zinc-800 pt-2">
                    DATABASE: CONNECTED<br/>
                    STORAGE: AVAILABLE
                  </p>
                  <HiOutlineCube className="absolute -bottom-4 -right-4 text-6xl text-zinc-800 opacity-50" />
                </div>

              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}