"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineHome, 
  HiOutlineCube, 
  HiOutlineShoppingCart, 
  HiOutlineUsers, 
  HiOutlineCog,
  HiBars3,     // Hamburger Menu Icon
  HiXMark,     // Close Icon
  HiArrowRightOnRectangle // Logout Icon
} from "react-icons/hi2";

const menuItems = [
  { name: "Dashboard", icon: HiOutlineHome, href: "/admin" },
  { name: "Products", icon: HiOutlineCube, href: "/admin/products/add" },
  { name: "Orders", icon: HiOutlineShoppingCart, href: "/admin/orders" },
  { name: "Customers", icon: HiOutlineUsers, href: "/admin/customers" },
 
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close sidebar when clicking a link (Mobile UX)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <>
      {/* --- MOBILE TOP BAR (Visible only on small screens) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="font-black text-lg tracking-tighter text-black">LUCIDRIP <span className="text-gray-400 font-medium">ADMIN</span></div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-800 transition-colors"
        >
          <HiBars3 className="text-2xl" />
        </button>
      </div>

      {/* --- OVERLAY (Backdrop for Mobile) --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50
          w-72 bg-white border-r border-gray-100
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
        `}
      >
        {/* Header (Logo + Mobile Close) */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-gray-50">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-black leading-none">
              LUCIDRIP
            </h1>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Admin Panel</span>
          </div>
          
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <HiXMark className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white shadow-xl shadow-black/20 translate-x-1"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black hover:translate-x-1"
                }`}
              >
                <item.icon className={`text-xl transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-black"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all cursor-pointer group">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@lucidrip.com</p>
            </div>

            {/* Logout Action */}
            <button 
              className="text-gray-300 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
               <HiArrowRightOnRectangle className="text-xl" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;