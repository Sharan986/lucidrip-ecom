"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiOutlineLockClosed, HiOutlineUser, HiExclamationCircle } from "react-icons/hi2";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

// 1. Define the Validation Schema
const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdminAuthenticated, adminLogin, error, isLoading, clearError } = useAdminAuthStore();

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push("/admin");
    }
  }, [isAdminAuthenticated, router]);

  // 3. Handle Form Submission
  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await adminLogin(data.username, data.password);
    if (success) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white mb-6">
            <span className="text-neutral-950 text-2xl font-bold">L</span>
          </div>
          <h1 className="text-white text-xl tracking-[0.3em] uppercase font-light">
            LuciDrip
          </h1>
          <p className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase mt-2">
            Admin Portal
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-8">
          <div className="text-center mb-8">
            <h2 className="text-white text-lg font-light">
              Admin <span className="italic">Access</span>
            </h2>
            <p className="text-neutral-500 text-xs mt-2">
              Enter your admin credentials to continue
            </p>
          </div>

          {/* Global Store Error or Validation Errors */}
          {(error || errors.username || errors.password) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <HiExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-xs">
                {error || errors.username?.message || errors.password?.message}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-3">
                Username
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  {...register("username")} // 4. Register Input
                  type="text"
                  placeholder="Enter username"
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-950 border ${
                    errors.username ? "border-red-500/50" : "border-neutral-800"
                  } text-white text-sm font-light placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-3">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  {...register("password")} // 4. Register Input
                  type="password"
                  placeholder="Enter password"
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-950 border ${
                    errors.password ? "border-red-500/50" : "border-neutral-800"
                  } text-white text-sm font-light placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white text-neutral-900 text-xs tracking-[0.15em] uppercase font-medium hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-[10px] tracking-[0.1em]">
              SECURE ADMIN ACCESS ONLY
            </p>
          </div>
        </div>

        <p className="text-center text-neutral-600 text-[10px] mt-8 tracking-[0.1em]">
          © 2024 LuciDrip. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}