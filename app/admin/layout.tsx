"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/config/admin-nav";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex">
      
      {/* --- SIDEBAR (Fixed) --- */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col fixed h-full z-20">
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <div className="w-6 h-6 bg-black rounded-sm mr-3"></div>
          <span className="font-bold text-lg tracking-tight">LUXE ADMIN</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-zinc-100 text-black shadow-sm ring-1 ring-zinc-200" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-black"
                }`}
              >
                <Icon className={`text-lg ${isActive ? "text-black" : "text-zinc-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-zinc-200">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <HiArrowRightOnRectangle className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (Scrollable) --- */}
      <main className="flex-1 lg:ml-64">
        {/* Topbar (Mobile Toggle & Breadcrumbs could go here) */}
        <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-10 px-8 flex items-center justify-between">
           <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
             {ADMIN_NAV_ITEMS.find(i => i.href === pathname)?.name || "Overview"}
           </h2>
           <div className="flex items-center gap-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono text-zinc-400">SYSTEM ONLINE</span>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}