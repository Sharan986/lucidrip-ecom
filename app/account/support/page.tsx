"use client";

import React, { useState, useRef } from "react";
import { 
  HiOutlineLifebuoy, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineEnvelope, 
  HiMagnifyingGlass, 
  HiOutlineTicket,
  HiChevronDown,
  HiPlus,
  HiXMark,
  HiOutlineShoppingBag,
  HiOutlineCurrencyRupee,
  HiOutlineArrowPathRoundedSquare,
  HiArrowUpTray, // 👈 1. CHANGED THIS (Fixed Import)
  HiCheckCircle,
  HiOutlineExclamationCircle
} from "react-icons/hi2";

// --- DUMMY DATA ---
const FAQ_CATEGORIES = [
  { id: "orders", label: "Orders & Shipping", icon: HiOutlineShoppingBag },
  { id: "returns", label: "Returns & Refunds", icon: HiOutlineArrowPathRoundedSquare },
  { id: "payments", label: "Payments & Offers", icon: HiOutlineCurrencyRupee },
  { id: "account", label: "Account Settings", icon: HiOutlineLifebuoy },
];

const FAQ_DATA = [
  { id: 1, catId: "orders", q: "Where is my order?", a: "You can track your order status in the 'Orders' section. Once shipped, you will receive a tracking link via email/SMS." },
  { id: 2, catId: "returns", q: "How do I return an item?", a: "We offer a 7-day return policy. Go to 'Orders', select the item, and click 'Request Return'. Pickup is within 48 hours." },
  { id: 3, catId: "payments", q: "Payment failed but money deducted?", a: "If the order wasn't generated, the amount will be auto-refunded to your source account within 5-7 business days." },
  { id: 4, catId: "orders", q: "Can I change my address?", a: "You can change the address before the item is shipped by contacting support. After shipping, it cannot be changed." },
];

const RECENT_ORDERS = [
  { id: "ORD-8821", date: "Dec 14", items: "Oversized Hoodie, Beige Knit", total: "₹4,398" },
  { id: "ORD-8819", date: "Nov 20", items: "Urban Cargo Sweatshirt", total: "₹2,100" },
];

