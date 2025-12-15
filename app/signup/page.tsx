"use client";


import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form"; // 👈 Import Hook Form
import { HiOutlineArrowRight, HiExclamationCircle } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc"; 
import { FaApple } from "react-icons/fa";

// 1. Define Form Types
type SignupInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();

  // 2. Initialize Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<SignupInputs>();

  // 3. Handle Real Submission
  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    // Data is already validated here
    console.log("Form Data:", data);

    // SIMULATE API CALL
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Normally you'd redirect to dashboard or trigger verification
    router.push("/account"); 
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* --- LEFT SIDE: BRAND IMAGE --- */}
      <div className="hidden lg:block relative w-1/2 bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <Image 
          src="/Hero/About@.avif"
          alt="Streetwear Aesthetic"
          fill
          className="object-cover "
          priority
        />
        <div className="absolute bottom-0 left-0 p-12 z-20 text-white">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Join the Movement.</h2>
          <p className="text-zinc-300 max-w-md font-medium">
            Get exclusive access to limited drops, early sale access, and member-only rewards.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: SIGNUP FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black text-black uppercase tracking-tight mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium">Enter your details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            
            {/* NAME FIELD */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider ml-1">Full Name</label>
              <input 
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Sumit Kumar"
                className={`w-full bg-white border rounded-xl px-4 py-4 font-medium focus:outline-none focus:ring-1 transition placeholder-gray-300 ${
                  errors.name 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-black focus:ring-black"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                  <HiExclamationCircle /> {errors.name.message}
                </p>
              )}
            </div>

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
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider ml-1">Password</label>
              <input 
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white border rounded-xl px-4 py-4 font-medium focus:outline-none focus:ring-1 transition placeholder-gray-300 text-lg tracking-widest ${
                  errors.password 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-black focus:ring-black"
                }`}
              />
               {errors.password ? (
                 <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                   <HiExclamationCircle /> {errors.password.message}
                 </p>
               ) : (
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-2 ml-1">Must be at least 8 characters</p>
               )}
            </div>

           {/* CONFIRM PASSWORD FIELD */}
<div className="space-y-1">
  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider ml-1">
    Confirm Password
  </label>

  <input
    {...register("confirmPassword", {
      required: "Please confirm your password",
      validate: (value) =>
        value === watch("password") || "Passwords do not match",
    })}
    type="password"
    placeholder="••••••••"
    className={`w-full bg-white border rounded-xl px-4 py-4 font-medium focus:outline-none focus:ring-1 transition placeholder-gray-300 text-lg tracking-widest ${
      errors.confirmPassword
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-200 focus:border-black focus:ring-black"
    }`}
  />

  {errors.confirmPassword ? (
    <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
      <HiExclamationCircle /> {errors.confirmPassword.message}
    </p>
  ) : (
    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-2 ml-1">
      Must match the password
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
                  Create Account <HiOutlineArrowRight />
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
            Already have an account?{" "}
            <Link href="/login" className="text-black font-bold underline underline-offset-4 hover:text-zinc-700">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}