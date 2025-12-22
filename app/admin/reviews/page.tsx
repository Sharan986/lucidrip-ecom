"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  HiOutlineMagnifyingGlass,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineStar
} from "react-icons/hi2";

// --- TYPES ---
interface Review {
  id: string;
  customer: string;
  product: string;
  productImg: string;
  rating: number;
  title: string;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

// --- MOCK DATA ---
const INITIAL_REVIEWS: Review[] = [
  { id: "REV-001", customer: "Aarav Sharma", product: "Oversized Street Hoodie", productImg: "/Hero/Product1.avif", rating: 5, title: "Perfect fit!", comment: "Amazing quality and the fit is exactly as described. Will definitely buy more.", status: "Approved", date: "May 12, 2024" },
  { id: "REV-002", customer: "Priya Patel", product: "Classic Beige Knit", productImg: "/Hero/Product2.avif", rating: 4, title: "Great material", comment: "Love the softness of the fabric. Slightly longer than expected but still looks great.", status: "Pending", date: "May 11, 2024" },
  { id: "REV-003", customer: "Rahul Verma", product: "Tactical Cargo Pant", productImg: "/Hero/Product3.avif", rating: 2, title: "Sizing issues", comment: "The size chart was misleading. Had to return.", status: "Pending", date: "May 10, 2024" },
  { id: "REV-004", customer: "Neha Singh", product: "Graphic Print Tee", productImg: "/Hero/Product4.avif", rating: 5, title: "Love it!", comment: "The print quality is excellent and hasn't faded after multiple washes.", status: "Approved", date: "May 09, 2024" },
  { id: "REV-005", customer: "Vikram Mehta", product: "Utility Bomber Jacket", productImg: "/Hero/Product1.avif", rating: 1, title: "Disappointed", comment: "Color was different from photos. Poor quality stitching.", status: "Rejected", date: "May 08, 2024" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <HiOutlineStar 
        key={star} 
        className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} 
      />
    ))}
  </div>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "Approved" } : r));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = review.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: reviews.length,
    pending: reviews.filter(r => r.status === "Pending").length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    fiveStars: reviews.filter(r => r.rating === 5).length
  }), [reviews]);

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
          Moderation
        </p>
        <h1 className="text-2xl font-extralight text-neutral-900">
          <span className="italic">Reviews</span>
        </h1>
      </div>

      {/* --- STATS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Total Reviews</p>
          <p className="text-2xl font-light text-neutral-900">{stats.total}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Pending</p>
          <p className="text-2xl font-light text-amber-600">{stats.pending}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Avg. Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-light text-neutral-900">{stats.avgRating}</p>
            <HiOutlineStar className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-2">5-Star Reviews</p>
          <p className="text-2xl font-light text-emerald-600">{stats.fiveStars}</p>
        </div>
      </motion.div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex border border-neutral-200">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase transition-all ${
                statusFilter === tab 
                  ? "bg-neutral-900 text-white" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..." 
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-xs font-light focus:outline-none focus:border-neutral-900 transition"
          />
        </div>
      </div>

      {/* --- REVIEWS LIST --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {filteredReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="border border-neutral-200 bg-white p-5"
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-16 h-20 bg-neutral-100 flex-shrink-0">
                <Image 
                  src={review.productImg} 
                  alt={review.product} 
                  fill 
                  className="object-cover" 
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-light text-neutral-900">{review.customer}</p>
                    <p className="text-[11px] text-neutral-500">{review.product}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={review.status} />
                    <span className="text-[11px] text-neutral-400">{review.date}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <StarRating rating={review.rating} />
                </div>

                <p className="text-sm font-medium text-neutral-900 mb-1">{review.title}</p>
                <p className="text-sm font-light text-neutral-600 line-clamp-2">{review.comment}</p>

                {/* Actions for Pending */}
                {review.status === "Pending" && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleApprove(review.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] tracking-[0.1em] uppercase hover:bg-emerald-700 transition flex items-center gap-1"
                    >
                      <HiOutlineCheck className="w-3 h-3" /> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(review.id)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 text-[10px] tracking-[0.1em] uppercase hover:bg-red-50 transition flex items-center gap-1"
                    >
                      <HiOutlineXMark className="w-3 h-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-16 border border-neutral-200 bg-white">
            <p className="text-sm font-light text-neutral-500">No reviews found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
