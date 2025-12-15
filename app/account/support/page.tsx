"use client";

import React, { useState } from "react";
import { 
  HiOutlineLifebuoy, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineEnvelope, 
  HiMagnifyingGlass, 
  HiOutlineTicket,
  HiChevronDown,
  HiChevronUp,
  HiPlus,
  HiXMark
} from "react-icons/hi2";

// --- DUMMY DATA ---

const FAQ_DATA = [
  {
    id: 1,
    category: "Orders",
    question: "Where is my order?",
    answer: "You can track your order status in the 'Orders' section of your profile. Once shipped, you will receive a tracking link via email/SMS."
  },
  {
    id: 2,
    category: "Returns",
    question: "How do I return an item?",
    answer: "We offer a 7-day return policy. Go to 'Orders', select the item, and click 'Request Return'. A courier will pick it up within 48 hours."
  },
  {
    id: 3,
    category: "Payments",
    question: "My payment failed but money was deducted.",
    answer: "Don't worry! If the order wasn't generated, the amount will be auto-refunded to your source account within 5-7 business days."
  },
  {
    id: 4,
    category: "Account",
    question: "How do I change my shipping address?",
    answer: "Go to 'My Addresses' in your profile to add, edit, or delete saved addresses. You can also set a default address there."
  },
];

const INITIAL_TICKETS = [
  { id: "TKT-9901", subject: "Wrong size received", category: "Returns", date: "Dec 10, 2024", status: "Open" },
  { id: "TKT-8821", subject: "Payment issue", category: "Payments", date: "Nov 25, 2024", status: "Resolved" },
];

export default function SupportPage() {
  // State
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "Orders", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIC ---

  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const createdTicket = {
        id: ticketId,
        subject: newTicket.subject,
        category: newTicket.category,
        date: today,
        status: "Open"
      };

      setTickets([createdTicket, ...tickets]); 
      setIsSubmitting(false);
      setIsModalOpen(false);
      setNewTicket({ subject: "", category: "Orders", description: "" }); 
      alert("Ticket raised successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* 1️⃣ HERO & SEARCH (Industrial Dark Mode) */}
    

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2️⃣ FAQ SECTION */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* FAQ Accordion */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className={`bg-white border transition-all duration-300 rounded-xl overflow-hidden ${
                    openFaqId === faq.id ? "border-black shadow-md ring-1 ring-black" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full flex justify-between items-center p-5 text-left"
                  >
                    <span className={`font-bold transition-colors ${openFaqId === faq.id ? "text-black" : "text-gray-700"}`}>
                      {faq.question}
                    </span>
                    {openFaqId === faq.id ? <HiChevronUp /> : <HiChevronDown className="text-gray-400" />}
                  </button>
                  
                  <div 
                    className={`px-5 text-sm text-gray-500 leading-relaxed overflow-hidden transition-all duration-300 ${
                      openFaqId === faq.id ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Recent Tickets Table (Monochrome) */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                <HiOutlineTicket /> Ticket History
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition flex items-center gap-1 shadow-lg hover:-translate-y-0.5"
              >
                <HiPlus /> New Ticket
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 tracking-wider">
                    <th className="py-3 font-bold">ID</th>
                    <th className="py-3 font-bold">Subject</th>
                    <th className="py-3 font-bold">Date</th>
                    <th className="py-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                      <td className="py-4 font-mono font-medium text-gray-400 text-xs">{t.id}</td>
                      <td className="py-4 font-bold text-gray-900">{t.subject}</td>
                      <td className="py-4 text-gray-500 text-xs font-medium uppercase">{t.date}</td>
                      <td className="py-4 text-right">
                        {/* MONOCHROME STATUS BADGES */}
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          t.status === "Open" 
                            ? "bg-white text-black border-black" 
                            : "bg-black text-white border-black"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3️⃣ CONTACT CARDS (Monochrome Styles) */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-50 rounded-xl p-6 md:p-8 sticky top-24 space-y-6 border border-zinc-100">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Contact Us</h3>
            <p className="text-sm text-gray-500">Support available Mon-Sat, 10am - 7pm.</p>

            {/* Chat Option */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:border-black transition cursor-pointer group shadow-sm">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl group-hover:scale-105 transition">
                <HiOutlineChatBubbleLeftRight />
              </div>
              <div>
                <p className="font-bold text-gray-900">Live Chat</p>
                <p className="text-xs text-gray-500">Wait time: ~2 mins</p>
              </div>
            </div>

            {/* Email Option */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:border-black transition cursor-pointer group shadow-sm">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-black text-black flex items-center justify-center text-xl group-hover:scale-105 transition">
                <HiOutlineEnvelope />
              </div>
              <div>
                <p className="font-bold text-gray-900">Email Support</p>
                <p className="text-xs text-gray-500">Response within 24hrs</p>
              </div>
            </div>

         

          </div>
        </div>

      </div>

      {/* 4️⃣ RAISE TICKET MODAL (Clean UI) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900 uppercase tracking-tight">Raise New Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition">
                <HiXMark className="text-xl text-gray-900" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTicket} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                <div className="relative">
                  <select 
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 outline-none transition font-medium text-sm bg-white appearance-none"
                  >
                    <option>Orders</option>
                    <option>Returns & Refunds</option>
                    <option>Payments</option>
                    <option>Product Quality</option>
                    <option>Other</option>
                  </select>
                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Received wrong color"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 outline-none transition font-medium text-sm placeholder-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Describe your issue in detail..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 outline-none transition font-medium text-sm resize-none placeholder-gray-400"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-black font-bold text-white hover:bg-zinc-800 transition shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center uppercase tracking-wide text-sm"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}