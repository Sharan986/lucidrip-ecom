"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiArrowRightOnRectangle,
  HiOutlineCamera,
  HiCheck,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineCreditCard
} from "react-icons/hi2";
import { useAuthStore } from "@/store/useAuthStore";

const tabs = [
  { id: "profile", label: "Profile", icon: null },
  { id: "security", label: "Security", icon: HiOutlineShieldCheck },
  { id: "notifications", label: "Notifications", icon: HiOutlineBell },
  { id: "billing", label: "Billing", icon: HiOutlineCreditCard },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  const { user, updateProfile, logout } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveMessage(null);
    
    const success = await updateProfile({
      username: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
    });
    
    setIsLoading(false);
    
    if (success) {
      setSaveMessage("Profile updated successfully");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  };

  return (
    <div className="bg-white border border-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
              Settings
            </p>
            <h2 className="text-2xl font-extralight tracking-wide">
              Account <span className="italic">Settings</span>
            </h2>
          </div>
          <button 
            onClick={logout}
            className="hidden md:flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-red-600 hover:text-red-700 transition"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-light transition-all relative whitespace-nowrap ${
                activeTab === tab.id 
                  ? "text-neutral-900" 
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Avatar Section */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-3xl font-extralight text-neutral-500 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      formData.name.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiOutlineCamera className="text-white w-6 h-6" />
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-light text-neutral-900 mb-1">
                    {formData.name || "User"}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4">
                    Update your photo and personal details
                  </p>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button className="px-5 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition">
                      Upload New
                    </button>
                    <button className="px-5 py-2.5 border border-neutral-200 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-neutral-100" />

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm font-light text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                    placeholder="Your Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm font-light text-neutral-400 cursor-not-allowed"
                    />
                    <div className="absolute right-0 top-3 flex items-center gap-1 text-emerald-600">
                      <HiCheck className="w-4 h-4" />
                      <span className="text-[10px] tracking-wide uppercase">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm font-light text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Member Since
                  </label>
                  <input 
                    type="text" 
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "N/A"}
                    disabled
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm font-light text-neutral-400 cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Bio
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-light text-neutral-900 focus:outline-none focus:border-neutral-900 transition resize-none"
                    placeholder="Write a short bio..."
                  />
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-emerald-600 text-sm"
                  >
                    <HiCheck className="w-5 h-5" />
                    {saveMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100">
                <button 
                  onClick={handleCancel}
                  className="text-sm font-light text-neutral-500 hover:text-neutral-900 transition px-4 py-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-neutral-900 text-white px-8 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab !== "profile" && (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-24 text-center"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
                Coming Soon
              </p>
              <p className="text-lg font-extralight text-neutral-300">
                This section is under development
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
