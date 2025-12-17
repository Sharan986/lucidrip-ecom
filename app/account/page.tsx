"use client";

import React, { useState } from "react";
import { 
  HiOutlineUser, 
  HiOutlineShieldCheck, 
  HiOutlineBell, 
  HiOutlineCreditCard, 
  HiOutlineMap,
  HiCamera,
  HiCheckBadge,
  HiArrowRightOnRectangle
} from "react-icons/hi2";

// --- TYPES ---
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  username: string;
  bio: string;
  avatar: string | null;
}

// --- MOCK DATA ---
const MOCK_USER: UserProfile = {
  name: "Sumit Kumar",
  email: "sumit@example.com",
  phone: "+91 98765 43210",
  username: "sumit_k",
  bio: "Fashion enthusiast and software engineer based in Bangalore.",
  avatar: null, 
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);

  // --- TABS ---
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "account", label: "Security" },
    { id: "billing", label: "Billing" },
    { id: "notifications", label: "Notifications" },
  ];

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* =========================================
          HEADER SECTION (Clean & Centered)
      ========================================= */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-0">
           
           <div className="flex justify-between items-end mb-8">
             <div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Account Settings</h1>
               <p className="text-gray-500 text-sm">Manage your personal details and preferences.</p>
             </div>
             <button className="hidden md:flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition">
                <HiArrowRightOnRectangle className="text-lg" /> Sign Out
             </button>
           </div>

           {/* HORIZONTAL TABS */}
           <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "text-black" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                  {/* Active Indicator Line */}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-t-full"></span>
                  )}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* =========================================
          CONTENT AREA (Centered)
      ========================================= */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        
        {/* TAB: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* 1. Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-4xl font-black border-4 border-white shadow-lg overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <HiCamera className="text-white text-2xl" />
                  </div>
               </div>
               
               <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">Update your photo and personal details.</p>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition">Upload New</button>
                    <button className="px-4 py-2 border border-gray-200 text-black text-xs font-bold rounded-lg hover:bg-gray-50 transition">Remove</button>
                  </div>
               </div>
            </div>

            <hr className="border-gray-100" />

            {/* 2. Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
               
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Display Name</label>
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full bg-transparent border-b border-gray-200 py-3 text-base font-bold text-gray-900 focus:outline-none focus:border-black transition"
                    placeholder="Your Name"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
                  <div className="relative">
                    <span className="absolute left-0 top-3 text-gray-400 font-bold">@</span>
                    <input 
                      type="text" 
                      value={user.username}
                      onChange={(e) => setUser({...user, username: e.target.value})}
                      className="w-full bg-transparent border-b border-gray-200 py-3 pl-5 text-base font-bold text-gray-900 focus:outline-none focus:border-black transition"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                  <div className="relative">
                     <input 
                       type="email" 
                       value={user.email}
                       disabled
                       className="w-full bg-transparent border-b border-gray-200 py-3 text-base font-bold text-gray-400 cursor-not-allowed"
                     />
                     <HiCheckBadge className="absolute right-0 top-3 text-green-500 text-xl" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                  <input 
                    type="tel" 
                    value={user.phone}
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-gray-200 py-3 text-base font-bold text-gray-900 focus:outline-none focus:border-black transition"
                  />
               </div>

               <div className="md:col-span-2 space-y-2 mt-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Bio</label>
                  <textarea 
                    rows={3}
                    value={user.bio}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none"
                    placeholder="Write a short bio..."
                  />
               </div>

            </div>

            {/* 3. Footer Action */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
               <span className="text-xs text-gray-400 font-medium mr-auto hidden md:block">Last saved: Just now</span>
               <button className="text-sm font-bold text-gray-500 hover:text-black transition px-4">Cancel</button>
               <button 
                 onClick={handleSave}
                 disabled={isLoading}
                 className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center gap-2"
               >
                 {isLoading ? (
                   <>Saving...</>
                 ) : (
                   "Save Changes"
                 )}
               </button>
            </div>

          </div>
        )}

        {/* EMPTY STATES FOR OTHER TABS */}
        {activeTab !== "profile" && (
           <div className="text-center py-32 opacity-50">
              <p className="text-xl font-bold text-gray-300">This section is coming soon.</p>
           </div>
        )}

      </div>
    </div>
  );
}