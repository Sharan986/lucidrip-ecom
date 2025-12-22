"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiPlus, 
  HiXMark, 
  HiCheck,
  HiOutlineHome,
  HiOutlineBuildingOffice,
  HiOutlinePencil,
  HiOutlineTrash
} from "react-icons/hi2";
import { useAddressStore, Address } from "@/store/useAddressStore";

export default function AddressesPage() {
  const { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

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
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr._id);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await updateAddress(editingId, formData);
    } else {
      await addAddress(formData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
              Shipping
            </p>
            <h2 className="text-2xl font-extralight tracking-wide">
              My <span className="italic">Addresses</span>
            </h2>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
          >
            <HiPlus className="w-4 h-4" />
            Add Address
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && addresses.length === 0 && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <div className="w-8 h-8 border border-neutral-900 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Loading addresses...</p>
        </div>
      )}

      {/* Address Grid */}
      {!isLoading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, index) => (
            <motion.div
              key={addr._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white border p-6 transition-all ${
                addr.isDefault 
                  ? "border-neutral-900" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* Default Badge */}
              {addr.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-neutral-900">
                  <HiCheck className="w-4 h-4" />
                  <span className="text-[10px] tracking-[0.1em] uppercase">Default</span>
                </div>
              )}

              {/* Label */}
              <div className="flex items-center gap-2 mb-4">
                {addr.label === "Home" ? (
                  <HiOutlineHome className="w-4 h-4 text-neutral-400" />
                ) : (
                  <HiOutlineBuildingOffice className="w-4 h-4 text-neutral-400" />
                )}
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                  {addr.label}
                </span>
              </div>

              {/* Address Details */}
              <div className="space-y-1 mb-6">
                <p className="text-sm font-medium text-neutral-900">{addr.name}</p>
                <p className="text-sm font-light text-neutral-600 leading-relaxed">
                  {addr.street}<br />
                  {addr.city}, {addr.state} - {addr.zip}
                </p>
                <p className="text-sm font-light text-neutral-500">{addr.phone}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
                <button 
                  onClick={() => openEditModal(addr)}
                  className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition"
                >
                  <HiOutlinePencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(addr._id)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" />
                  Delete
                </button>
                {!addr.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(addr._id)}
                    className="ml-auto text-xs text-neutral-500 hover:text-neutral-900 transition underline underline-offset-2"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && addresses.length === 0 && (
        <div className="bg-white border border-neutral-200 p-16 text-center">
          <div className="w-16 h-16 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
            <HiOutlineHome className="w-8 h-8 text-neutral-300" />
          </div>
          <h3 className="text-lg font-extralight text-neutral-900 mb-2">
            No addresses yet
          </h3>
          <p className="text-sm text-neutral-500 mb-8">
            Add a shipping address to make checkout faster
          </p>
          <button 
            onClick={openAddModal}
            className="bg-neutral-900 text-white px-8 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-neutral-900/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white z-50 max-h-[80vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                    {editingId ? "Edit" : "New"}
                  </p>
                  <h3 className="text-xl font-extralight">
                    {editingId ? "Edit Address" : "Add Address"}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 transition"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Address Type */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Address Type
                  </label>
                  <div className="flex gap-2">
                    {["Home", "Work"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, label: type })}
                        className={`flex-1 py-3 text-xs tracking-[0.1em] uppercase border transition ${
                          formData.label === type
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                </div>

                {/* Street */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                </div>

                {/* Default Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div 
                    className={`w-5 h-5 border flex items-center justify-center transition ${
                      formData.isDefault ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                    }`}
                  >
                    {formData.isDefault && <HiCheck className="w-3 h-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="hidden"
                  />
                  <span className="text-sm font-light text-neutral-600">
                    Set as default address
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-neutral-900 text-white py-4 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
                >
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
