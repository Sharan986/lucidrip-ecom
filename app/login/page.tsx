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
  HiArrowRight,
  HiEye,
  HiEyeSlash,
  HiExclamationCircle
} from "react-icons/hi2";

// 1. Validation Schema
const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [socialToast, setSocialToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // 2. Initialize Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleSocialLogin = () => {
    setSocialToast(true);
    setTimeout(() => setSocialToast(false), 3000);
  };

  // 3. Submit Handler
  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    setIsLoading(true);
    
    const success = await login(data.email, data.password);
    
    if (success) {
      router.push("/");
    } else {
      setServerError(authError || "Invalid email or password.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/Hero/About.avif"
          alt="Fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/40" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <Link href="/" className="text-2xl font-extralight tracking-[0.3em] uppercase">
            LuciDrip
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-md"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4">Welcome Back</p>
            <h2 className="text-4xl font-extralight leading-relaxed mb-4">
              Discover your <span className="italic">personal</span> style.
            </h2>
            <p className="text-sm font-light text-white/70 leading-relaxed">
              Sign in to access your account, track orders, and explore curated collections.
            </p>
          </motion.div>

          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">
            © {new Date().getFullYear()} LuciDrip. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Account</p>
            <h1 className="text-3xl font-extralight text-neutral-900">Sign <span className="italic">In</span></h1>
          </div>

          {/* Error Display */}
          {(serverError || errors.email || errors.password) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border border-red-200 bg-red-50 flex items-center gap-3"
            >
              <HiExclamationCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-red-600 font-light">
                {serverError || errors.email?.message || errors.password?.message}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-neutral-200'} pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-neutral-900 transition`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-neutral-200'} pl-12 pr-12 py-4 text-sm font-light focus:outline-none focus:border-neutral-900 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" size-xs className="text-xs font-light text-neutral-500 hover:text-neutral-900 transition underline underline-offset-4">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-neutral-900 text-white text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:bg-neutral-300"
            >
              {isLoading ? (
                <div className="w-4 h-4 border border-white border-t-transparent animate-spin" />
              ) : (
                <>Sign In <HiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Social Login Section */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">Or continue with</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon="google" onClick={handleSocialLogin} label="Google" />
            <SocialButton icon="apple" onClick={handleSocialLogin} label="Apple" />
          </div>

          <AnimatePresence>
            {socialToast && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 p-3 bg-neutral-100 text-center text-xs text-neutral-600">
                Social login coming soon!
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-10 text-center text-sm font-light text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-700 transition">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Social Button Component
function SocialButton({ icon, onClick, label }: { icon: string, onClick: () => void, label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-center gap-2 py-4 border border-neutral-200 hover:border-neutral-400 transition">
      {icon === "google" ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="#000" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )}
      <span className="text-xs font-light text-neutral-700">{label}</span>
    </button>
  );
}