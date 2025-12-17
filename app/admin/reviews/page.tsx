"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  HiStar, 
  HiOutlineStar, 
  HiCheck, 
  HiXMark, 
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";

// --- TYPES ---
type ReviewStatus = "Published" | "Pending" | "Rejected";

interface Review {
  id: string;
  product: { name: string; img: string; slug: string };
  customer: { name: string; email: string };
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

// --- MOCK DATA ---
const REVIEWS: Review[] = [
  {
    id: "REV-001",
    product: { name: "Oversized Street Hoodie", img: "/Hero/Product1.avif", slug: "oversized-hoodie" },
    customer: { name: "Sumit Mehta", email: "sumit@gmail.com" },
    rating: 5,
    comment: "Absolutely love the fit! The fabric is heavy and feels premium. Definitely buying another color.",
    date: "2 hours ago",
    status: "Pending"
  },
  {
    id: "REV-002",
    product: { name: "Classic Beige Knit", img: "/Hero/Product2.avif", slug: "beige-knit" },
    customer: { name: "Priya Singh", email: "priya@yahoo.com" },
    rating: 4,
    comment: "Good quality but the size runs a bit large. I suggest sizing down.",
    date: "1 day ago",
    status: "Published"
  },
  {
    id: "REV-003",
    product: { name: "Tactical Cargo Pant", img: "/Hero/Product3.avif", slug: "cargo-pant" },
    customer: { name: "Rahul Verma", email: "rahul@tech.in" },
    rating: 1,
    comment: "Terrible experience. The stitching came off after one wash. Want a refund immediately.",
    date: "2 days ago",
    status: "Pending" // Needs attention
  },
  {
    id: "REV-004",
    product: { name: "Graphic Print Tee", img: "/Hero/Product4.avif", slug: "graphic-tee" },
    customer: { name: "Anjali Roy", email: "anjali@art.com" },
    rating: 5,
    comment: "Print quality is amazing. Fast delivery too!",
    date: "3 days ago",
    status: "Published"
  },
  {
    id: "REV-005",
    product: { name: "Oversized Street Hoodie", img: "/Hero/Product1.avif", slug: "oversized-hoodie" },
    customer: { name: "Bot User", email: "bot@spam.com" },
    rating: 5,
    comment: "Click here for free coins: http://spam-link.com",
    date: "1 week ago",
    status: "Rejected"
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [filterStatus, setFilterStatus] = useState("All");

  // --- ACTIONS ---
  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "Published" } : r));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
  };

  const handleDelete = (id: string) => {
    if(confirm("Delete this review permanently?")) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  // --- FILTERS ---
  const filteredReviews = reviews.filter(r => filterStatus === "All" || r.status === filterStatus);

  // --- HELPER: STAR RATING ---
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex text-yellow-400 text-xs">
        {[...Array(5)].map((_, i) => (
          i < rating ? <HiStar key={i} /> : <HiOutlineStar key={i} className="text-zinc-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans text-zinc-900">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
            <p className="text-sm text-zinc-500 mt-1">Moderate user feedback and track product sentiment.</p>
          </div>
          <div className="flex gap-4">
             {/* Quick Stats */}
             <div className="bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
                <div>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avg Rating</p>
                   <div className="flex items-center gap-1">
                      <HiStar className="text-yellow-400 text-sm" />
                      <span className="font-mono font-bold text-sm">4.2</span>
                   </div>
                </div>
                <div className="w-px h-8 bg-zinc-100"></div>
                <div>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pending</p>
                   <span className="font-mono font-bold text-sm text-yellow-600">{reviews.filter(r => r.status === 'Pending').length}</span>
                </div>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-white">
             <div className="flex bg-zinc-100 p-1 rounded-lg">
                {["All", "Pending", "Published", "Rejected"].map((status) => (
                   <button
                     key={status}
                     onClick={() => setFilterStatus(status)}
                     className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                       filterStatus === status ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
                     }`}
                   >
                     {status}
                   </button>
                ))}
             </div>
             
             <div className="relative w-64">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  placeholder="Search reviews..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-black transition"
                />
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-64">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-48">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32">Rating</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Comment</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                   {filteredReviews.map((review) => (
                      <tr key={review.id} className="group hover:bg-zinc-50 transition-colors">
                         
                         {/* Product Info */}
                         <td className="px-6 py-4 align-top">
                            <div className="flex gap-3">
                               <div className="w-10 h-12 relative bg-zinc-100 rounded border border-zinc-200 overflow-hidden shrink-0">
                                  <Image src={review.product.img} alt={review.product.name} fill className="object-cover" />
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-zinc-900 line-clamp-1">{review.product.name}</p>
                                  <Link href={`/product/${review.product.slug}`} className="text-[10px] text-blue-600 hover:underline">View Product</Link>
                               </div>
                            </div>
                         </td>

                         {/* Customer Info */}
                         <td className="px-6 py-4 align-top">
                            <p className="text-sm font-bold text-zinc-900">{review.customer.name}</p>
                            <p className="text-xs text-zinc-500">{review.customer.email}</p>
                         </td>

                         {/* Rating */}
                         <td className="px-6 py-4 align-top">
                            <StarRating rating={review.rating} />
                            <p className="text-[10px] text-zinc-400 mt-1">{review.date}</p>
                         </td>

                         {/* Comment */}
                         <td className="px-6 py-4 align-top">
                            <p className="text-sm text-zinc-700 leading-relaxed italic">"{review.comment}"</p>
                         </td>

                         {/* Status */}
                         <td className="px-6 py-4 align-top">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                               review.status === "Published" ? "bg-green-50 text-green-700 border-green-200" :
                               review.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                               "bg-red-50 text-red-700 border-red-200"
                            }`}>
                               {review.status === "Pending" && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5 animate-pulse"></span>}
                               {review.status}
                            </span>
                         </td>

                         {/* Actions */}
                         <td className="px-6 py-4 align-top text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               {review.status === "Pending" && (
                                  <>
                                    <button 
                                      onClick={() => handleApprove(review.id)}
                                      className="p-1.5 bg-white border border-zinc-200 text-green-600 rounded hover:bg-green-50 hover:border-green-200 transition shadow-sm" 
                                      title="Approve"
                                    >
                                       <HiCheck className="text-lg" />
                                    </button>
                                    <button 
                                      onClick={() => handleReject(review.id)}
                                      className="p-1.5 bg-white border border-zinc-200 text-red-600 rounded hover:bg-red-50 hover:border-red-200 transition shadow-sm" 
                                      title="Reject"
                                    >
                                       <HiXMark className="text-lg" />
                                    </button>
                                  </>
                               )}
                               <button className="p-1.5 text-zinc-400 hover:text-black transition" title="Delete">
                                  <HiOutlineTrash className="text-lg" />
                               </button>
                            </div>
                         </td>

                      </tr>
                   ))}
                   
                   {filteredReviews.length === 0 && (
                      <tr>
                         <td colSpan={6} className="px-6 py-20 text-center">
                            <p className="text-zinc-400 text-sm">No reviews found in this category.</p>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>

        </div>
      </div>
    </div>
  );
}