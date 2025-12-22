"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineMapPin, 
  HiOutlineHeart, 
  HiOutlineQuestionMarkCircle,
  HiArrowRightOnRectangle,
  HiChevronRight
} from "react-icons/hi2";
import { useAuthStore } from "@/store/useAuthStore";

const MENU_ITEMS = [
  { name: "Profile", href: "/account", icon: HiOutlineUser, description: "Personal details" },
  { name: "Orders", href: "/account/orders", icon: HiOutlineShoppingBag, description: "Track & manage" },
  { name: "Addresses", href: "/account/addresses", icon: HiOutlineMapPin, description: "Shipping info" },
  { name: "Wishlist", href: "/account/wishlist", icon: HiOutlineHeart, description: "Saved items" },
  { name: "Support", href: "/account/support", icon: HiOutlineQuestionMarkCircle, description: "Get help" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border border-neutral-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-2">
            My Account
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-wide">
            Welcome, <span className="italic">{user?.username || "User"}</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-neutral-200 sticky top-24">
              
              {/* User Profile Mini */}
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-neutral-100 flex items-center justify-center text-lg font-light text-neutral-600 border border-neutral-200">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user?.username || "User")
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                    >
                      <motion.div
                        whileHover={{ x: 2 }}
                        className={`flex items-center gap-3 px-4 py-3.5 text-sm transition-all relative ${
                          isActive 
                            ? "bg-neutral-900 text-white" 
                            : "text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex-1">
                          <p className="font-light">{item.name}</p>
                        </div>
                        <HiChevronRight className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-0"}`} />
                      </motion.div>
                    </Link>
                  );
                })}
                
                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-600 hover:bg-red-50 transition-all mt-2 border-t border-neutral-100"
                >
                  <HiArrowRightOnRectangle className="w-5 h-5" />
                  <span className="font-light">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
}
