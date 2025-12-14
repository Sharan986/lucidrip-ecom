import React from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      {/* md:ml-64 pushes content to the right so it doesn't hide behind sidebar */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}