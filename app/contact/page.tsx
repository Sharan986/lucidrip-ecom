"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { 
  HiCheck, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin,
  HiOutlineClock,
  HiArrowRight
} from "react-icons/hi2";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const contactInfo = [
  {
    icon: HiOutlineEnvelope,
    label: "Email",
    value: "hello@lucidrip.com",
    description: "We'll respond within 24 hours"
  },
  {
    icon: HiOutlinePhone,
    label: "Phone",
    value: "+91 98765 43210",
    description: "Mon-Fri, 9 AM - 6 PM IST"
  },
  {
    icon: HiOutlineMapPin,
    label: "Address",
    value: "Fashion District, Mumbai",
    description: "Maharashtra, India 400001"
  },
  {
    icon: HiOutlineClock,
    label: "Hours",
    value: "Mon - Sat: 10 AM - 8 PM",
    description: "Sunday: 12 PM - 6 PM"
  }
];

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

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/Hero/Contact.avif" 
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-neutral-900/50" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/70 mb-4">
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-6xl font-extralight text-white tracking-wide mb-4">
              Let's <span className="italic">Connect</span>
            </h1>
            <p className="text-sm md:text-base font-light text-white/80 max-w-md mx-auto">
              Have a question or just want to say hello? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">
                  Send a Message
                </p>
                <h2 className="text-2xl md:text-3xl font-extralight text-neutral-900">
                  Contact <span className="italic">Us</span>
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Your Name
                  </label>
                  <input
                    placeholder="Jane Smith"
                    className={`w-full border px-4 py-4 text-sm font-light focus:outline-none transition ${
                      errors.name 
                        ? "border-red-400 bg-red-50" 
                        : "border-neutral-200 focus:border-neutral-900"
                    }`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className={`w-full border px-4 py-4 text-sm font-light focus:outline-none transition ${
                      errors.email 
                        ? "border-red-400 bg-red-50" 
                        : "border-neutral-200 focus:border-neutral-900"
                    }`}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Subject
                  </label>
                  <input
                    placeholder="How can we help?"
                    className={`w-full border px-4 py-4 text-sm font-light focus:outline-none transition ${
                      errors.subject 
                        ? "border-red-400 bg-red-50" 
                        : "border-neutral-200 focus:border-neutral-900"
                    }`}
                    {...register("subject", { required: "Subject is required" })}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    className={`w-full border px-4 py-4 text-sm font-light focus:outline-none transition resize-none ${
                      errors.message 
                        ? "border-red-400 bg-red-50" 
                        : "border-neutral-200 focus:border-neutral-900"
                    }`}
                    {...register("message", { required: "Message is required" })}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`w-full py-4 text-xs tracking-[0.1em] uppercase transition-all flex items-center justify-center gap-2 ${
                    isSuccess 
                      ? "bg-emerald-600 text-white" 
                      : isSubmitting 
                        ? "bg-neutral-300 text-neutral-500 cursor-wait" 
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <HiCheck className="w-4 h-4" /> Message Sent
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border border-neutral-500 border-t-transparent animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <HiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">
                  Information
                </p>
                <h2 className="text-2xl md:text-3xl font-extralight text-neutral-900">
                  Find <span className="italic">Us</span>
                </h2>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 p-6 border border-neutral-200 hover:border-neutral-400 transition-colors"
                    >
                      <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                          {info.label}
                        </p>
                        <p className="text-sm font-light text-neutral-900 mb-1">
                          {info.value}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {info.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 relative aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden"
              >
                <Image
                  src="/Hero/NZ.avif"
                  alt="Store Location"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-6 py-3 border border-neutral-200">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      Visit Our Store
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 px-4 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-4">
              Quick Answers
            </p>
            <h3 className="text-xl md:text-2xl font-extralight text-neutral-900 mb-6">
              Looking for <span className="italic">common questions</span>?
            </h3>
            <a 
              href="/account/support"
              className="inline-flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 transition underline underline-offset-4"
            >
              Visit our Help Center
              <HiArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
