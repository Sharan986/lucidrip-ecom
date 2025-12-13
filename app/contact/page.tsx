"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Data:", data);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const inputClasses = (hasError: boolean) => `
    w-full bg-[#F7F7F7] border border-transparent rounded-xl px-4 py-4 text-gray-700 outline-none transition-all
    focus:bg-white focus:ring-1 focus:ring-gray-300 placeholder-gray-400
    ${hasError ? "border-red-400 bg-red-50" : ""}
  `;

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <Image
          src="/Hero/Contact.avif" 
          alt="Fabric Texture"
          fill
          className="object-cover object-center brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Wear like a pro
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-lg drop-shadow-sm font-medium">
            You have questions about our products or our shop, or even just a message to say hi!
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT: FORM --- */}
          <div className="w-full order-1">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">
                Contact Us
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                We love to hear from our customers, so please feel free to contact us with any feedback or questions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Name</label>
                <div className="relative">
                  <input
                    placeholder="Jane Smith"
                    className={inputClasses(!!errors.name)}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <HiExclamationCircle className="absolute right-4 top-4 text-red-400 text-xl" />
                  )}
                </div>
                {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className={inputClasses(!!errors.email)}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                  {errors.email && (
                    <HiExclamationCircle className="absolute right-4 top-4 text-red-400 text-xl" />
                  )}
                </div>
                {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Your message</label>
                <textarea
                  rows={5}
                  placeholder="Write here..."
                  className={`${inputClasses(!!errors.message)} resize-none`}
                  {...register("message", { required: "Message cannot be empty" })}
                />
                {errors.message && <p className="text-xs text-red-500 ml-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5
                  ${isSuccess 
                    ? "bg-green-100 text-green-700 cursor-default" 
                    : isSubmitting 
                      ? "bg-[#D2B49F]/70 text-black/50 cursor-wait" 
                      : "bg-[#D2B49F] text-black hover:bg-[#c4a48e]"
                  }
                `}
              >
                {isSuccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <HiCheckCircle className="text-xl" /> Message Sent
                  </span>
                ) : isSubmitting ? (
                  "Sending..."
                ) : (
                  "Submit"
                )}
              </button>

            </form>
          </div>

          {/* --- RIGHT: IMAGE (Now Visible on Mobile) --- */}
          {/* order-2 ensures it comes after the form on mobile */}
          <div className="order-2 w-full relative h-[450px] lg:h-[700px] rounded-xl overflow-hidden shadow-lg mt-8 lg:mt-0">
            <Image
              src="/Hero/About@.avif" 
              alt="Fashion Editorial"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-[#D2B49F]/10 mix-blend-multiply" />
          </div>

        </div>
      </div>
    </div>
  );
}