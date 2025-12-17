"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore"; 
import { 
  HiCheckCircle, 
  HiOutlinePrinter, 
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";

// --- MOCK DATA ---
const MOCK_LAST_ORDER = {
  id: "ORD-8821-XJ",
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  email: "sumit@example.com",
  items: [
    { id: 1, name: "Oversized Street Hoodie", price: 2499, img: "/Hero/Product1.avif", qty: 1 },
    { id: 2, name: "Classic Beige Knit", price: 1899, img: "/Hero/Product2.avif", qty: 1 },
  ],
  totals: { subtotal: 4398, shipping: 0, tax: 210, total: 4608 },
  shipping: {
    name: "Sumit Kumar",
    address: "Flat 402, Sunshine Apts, Indiranagar",
    city: "Bangalore, KA 560038"
  }
};

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      {/* This style tag forces browsers to print background graphics 
        if the user checks that setting, but our design works without it.
      */}
      <style jsx global>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Main Container: 
          On Screen: Split Row
          On Print: Vertical Block, White Background
      */}
      <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans print:block print:bg-white print:h-auto print:min-h-0">
        
        {/* --- PRINT ONLY HEADER (Hidden on Screen) --- */}
        <div className="hidden print:flex justify-between items-center p-8 border-b border-black">
            <div>
               <h1 className="text-2xl font-black uppercase tracking-tighter">LUXE STORE</h1>
               <p className="text-xs font-mono uppercase">Official Tax Invoice</p>
            </div>
            <div className="text-right">
               <p className="text-sm font-bold">Order #{MOCK_LAST_ORDER.id}</p>
               <p className="text-xs text-gray-500">{MOCK_LAST_ORDER.date}</p>
            </div>
        </div>

        {/* =========================================
            LEFT COLUMN: CONFIRMATION & DETAILS
        ========================================= */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center print:p-8 print:block">
          <div className="max-w-xl mx-auto w-full print:max-w-none">
            
            {/* Success Header (Hidden on Print to save ink/space) */}
            <div className="mb-10 print:hidden">
              <div className="inline-flex items-center gap-2 text-green-600 mb-4 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                 <HiCheckCircle className="text-xl" />
                 <span className="text-xs font-bold uppercase tracking-widest">Order Confirmed</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
                Thanks for your order, {MOCK_LAST_ORDER.shipping.name.split(' ')[0]}!
              </h1>
              <p className="text-zinc-500">
                We've sent a confirmation email to <span className="text-zinc-900 font-bold">{MOCK_LAST_ORDER.email}</span>.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="border border-zinc-200 rounded-2xl p-6 mb-8 bg-zinc-50/50 print:border-none print:bg-transparent print:p-0 print:mb-4">
               
               {/* Print Only: Title for details */}
               <h3 className="hidden print:block text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">Customer Details</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                  <div>
                     <div className="flex items-center gap-2 mb-2 print:hidden">
                        <HiOutlineMapPin className="text-zinc-400" />
                        <p className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Shipping To</p>
                     </div>
                     {/* Print Version Label */}
                     <p className="hidden print:block text-xs font-bold uppercase text-zinc-500 mb-1">Ship To:</p>
                     
                     <p className="text-sm text-zinc-900 font-bold">{MOCK_LAST_ORDER.shipping.name}</p>
                     <p className="text-sm text-zinc-600">{MOCK_LAST_ORDER.shipping.address}</p>
                     <p className="text-sm text-zinc-600">{MOCK_LAST_ORDER.shipping.city}</p>
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-2 print:hidden">
                        <HiOutlineCreditCard className="text-zinc-400" />
                        <p className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Payment Method</p>
                     </div>
                      {/* Print Version Label */}
                     <p className="hidden print:block text-xs font-bold uppercase text-zinc-500 mb-1">Payment:</p>

                     <p className="text-sm text-zinc-900 font-medium">Visa ending in 4242</p>
                     <p className="text-xs text-zinc-500 mt-1">Processed securely</p>
                  </div>
               </div>
            </div>

            {/* Actions (Hidden on Print) */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
               <Link href="/" className="flex-1 bg-black text-white text-center py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl">
                  Continue Shopping
               </Link>
               <button onClick={() => window.print()} className="flex-1 border border-zinc-200 text-zinc-900 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                  <HiOutlinePrinter className="text-lg" /> Print Receipt
               </button>
            </div>

            {/* Support Link (Hidden on Print) */}
            <div className="mt-8 text-center sm:text-left print:hidden">
               <button className="text-xs font-bold text-zinc-400 hover:text-black flex items-center gap-2 transition-colors">
                  <HiOutlineChatBubbleLeftRight /> Need help? Contact Support
               </button>
            </div>

          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: ORDER SUMMARY (Receipt)
        ========================================= */}
        <div className="w-full lg:w-[450px] bg-zinc-50 border-l border-zinc-200 p-8 lg:p-20 print:w-full print:border-none print:bg-white print:p-8 print:pt-0">
           <div className="max-w-md mx-auto sticky top-20 print:static print:max-w-none">
              
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2 print:border-b print:pb-2 print:mb-4">
                 <HiOutlineShoppingBag className="print:hidden" /> Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-8 print:mb-4">
                 {MOCK_LAST_ORDER.items.map((item) => (
                    <div key={item.id} className="flex gap-4 print:border-b print:border-zinc-100 print:pb-2">
                       {/* Hide Images on Print to look like a pro invoice, or keep them small */}
                       <div className="relative w-16 h-20 bg-zinc-200 rounded-md overflow-hidden border border-zinc-300 print:hidden">
                          <Image src={item.img} alt={item.name} fill className="object-cover" />
                          <span className="absolute top-0 right-0 bg-zinc-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
                             x{item.qty}
                          </span>
                       </div>
                       {/* Print Quantity explicitly */}
                       <div className="hidden print:block w-8 pt-1 text-sm font-bold">
                          {item.qty}x
                       </div>

                       <div className="flex-1">
                          <p className="text-sm font-bold text-zinc-900 leading-tight">{item.name}</p>
                          <p className="text-sm font-mono text-zinc-500 mt-1">₹{item.price.toLocaleString()}</p>
                       </div>
                       
                       {/* Print specific total for line item */}
                       <div className="hidden print:block text-sm font-mono font-bold">
                          ₹{(item.price * item.qty).toLocaleString()}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="border-t border-zinc-200 pt-6 space-y-3 print:pt-2">
                 <div className="flex justify-between text-sm text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{MOCK_LAST_ORDER.totals.subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm text-zinc-500">
                    <span>Shipping</span>
                    <span className="font-mono">{MOCK_LAST_ORDER.totals.shipping === 0 ? "Free" : `₹${MOCK_LAST_ORDER.totals.shipping}`}</span>
                 </div>
                 <div className="flex justify-between text-sm text-zinc-500">
                    <span>Tax (GST)</span>
                    <span className="font-mono">₹{MOCK_LAST_ORDER.totals.tax.toLocaleString()}</span>
                 </div>
                 
                 <div className="border-t border-zinc-200 pt-4 flex justify-between items-center print:border-black print:mt-4">
                    <span className="font-black text-lg text-zinc-900 uppercase tracking-tight">Total</span>
                    <span className="font-mono text-xl font-bold text-zinc-900">₹{MOCK_LAST_ORDER.totals.total.toLocaleString()}</span>
                 </div>
              </div>
              
              {/* Print Only Footer */}
              <div className="hidden print:block mt-12 text-center text-xs text-zinc-400 font-mono pt-8 border-t">
                  <p>Thank you for shopping with Luxe Store.</p>
                  <p>www.luxestore.com | support@luxestore.com</p>
              </div>

           </div>
        </div>

      </div>
    </>
  );
}