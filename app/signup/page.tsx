"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineUser,
  HiArrowRight,
  HiEye,
  HiEyeSlash,
  HiCheck,
  HiExclamationCircle
} from "react-icons/hi2";

// 1. Validation Schema
const signupSchema = yup.object({
  name: yup.string().min(2, "Name is too short").required("Full name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup.string()
    .matches(/^[0-9+ ]+$/, "Invalid phone number")
    .min(10, "Phone number is too short")
    .required("Phone number is required"),
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain one uppercase letter")
    .matches(/[a-z]/, "Must contain one lowercase letter")
    .matches(/[0-9]/, "Must contain one number")
    .required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], "Passwords must match")
    .required("Please confirm your password"),
}).required();

type SignupFormData = yup.InferType<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { register: registerUser, error: authError } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialToast, setSocialToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // 2. Initialize Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: "onChange" // Allows real-time password requirement updates
  });

  // Watch password value for the real-time requirement checklist
  const watchedPassword = watch("password", "");

  const passwordChecks = {
    length: watchedPassword.length >= 8,
    uppercase: /[A-Z]/.test(watchedPassword),
    lowercase: /[a-z]/.test(watchedPassword),
    number: /[0-9]/.test(watchedPassword),
  };

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    setIsLoading(true);
    
    const success = await registerUser(data.name, data.email, data.password, data.phone);
    
    if (success) {
      router.push("/");
    } else {
      setServerError(authError || "Registration failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image src="/Hero/About@.avif" alt="Fashion" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/40" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <Link href="/" className="text-2xl font-extralight tracking-[0.3em] uppercase">LuciDrip</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="max-w-md">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4">Join Us</p>
            <h2 className="text-4xl font-extralight leading-relaxed mb-4">
              Begin your <span className="italic">fashion</span> journey.
            </h2>
            <p className="text-sm font-light text-white/70 leading-relaxed">
              Create an account to unlock exclusive access to new collections and members-only benefits.
            </p>
          </motion.div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">© {new Date().getFullYear()} LuciDrip.</p>
        </div>
      </div>

      {/* Right - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Create Account</p>
            <h1 className="text-3xl font-extralight text-neutral-900">Sign <span className="italic">Up</span></h1>
          </div>

          {/* Error Feedback */}
          {(serverError || Object.keys(errors).length > 0) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 border border-red-200 bg-red-50 flex items-start gap-3">
              <HiExclamationCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-600 font-light">
                {serverError || "Please check the form for errors."}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input {...register("name")} placeholder="Jane Smith" className={`w-full border ${errors.name ? 'border-red-400' : 'border-neutral-200'} pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-neutral-900 transition`} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input {...register("email")} type="email" placeholder="your@email.com" className={`w-full border ${errors.email ? 'border-red-400' : 'border-neutral-200'} pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-neutral-900 transition`} />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">#</span>
                <input {...register("phone")} type="tel" placeholder="+91 98765 43210" className={`w-full border ${errors.phone ? 'border-red-400' : 'border-neutral-200'} pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-neutral-900 transition`} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full border ${errors.password ? 'border-red-400' : 'border-neutral-200'} pl-12 pr-12 py-4 text-sm font-light focus:outline-none focus:border-neutral-900 transition`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Dynamic Requirement List */}
              <div className="pt-2 space-y-1">
                {Object.entries({
                  length: 'At least 8 characters',
                  uppercase: 'One uppercase letter',
                  lowercase: 'One lowercase letter',
                  number: 'One number'
                }).map(([key, label]) => (
                  <div key={key} className={`flex items-center gap-2 text-[10px] uppercase tracking-wider ${passwordChecks[key as keyof typeof passwordChecks] ? 'text-emerald-600' : 'text-neutral-400'}`}>
                    <div className={`w-3 h-3 border flex items-center justify-center ${passwordChecks[key as keyof typeof passwordChecks] ? 'border-emerald-600 bg-emerald-600' : 'border-neutral-300'}`}>
                      {passwordChecks[key as keyof typeof passwordChecks] && <HiCheck className="w-2 h-2 text-white" />}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={`w-full border ${errors.confirmPassword ? 'border-red-400' : 'border-neutral-200'} pl-12 pr-12 py-4 text-sm font-light focus:outline-none transition focus:border-neutral-900`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  {showConfirmPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:bg-neutral-300">
              {isLoading ? <div className="w-4 h-4 border border-white border-t-transparent animate-spin" /> : <>Create Account <HiArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Footer Links */}
          <p className="mt-8 text-center text-sm font-light text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-neutral-900 underline underline-offset-4">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}