"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineMap, 
  HiOutlineHeart, 
  HiOutlineCreditCard,
  HiOutlineArrowRightOnRectangle 
} from "react-icons/hi2";

const MENU_ITEMS = [
  { name: "My Profile", href: "/account", icon: HiOutlineUser },
  { name: "Orders", href: "/account/orders", icon: HiOutlineShoppingBag },
  { name: "Addresses", href: "/account/addresses", icon: HiOutlineMap },
  { name: "Wishlist", href: "/account/wishlist", icon: HiOutlineHeart },
  { name: "Support", href: "/account/support", icon: HiOutlineCreditCard },

];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR --- */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden sticky top-24">
              
              {/* User Mini Profile */}
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                  JD
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Sumit</p>
                  <p className="text-xs text-gray-500">sumit@example.com</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-black text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <Icon className="text-lg" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* Logout */}
                <Link href="/login">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-4">
                  <HiOutlineArrowRightOnRectangle className="text-lg" />
                  Sign Out
                </button>
                </Link>
              </nav>
            </div>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}