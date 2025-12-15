"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form"; 
import { HiOutlineArrowRight, HiExclamationCircle } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc"; 
import { FaApple } from "react-icons/fa";

// 1. Define Form Types
type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  // 2. Initialize Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginInputs>();

  // 3. Handle Login
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log("Login Data:", data);

    // SIMULATE API CALL
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Redirect to Dashboard
    router.push("/account"); 
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* --- LEFT SIDE: BRAND IMAGE --- */}
      <div className="hidden lg:block relative w-1/2 bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        {/* Different image than Signup to distinguish pages */}
        <Image 
          src="/Hero/HeroImg.avif"
          alt="Streetwear Vibe"
          fill
          className="object-cover "
          priority
        />
        <div className="absolute bottom-0 left-0 p-12 z-20 text-white">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Welcome Back.</h2>
          <p className="text-zinc-300 max-w-md font-medium">
            Continue your journey. Your cart and wishlist are waiting for you.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black text-black uppercase tracking-tight mb-2">Member Login</h1>
            <p className="text-gray-500 font-medium">Please enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            
            {/* EMAIL FIELD */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider ml-1">Email Address</label>
              <input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-white border rounded-xl px-4 py-4 font-medium focus:outline-none focus:ring-1 transition placeholder-gray-300 ${
                  errors.email 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-black focus:ring-black"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                  <HiExclamationCircle /> {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-black hover:text-zinc-600 underline underline-offset-2">
                  Forgot Password?
                </Link>
              </div>
              
              <input 
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white border rounded-xl px-4 py-4 font-medium focus:outline-none focus:ring-1 transition placeholder-gray-300 text-lg tracking-widest ${
                  errors.password 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-black focus:ring-black"
                }`}
              />
               {errors.password && (
                 <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                   <HiExclamationCircle /> {errors.password.message}
                 </p>
               )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Log In <HiOutlineArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition font-bold text-sm text-gray-700">
              <FcGoogle className="text-xl" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition font-bold text-sm text-gray-700">
              <FaApple className="text-xl" /> Apple
            </button>
          </div>

          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-black font-bold underline underline-offset-4 hover:text-zinc-700">
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}