const ISSUE_TYPES = {
  "Orders & Shipping": ["Where is my order?", "Item marked delivered but not received", "Wrong item received", "Package arrived damaged"],
  "Returns & Refunds": ["Request a return", "Refund status", "Exchange size/color", "Item defective"],
  "Payments": ["Payment failed", "Double deduction", "Invoice request", "Coupon code issue"],
  "Other": ["Account issue", "Technical bug", "Feedback", "Other"]
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"help" | "tickets">("help");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  
  // Ticket State
  const [tickets, setTickets] = useState([{ id: "TKT-9901", subject: "Wrong size received", category: "Returns & Refunds", date: "Dec 10", status: "Open" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [category, setCategory] = useState("Orders & Shipping");
  const [specificIssue, setSpecificIssue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC ---
  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.catId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const createdTicket = {
        id: ticketId,
        subject: specificIssue || "Support Request",
        category: category,
        date: today,
        status: "Open"
      };
      setTickets([createdTicket, ...tickets]); 
      setIsSubmitting(false);
      setIsModalOpen(false);
      // Reset form
      setCategory("Orders & Shipping");
      setSpecificIssue("");
      setSelectedOrder("");
      setDescription("");
      setAttachment(null);
      setActiveTab("tickets");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* HEADER */}
      <div className="bg-gray-50 border-b border-gray-100 py-16 text-center px-4">
         <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">How can we help?</h1>
         <div className="max-w-2xl mx-auto relative">
            <HiMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 shadow-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition text-base font-medium"
            />
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8">
        
        {/* TABS */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 inline-flex gap-2 mb-12">
           <button onClick={() => setActiveTab("help")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "help" ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>Help Center</button>
           <button onClick={() => setActiveTab("tickets")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "tickets" ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>My Tickets</button>
        </div>

        {/* VIEW: HELP CENTER */}
        {activeTab === "help" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {FAQ_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setSelectedCategory(isActive ? "all" : cat.id)} className={`p-6 rounded-2xl border text-left transition-all ${isActive ? "border-black bg-gray-900 text-white" : "border-gray-200 bg-white hover:border-gray-400"}`}>
                       <Icon className={`text-2xl mb-3 ${isActive ? "text-white" : "text-gray-900"}`} />
                       <p className="font-bold text-sm">{cat.label}</p>
                    </button>
                  )
                })}
             </div>

             <div className="max-w-3xl mx-auto space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-100">
                     <button onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)} className="w-full flex justify-between items-center py-5 text-left group">
                        <span className="font-bold text-gray-900 group-hover:text-gray-600 transition">{faq.q}</span>
                        <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all ${openFaqId === faq.id ? "bg-black border-black text-white rotate-180" : "bg-white text-gray-400"}`}><HiChevronDown /></div>
                     </button>
                     <div className={`overflow-hidden transition-all duration-300 ${openFaqId === faq.id ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                        <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-2">Still need help?</h3>
                <div className="flex justify-center gap-4 mt-6">
                   <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition shadow-lg"><HiOutlineTicket /> Raise a Ticket</button>
                </div>
             </div>
          </div>
        )}

        {/* VIEW: TICKETS */}
        {activeTab === "tickets" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <tr><th className="py-4 px-6">ID</th><th className="py-4 px-6 w-1/2">Subject</th><th className="py-4 px-6">Date</th><th className="py-4 px-6 text-right">Status</th></tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {tickets.map((t) => (
                         <tr key={t.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="py-5 px-6 font-mono text-xs font-bold text-gray-500">{t.id}</td>
                            <td className="py-5 px-6"><p className="font-bold text-gray-900 text-sm">{t.subject}</p><p className="text-xs text-gray-400 mt-0.5">{t.category}</p></td>
                            <td className="py-5 px-6 text-xs text-gray-500 font-medium">{t.date}</td>
                            <td className="py-5 px-6 text-right"><span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-200 bg-green-100 text-green-700">{t.status}</span></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

      </div>

      {/* =========================================
          INDUSTRY STANDARD TICKET MODAL
      ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-hide">
              
              <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Submit Request</h3>
                 <button onClick={() => setIsModalOpen(false)}><HiXMark className="text-xl" /></button>
              </div>

              <form onSubmit={handleSubmitTicket} className="p-8 space-y-6">
                 
                 {/* 1. Category Selection */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">What can we help with?</label>
                    <select 
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setSpecificIssue(""); }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold text-gray-900 focus:border-black transition"
                    >
                       {Object.keys(ISSUE_TYPES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                 </div>

                 {/* 2. Specific Issue (Dynamic) */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Select Issue Details</label>
                    <select 
                      value={specificIssue}
                      onChange={(e) => setSpecificIssue(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 focus:border-black transition"
                      required
                    >
                       <option value="">Select a reason...</option>
                       {ISSUE_TYPES[category as keyof typeof ISSUE_TYPES].map(issue => (
                          <option key={issue} value={issue}>{issue}</option>
                       ))}
                    </select>
                 </div>

                 {/* 3. Smart Order Selector (Only shows for Orders/Returns) */}
                 {(category === "Orders & Shipping" || category === "Returns & Refunds") && (
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Which order is this about?</label>
                       <div className="grid gap-3 max-h-40 overflow-y-auto scrollbar-hide">
                          {RECENT_ORDERS.map(order => (
                             <div 
                               key={order.id} 
                               onClick={() => setSelectedOrder(order.id)}
                               className={`p-3 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${selectedOrder === order.id ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                             >
                                <div>
                                   <p className="text-xs font-bold text-gray-900">#{order.id} • <span className="font-normal text-gray-500">{order.date}</span></p>
                                   <p className="text-[10px] text-gray-500 truncate w-48">{order.items}</p>
                                </div>
                                {selectedOrder === order.id && <HiCheckCircle className="text-black text-xl" />}
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* 4. Description */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Additional Details</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Please describe the issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:border-black transition resize-none"
                    />
                 </div>

                 {/* 5. File Upload (For Evidence) */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Attachments (Optional)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition bg-gray-50"
                    >
                       <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                       {attachment ? (
                          <div className="flex items-center justify-center gap-2 text-sm font-bold text-black">
                             <HiCheckCircle className="text-green-500" /> {attachment.name}
                          </div>
                       ) : (
                          <div className="flex flex-col items-center gap-1 text-gray-400">
                             <HiArrowUpTray className="text-2xl" /> {/* 👈 2. USED CORRECT ICON HERE */}
                             <span className="text-xs font-medium">Click to upload photo or screenshot</span>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Submit */}
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full bg-black text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-zinc-800 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                 >
                    {isSubmitting ? (
                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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