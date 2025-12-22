"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiCheck,
  HiArrowRight,
  HiPrinter,
  HiTruck,
  HiCreditCard,
  HiEnvelope,
} from "react-icons/hi2";
import { useCheckoutStore } from "@/store/checkoutStore";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { currentOrder } = useCheckoutStore();

  useEffect(() => {
    // If no order exists, redirect to home
    if (!currentOrder) {
      router.replace("/");
    }
  }, [currentOrder, router]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to calculate estimated delivery
  const getEstimatedDelivery = () => {
    return "5-7 Business Days";
  };

  // Transform the order for display
  const order = currentOrder ? {
    orderId: currentOrder.orderNumber,
    date: formatDate(currentOrder.createdAt),
    email: currentOrder.shippingAddress.email,
    items: currentOrder.items.map((item, index) => ({
      id: index,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "N/A",
      color: item.color || "N/A",
      image: item.image || "/Hero/Product1.avif",
    })),
    subtotal: currentOrder.subtotal,
    shipping: currentOrder.shippingCost,
    tax: currentOrder.tax,
    total: currentOrder.totalAmount,
    shippingAddress: {
      fullName: currentOrder.shippingAddress.name,
      address: currentOrder.shippingAddress.street,
      city: currentOrder.shippingAddress.city,
      state: currentOrder.shippingAddress.state,
      pincode: currentOrder.shippingAddress.zip,
      phone: currentOrder.shippingAddress.phone,
    },
    paymentMethod: currentOrder.paymentMethod,
    paymentStatus: currentOrder.paymentStatus,
    estimatedDelivery: getEstimatedDelivery(),
  } : null;

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border border-neutral-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-neutral-50">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border-b border-neutral-200"
        >
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-8 border-2 border-emerald-600 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <HiCheck className="w-10 h-10 text-emerald-600" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">
                Order Confirmed
              </p>
              <h1 className="text-3xl md:text-4xl font-extralight tracking-wide mb-4">
                Thank you for your <span className="italic">order</span>
              </h1>
              <p className="text-sm font-light text-neutral-600 max-w-md mx-auto">
                We&apos;ve received your order and will begin processing it shortly.
                A confirmation email has been sent to your inbox.
              </p>
            </motion.div>

            {/* Order ID Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 inline-flex items-center gap-3 border border-neutral-200 px-6 py-3 bg-neutral-50"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                Order Number
              </span>
              <span className="text-sm font-medium tracking-wide">
                {order.orderId}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="print-area grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-neutral-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                    <HiTruck className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      Delivery Details
                    </p>
                    <p className="text-sm font-light">
                      Estimated: {order.estimatedDelivery}
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <p className="text-sm font-medium mb-2">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed">
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.pincode}
                    <br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </motion.div>

              {/* Payment Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                      <HiCreditCard className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                        Payment Method
                      </p>
                      <p className="text-sm font-light">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    order.paymentStatus === "Paid" ? "text-emerald-600" : 
                    order.paymentStatus === "Pending" ? "text-amber-600" : "text-neutral-600"
                  }`}>
                    <HiCheck className="w-4 h-4" />
                    <span className="text-xs font-medium">{order.paymentStatus}</span>
                  </div>
                </div>
              </motion.div>

              {/* Email Notification */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-neutral-100 border border-neutral-200 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-neutral-200 flex items-center justify-center">
                    <HiEnvelope className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-sm font-light">
                      Confirmation sent to{" "}
                      <span className="font-medium">{order.email}</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Check your inbox for order updates
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white border border-neutral-200"
              >
                <div className="p-6 border-b border-neutral-100">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Items Ordered ({order.items.length})
                  </p>
                </div>

                <div className="divide-y divide-neutral-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex gap-4">
                      <div className="w-20 h-24 bg-neutral-100 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1">{item.name}</p>
                        <p className="text-xs text-neutral-500 mb-2">
                          Size: {item.size} · Color: {item.color}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-neutral-200 p-6 sticky top-24"
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-6">
                  Order Summary
                </p>

                <div className="space-y-3 text-sm font-light">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-emerald-600 italic">
                      {order.shipping === 0 ? "Complimentary" : `₹${order.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (GST)</span>
                    <span>₹{order.tax.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 mt-6 pt-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      Total Paid
                    </span>
                    <span className="text-xl font-light">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Order Date */}
                <div className="border-t border-neutral-100 mt-6 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Order Date</span>
                    <span className="font-light">{order.date}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-12 no-print"
          >
            <Link href="/products" className="flex-1">
              <button className="w-full bg-neutral-900 text-white py-4 px-8 text-sm tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group">
                Continue Shopping
                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <button
              onClick={handlePrint}
              className="flex-1 border border-neutral-300 py-4 px-8 text-sm tracking-[0.1em] uppercase hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <HiPrinter className="w-4 h-4" />
              Print Receipt
            </button>
          </motion.div>

          {/* Track Order Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 no-print"
          >
            <Link
              href={`/account/orders/${currentOrder?._id || order.orderId}`}
              className="text-sm font-light text-neutral-600 hover:text-neutral-900 transition-colors underline underline-offset-4"
            >
              Track your order status
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-neutral-200 py-12 mt-12 no-print">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-3">
              Need Help?
            </p>
            <p className="text-sm font-light text-neutral-600">
              Contact our customer service at{" "}
              <a
                href="mailto:support@store.com"
                className="underline underline-offset-4 hover:text-neutral-900"
              >
                support@store.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
