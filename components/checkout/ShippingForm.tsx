"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { useCheckoutStore, ShippingInfo } from "@/store/checkoutStore";
import { useAddressStore, Address } from "@/store/useAddressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

import { 
  HiOutlineHome, 
  HiOutlineBuildingOffice2, 
  HiOutlineMapPin, 
  HiArrowLeft, 
  HiArrowRight,
  HiCheck,
  HiPlus
} from "react-icons/hi2";

type ShippingFormData = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  addressType: "home" | "work";
};

export default function ShippingForm() {
  const { setShipping, shipping } = useCheckoutStore();
  const { nextStep, prevStep } = useCheckoutStepStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    mode: "onChange",
    defaultValues: {
      name: shipping.name || user?.username || "",
      email: shipping.email || user?.email || "",
      phone: shipping.phone || "",
      street: shipping.street || "",
      city: shipping.city || "",
      state: shipping.state || "",
      zip: shipping.zip || "",
      addressType: shipping.addressType || "home",
    },
  });

  const selectedAddressType = watch("addressType");

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address._id);
    setShowNewAddressForm(false);
    
    reset({
      name: address.name,
      email: user?.email || shipping.email || "",
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      addressType: address.label === "Home" ? "home" : "work",
    });
  };

  const onSubmit: SubmitHandler<ShippingFormData> = (data) => {
    setShipping(data);
    nextStep();
  };

  const inputClass = (hasError: boolean) => `
    w-full bg-white border text-neutral-900 text-sm block px-4 py-4 outline-none transition-all placeholder:text-neutral-300 tracking-wide
    ${hasError 
      ? "border-red-400 focus:border-red-500" 
      : "border-neutral-200 focus:border-black"
    }
  `;

  const labelClass = "text-xs tracking-[0.15em] uppercase text-neutral-400 mb-2 block";

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="border border-neutral-100"
    >
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-neutral-100">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">Step 2</p>
        <h2 className="text-2xl font-extralight tracking-tight">
          Shipping <span className="italic">Details</span>
        </h2>
      </div>

      <div className="p-6 md:p-8">
        {/* Saved Addresses */}
        {isAuthenticated && addresses.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">
              Saved Addresses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addresses.map((address) => (
                <button
                  type="button"
                  key={address._id}
                  onClick={() => handleSelectAddress(address)}
                  className={`relative p-5 border text-left transition-all ${
                    selectedAddressId === address._id
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {selectedAddressId === address._id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-black flex items-center justify-center">
                      <HiCheck className="text-white text-xs" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    {address.label === "Home" ? (
                      <HiOutlineHome className="text-neutral-400 text-sm" />
                    ) : (
                      <HiOutlineBuildingOffice2 className="text-neutral-400 text-sm" />
                    )}
                    <span className="text-[10px] tracking-[0.1em] uppercase text-neutral-400">
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="text-[9px] tracking-[0.1em] uppercase bg-black text-white px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-neutral-900">{address.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {address.street}, {address.city}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {address.state} - {address.zip}
                  </p>
                </button>
              ))}
              
              {/* New Address Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAddressId(null);
                  setShowNewAddressForm(true);
                  reset({
                    name: user?.username || "",
                    email: user?.email || "",
                    phone: "",
                    street: "",
                    city: "",
                    state: "",
                    zip: "",
                    addressType: "home",
                  });
                }}
                className={`p-5 border border-dashed flex items-center justify-center gap-2 min-h-[140px] transition-all ${
                  showNewAddressForm && !selectedAddressId
                    ? "border-black bg-neutral-50"
                    : "border-neutral-300 hover:border-neutral-500 text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <HiPlus className="text-lg" />
                <span className="text-xs tracking-[0.1em] uppercase">New Address</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-8">
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6">
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className={inputClass(!!errors.name)}
                  {...register("name", { required: "Required" })}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className={inputClass(!!errors.email)}
                    {...register("email", { 
                      required: "Required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email"
                      }
                    })}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    className={inputClass(!!errors.phone)}
                    {...register("phone", { 
                      required: "Required",
                      minLength: { value: 10, message: "10 digits required" },
                      pattern: { value: /^[0-9]+$/, message: "Numbers only" }
                    })}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setValue("phone", val, { shouldValidate: true });
                    }}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-6">
              Delivery Address
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Street Address</label>
                <input
                  type="text"
                  placeholder="123 Fashion Street, Apt 4B"
                  className={inputClass(!!errors.street)}
                  {...register("street", { required: "Required" })}
                />
                {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    className={inputClass(!!errors.city)}
                    {...register("city", { required: "Required" })}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    className={inputClass(!!errors.state)}
                    {...register("state", { required: "Required" })}
                  />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Zip Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="400001"
                    className={inputClass(!!errors.zip)}
                    {...register("zip", { 
                      required: "Required",
                      minLength: { value: 5, message: "Invalid" },
                      pattern: { value: /^[0-9]+$/, message: "Numbers only" }
                    })}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setValue("zip", val, { shouldValidate: true });
                    }}
                  />
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label className={labelClass}>Address Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("addressType", "home")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 border transition-all text-xs tracking-[0.1em] uppercase ${
                  selectedAddressType === "home"
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <HiOutlineHome className="text-base" />
                Home
              </button>

              <button
                type="button"
                onClick={() => setValue("addressType", "work")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 border transition-all text-xs tracking-[0.1em] uppercase ${
                  selectedAddressType === "work"
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <HiOutlineBuildingOffice2 className="text-base" />
                Work
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 md:p-8 border-t border-neutral-100 flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors"
        >
          <HiArrowLeft className="text-sm" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          type="submit"
          disabled={!isValid}
          className={`flex items-center gap-3 px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all ${
            isValid 
              ? "bg-black text-white hover:bg-neutral-800" 
              : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <span>Continue to Payment</span>
          <HiArrowRight className="text-sm" />
        </button>
      </div>
    </motion.form>
  );
}
