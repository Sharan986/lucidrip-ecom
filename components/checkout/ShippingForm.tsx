"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { useCheckoutStore } from "@/store/checkoutStore";

// Icons
import { 
  HiOutlineHome, 
  HiOutlineBuildingLibrary, 
  HiOutlineMapPin, 
  HiArrowLeft, 
  HiArrowRight,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiOutlineMap,
  HiExclamationCircle
} from "react-icons/hi2";

// Define the Form Data Shape
type ShippingFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  addressType: "home" | "work";
};

export default function ShippingForm() {
  const { setShipping, shipping } = useCheckoutStore();
  const { nextStep, prevStep } = useCheckoutStepStore();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    mode: "onChange", // Validate on keystroke for immediate feedback
    defaultValues: {
      name: shipping.name || "",
      email: shipping.email || "",
      phone: shipping.phone || "",
      address: shipping.address || "",
      city: shipping.city || "",
      state: shipping.state || "",
      pincode: shipping.pincode || "",
      addressType: (shipping.addressType as "home" | "work") || "home",
    },
  });

  // Watch addressType to update the UI buttons
  const selectedAddressType = watch("addressType");

  // Handle Form Submission
  const onSubmit: SubmitHandler<ShippingFormData> = (data) => {
    // 1. Sync data to Global Store
    setShipping(data);
    // 2. Move to next step
    nextStep();
  };

  // Helper to style inputs based on error state
  const inputClass = (hasError: boolean) => `
    w-full bg-gray-50 border text-gray-900 text-sm rounded-xl block pl-12 p-4 outline-none transition-all placeholder-gray-400
    ${hasError 
      ? "border-red-500 focus:ring-2 focus:ring-red-200" 
      : "border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent"
    }
  `;

  return (
    // We wrap the main container in a <form> tag
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10"
    >
      
      {/* --- Header --- */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shipping Details</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Where should we deliver your order?
        </p>
      </div>

      <div className="space-y-8">
        
        {/* --- SECTION 1: CONTACT INFO --- */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Contact Information
          </h3>
          
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineUser className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Jane Doe"
                className={inputClass(!!errors.name)}
                {...register("name", { required: "Full name is required" })}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineEnvelope className="text-gray-400 text-lg" />
                </div>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className={inputClass(!!errors.email)}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format"
                    }
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlinePhone className="text-gray-400 text-lg" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  className={inputClass(!!errors.phone)}
                  {...register("phone", { 
                    required: "Phone number is required",
                    minLength: { value: 10, message: "Must be 10 digits" },
                    pattern: { value: /^[0-9]+$/, message: "Numbers only" }
                  })}
                  // Custom handler to strip non-digits while keeping RHF connected
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setValue("phone", val, { shouldValidate: true });
                  }}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* --- SECTION 2: ADDRESS DETAILS --- */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Address Details
          </h3>

          {/* Address Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Street Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineMapPin className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="123 Fashion Street, Apt 4B"
                className={inputClass(!!errors.address)}
                {...register("address", { required: "Address is required" })}
              />
            </div>
            {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* City Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">City</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineBuildingLibrary className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Mumbai"
                  className={inputClass(!!errors.city)}
                  {...register("city", { required: "City is required" })}
                />
              </div>
              {errors.city && <p className="text-xs text-red-500 mt-1 ml-1">{errors.city.message}</p>}
            </div>

            {/* State Field */}
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">State</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMap className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  className={inputClass(!!errors.state)}
                  {...register("state", { required: "State is required" })}
                />
              </div>
              {errors.state && <p className="text-xs text-red-500 mt-1 ml-1">{errors.state.message}</p>}
            </div>

            {/* Pincode Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Pincode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMapPin className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="400001"
                  className={inputClass(!!errors.pincode)}
                  {...register("pincode", { 
                    required: "Pincode is required",
                    minLength: { value: 6, message: "Invalid Pincode" },
                    pattern: { value: /^[0-9]+$/, message: "Numbers only" }
                  })}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setValue("pincode", val, { shouldValidate: true });
                  }}
                />
              </div>
              {errors.pincode && <p className="text-xs text-red-500 mt-1 ml-1">{errors.pincode.message}</p>}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: ADDRESS TYPE --- */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-700 ml-1">Address Type</label>
          <div className="flex gap-4">
            
            {/* We manually handle buttons to set value in RHF */}
            <button
              type="button" // Important: type="button" prevents form submission
              onClick={() => setValue("addressType", "home")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 ${
                selectedAddressType === "home"
                  ? "border-black bg-black text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <HiOutlineHome className="text-lg" />
              <span className="font-medium text-sm">Home</span>
            </button>

            <button
              type="button"
              onClick={() => setValue("addressType", "work")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 ${
                selectedAddressType === "work"
                  ? "border-black bg-black text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <HiOutlineBriefcase className="text-lg" />
              <span className="font-medium text-sm">Work / Office</span>
            </button>

          </div>
        </div>

      </div>

      {/* --- Footer / Navigation --- */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
        <button
          type="button" // Important: prevents submit
          onClick={prevStep}
          className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors px-2 py-2"
        >
          <HiArrowLeft />
          <span className="hidden sm:inline">Back to Cart</span>
          <span className="sm:hidden">Back</span>
        </button>

        <button
          type="submit" // Triggers onSubmit
          disabled={!isValid}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
            isValid 
              ? "bg-black hover:bg-gray-800 cursor-pointer" 
              : "bg-gray-300 cursor-not-allowed shadow-none"
          }`}
        >
          {/* Show warning icon if invalid, else arrow */}
          {!isValid && <HiExclamationCircle className="text-lg" />}
          <span>Proceed to Payment</span>
          {isValid && <HiArrowRight />}
        </button>
      </div>

    </form>
  );
}