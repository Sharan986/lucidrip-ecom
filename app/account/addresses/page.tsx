"use client";

import React, { useState } from "react";
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiCheckCircle, 
  HiXMark,
  HiOutlineHome,
  HiOutlineBuildingOffice 
} from "react-icons/hi2";

// --- TYPES ---
type Address = {
  id: number;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
};

// --- INITIAL DUMMY DATA ---
const INITIAL_ADDRESSES: Address[] = [
  {
    id: 1,
    label: "Home",
    name: "Sumit",
    phone: "+91 98765 43210",
    street: "Flat 402, Sunshine Apartments, MG Road",
    city: "Jamshedpur",
    state: "Jharkhand",
    zip: "831004",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    name: "Sumit",
    phone: "+91 98765 43210",
    street: "Tech Park, Sector 5",
    city: "Jamshedpur",
    state: "Jharkhand",
    zip: "831004",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  // --- HANDLERS ---

  // 1. Open Modal (Add Mode)
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      label: "Home",
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false, // Default is false for new addresses unless it's the first one
    });
    setIsModalOpen(true);
  };

  // 2. Open Modal (Edit Mode)
  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  // 3. Save Address (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE EXISTING
      setAddresses((prev) => 
        prev.map((addr) => 
          addr.id === editingId ? { ...addr, ...formData, id: editingId } : addr
        )
      );
    } else {
      // CREATE NEW
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
      const newAddress = { ...formData, id: newId };
      
      // If it's the only address, make it default automatically
      if (addresses.length === 0) newAddress.isDefault = true;

      setAddresses([...addresses, newAddress]);
    }

    setIsModalOpen(false);
  };

  // 4. Delete Address
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  // 5. Set Default
  const handleSetDefault = (id: number) => {
    setAddresses((prev) => 
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id, // Set true for selected, false for others
      }))
    );
  };

  return (
    <div className="relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <HiOutlinePlus className="text-lg" />
          Add New Address
        </button>
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            className={`relative p-6 rounded-xl border transition-all ${
              addr.isDefault 
                ? "border-black bg-gray-50 shadow-sm" 
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Default Badge */}
            {addr.isDefault && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                <HiCheckCircle /> Default
              </span>
            )}

            {/* Label Icon */}
            <div className="flex items-center gap-2 mb-3">
               {addr.label === "Home" ? <HiOutlineHome className="text-gray-400" /> : <HiOutlineBuildingOffice className="text-gray-400" />}
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{addr.label}</h3>
            </div>

            {/* Content */}
            <div className="space-y-1 mb-6">
              <p className="font-bold text-gray-900 text-lg">{addr.name}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {addr.street} <br />
                {addr.city}, {addr.state} - {addr.zip}
              </p>
              <p className="text-gray-600 text-sm font-medium pt-2">
                Phone: <span className="text-black">{addr.phone}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => openEditModal(addr)}
                className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-blue-600 transition"
              >
                <HiOutlinePencil className="text-base" /> Edit
              </button>
              
              {!addr.isDefault && (
                <>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition"
                  >
                    <HiOutlineTrash className="text-base" /> Remove
                  </button>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-gray-500 hover:text-black transition"
                  >
                    Set as Default
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add Button Card */}
        <button 
          onClick={openAddModal}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
             <HiOutlinePlus className="text-xl" />
          </div>
          <span className="font-bold text-sm">Add Another Address</span>
        </button>
      </div>

      {/* --- FORM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition">
                <HiXMark className="text-xl text-gray-500" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              {/* Type Selection */}
              <div className="flex gap-4">
                {["Home", "Office", "Other"].map((type) => (
                  <label key={type} className="flex-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="label" 
                      value={type} 
                      checked={formData.label === type}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="text-center py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 peer-checked:border-black peer-checked:bg-black peer-checked:text-white transition-all">
                      {type}
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Sumit Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition font-medium text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Phone</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Address</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Flat No, Apartment, Street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">City</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition font-medium text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">State</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition font-medium text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">ZIP Code</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.zip}
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition font-medium text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl bg-black font-bold text-white hover:bg-zinc-800 transition shadow-lg"
                >
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}