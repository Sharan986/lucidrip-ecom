"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HiOutlinePencilSquare, 
  HiCheck, 
  HiXMark, 
  HiOutlineUserCircle,
  HiOutlineShoppingBag,
  HiOutlineCreditCard,
  HiOutlineMap,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineTrash,
  HiOutlineDevicePhoneMobile,
 HiArrowRightOnRectangle
} from "react-icons/hi2";

// --- 1. TYPES (Industry Standard) ---
interface UserStats {
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

interface UserNotification {
  email: boolean;
  sms: boolean;
  promo: boolean;
}

interface UserProfile {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  avatar: string | null;
  status: "Active" | "Suspended";
  memberSince: string;
  stats: UserStats;
  notifications: UserNotification;
  defaultAddress: string;
  paymentMethod: string;
}

// --- 2. MOCK DATA ---
const MOCK_USER: UserProfile = {
  id: "u_123",
  customerId: "CUST-88291",
  name: "Sumit Kumar",
  email: "Sumit@example.com",
  phone: "+91 98765 43210",
  gender: "Male",
  dob: "1998-08-15",
  avatar: null, // null = render initials
  status: "Active",
  memberSince: "Jan 2024",
  stats: {
    totalOrders: 24,
    totalSpend: 18450,
    lastOrderDate: "12 Dec 2024",
  },
  notifications: {
    email: true,
    sms: true,
    promo: false,
  },
  defaultAddress: "Flat 402, Sunshine Apts, MG Road, Bangalore - 560001",
  paymentMethod: "UPI (Google Pay)",
};

export default function ProfilePage() {
  // --- STATE ---
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State for Editable Fields
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    dob: user.dob,
  });

  // --- HANDLERS ---

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate Backend API Call
    setTimeout(() => {
      setUser({ ...user, ...formData });
      setIsEditing(false);
      setIsSaving(false);
    }, 1500);
  };

  const handleCancel = () => {
    setFormData({ name: user.name, phone: user.phone, gender: user.gender, dob: user.dob });
    setIsEditing(false);
  };

  const toggleNotification = (key: keyof UserNotification) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* =========================================
          SECTION 1: PROFILE OVERVIEW (TOP CARD)
      ========================================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          
          {/* Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
              <span>ID: <span className="font-mono text-gray-900">{user.customerId}</span></span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Member since {user.memberSince}</span>
            </div>
            {/* Status Badge */}
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.status === "Active" 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700"
              }`}>
                <span className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-6 md:gap-10 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 w-full md:w-auto justify-between md:justify-start">
           <div className="text-center">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Orders</p>
              <p className="text-lg font-bold text-gray-900">{user.stats.totalOrders}</p>
           </div>
           <div className="w-px h-8 bg-gray-200"></div>
           <div className="text-center">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Spent</p>
              <p className="text-lg font-bold text-gray-900">₹{user.stats.totalSpend.toLocaleString()}</p>
           </div>
           <div className="w-px h-8 bg-gray-200"></div>
           <div className="text-center">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Last Order</p>
              <p className="text-lg font-bold text-gray-900">{user.stats.lastOrderDate}</p>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* =========================================
            LEFT COLUMN (2/3 Width)
        ========================================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* --- SECTION 2: BASIC INFORMATION --- */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HiOutlineUserCircle className="text-xl" /> Basic Information
              </h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-bold text-black hover:text-zinc-600 transition">
                  <HiOutlinePencilSquare /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleCancel} disabled={isSaving} className="text-xs font-bold text-red-500 px-3 py-1 bg-red-50 rounded-lg">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="text-xs font-bold text-green-600 px-3 py-1 bg-green-50 rounded-lg flex items-center gap-1">
                    {isSaving ? "Saving..." : <><HiCheck /> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
                {isEditing ? (
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-b-2 border-gray-200 py-1 font-medium focus:border-black focus:outline-none" />
                ) : (
                  <p className="font-bold text-gray-900">{user.name}</p>
                )}
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-500">{user.email}</p>
                  <HiCheck className="text-green-500" title="Verified" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Phone</label>
                {isEditing ? (
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border-b-2 border-gray-200 py-1 font-medium focus:border-black focus:outline-none" />
                ) : (
                   <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{user.phone}</p>
                    <HiCheck className="text-green-500" title="Verified" />
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Gender</label>
                {isEditing ? (
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full border-b-2 border-gray-200 py-1 font-medium focus:border-black focus:outline-none bg-white">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                ) : (
                  <p className="font-bold text-gray-900">{user.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* --- SECTION 3: ADDRESS & PAYMENT SUMMARY --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Address */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
               <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <HiOutlineMap className="text-lg" /> Default Address
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{user.defaultAddress}</p>
               </div>
               <Link href="/account/addresses" className="mt-4 text-xs font-bold text-black border border-gray-200 rounded-xl py-2 text-center hover:bg-black hover:text-white transition">
                  Manage Addresses
               </Link>
            </div>

            {/* Payment */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
               <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <HiOutlineCreditCard className="text-lg" /> Payment Snapshot
                  </h3>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border text-xs">UPI</div>
                    <span className="text-sm font-bold text-gray-900">{user.paymentMethod}</span>
                  </div>
               </div>
               <button className="mt-4 text-xs font-bold text-gray-400 border border-dashed border-gray-200 rounded-xl py-2 text-center cursor-not-allowed">
                  Saved Cards (Secure)
               </button>
            </div>
          </div>

        </div>

        {/* =========================================
            RIGHT COLUMN (1/3 Width)
        ========================================= */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* --- SECTION 4: SECURITY --- */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <HiOutlineShieldCheck className="text-xl" /> Security
             </h3>
             
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold uppercase text-gray-400">Password</label>
                    <button className="text-xs font-bold text-black hover:underline">Change</button>
                  </div>
                  <p className="text-lg tracking-widest text-gray-900">●●●●●●●●</p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <label className="text-xs font-bold uppercase text-gray-400 block mb-3">Logged-in Devices</label>
                  <div className="flex items-center gap-3 mb-4">
                    <HiOutlineDevicePhoneMobile className="text-gray-400 text-lg" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Chrome on Mac OS</p>
                      <p className="text-[10px] text-green-600 font-bold">Active Now</p>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-50 py-2 rounded-xl hover:bg-red-100 transition">
                     <HiArrowRightOnRectangle /> Logout All Devices
                  </button>
                </div>
             </div>
          </div>

          {/* --- SECTION 5: NOTIFICATIONS --- */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <HiOutlineBell className="text-xl" /> Notifications
             </h3>
             <div className="space-y-4">
                {Object.entries(user.notifications).map(([key, value]) => (
                   <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 capitalize">{key} Updates</span>
                      {/* Toggle Switch UI */}
                      <button 
                        onClick={() => toggleNotification(key as keyof UserNotification)}
                        className={`w-10 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${
                           value ? "bg-black" : "bg-gray-200"
                        }`}
                      >
                         <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${
                            value ? "translate-x-4" : "translate-x-0"
                         }`}></span>
                      </button>
                   </div>
                ))}
             </div>
          </div>

          {/* --- SECTION 6: DANGER ZONE --- */}
          <div className="border border-red-100 bg-red-50/50 rounded-xl p-6">
             <h3 className="text-sm font-bold text-red-900 mb-2">Account Actions</h3>
             <div className="space-y-2">
               <button className="w-full text-left text-xs font-bold text-red-600 hover:text-red-800 py-2">
                 Deactivate Account
               </button>
               <button className="w-full text-left text-xs font-bold text-red-600 hover:text-red-800 py-2">
                 Request Data Export
               </button>
               <div className="h-px bg-red-200 my-2"></div>
               <button className="w-full flex items-center gap-2 text-xs font-bold text-white bg-red-600 py-3 px-4 rounded-xl hover:bg-red-700 transition shadow-sm">
                 <HiOutlineTrash /> Delete Account
               </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}