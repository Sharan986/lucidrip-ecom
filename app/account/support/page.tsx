"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineQuestionMarkCircle, 
  HiOutlineChatBubbleLeftRight, 
  HiMagnifyingGlass, 
  HiOutlineTicket,
  HiChevronDown,
  HiPlus,
  HiXMark,
  HiOutlineShoppingBag,
  HiOutlineCurrencyRupee,
  HiOutlineArrowPath,
  HiArrowUpTray,
  HiCheck
} from "react-icons/hi2";

const FAQ_CATEGORIES = [
  { id: "orders", label: "Orders & Shipping", icon: HiOutlineShoppingBag },
  { id: "returns", label: "Returns & Refunds", icon: HiOutlineArrowPath },
  { id: "payments", label: "Payments & Offers", icon: HiOutlineCurrencyRupee },
  { id: "account", label: "Account Settings", icon: HiOutlineQuestionMarkCircle },
];

const FAQ_DATA = [
  { id: 1, catId: "orders", q: "Where is my order?", a: "You can track your order status in the 'Orders' section. Once shipped, you will receive a tracking link via email/SMS." },
  { id: 2, catId: "returns", q: "How do I return an item?", a: "We offer a 7-day return policy. Go to 'Orders', select the item, and click 'Request Return'. Pickup is within 48 hours." },
  { id: 3, catId: "payments", q: "Payment failed but money deducted?", a: "If the order wasn't generated, the amount will be auto-refunded to your source account within 5-7 business days." },
  { id: 4, catId: "orders", q: "Can I change my address?", a: "You can change the address before the item is shipped by contacting support. After shipping, it cannot be changed." },
  { id: 5, catId: "returns", q: "What is the return window?", a: "You have 7 days from delivery to initiate a return for most items. Some categories may have different policies." },
  { id: 6, catId: "account", q: "How do I update my profile?", a: "Go to Profile settings and click on the field you want to update. Don't forget to save your changes." },
];

const RECENT_ORDERS = [
  { id: "ORD-8821", date: "Dec 14", items: "Oversized Hoodie, Beige Knit", total: "₹4,398" },
  { id: "ORD-8819", date: "Nov 20", items: "Urban Cargo Sweatshirt", total: "₹2,100" },
];

const ISSUE_TYPES: { [key: string]: string[] } = {
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
  
  const [tickets, setTickets] = useState([{ id: "TKT-9901", subject: "Wrong size received", category: "Returns & Refunds", date: "Dec 10", status: "Open" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState("Orders & Shipping");
  const [specificIssue, setSpecificIssue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setCategory("Orders & Shipping");
      setSpecificIssue("");
      setSelectedOrder("");
      setDescription("");
      setAttachment(null);
      setActiveTab("tickets");
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
              Help Center
            </p>
            <h2 className="text-2xl font-extralight tracking-wide">
              How can we <span className="italic">help</span>?
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition"
          >
            <HiPlus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-6 border-b border-neutral-100">
          {[
            { id: "help", label: "Help Center" },
            { id: "tickets", label: "My Tickets" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "help" | "tickets")}
              className={`pb-4 text-sm font-light transition relative ${
                activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span 
                  layoutId="supportTab"
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Help Center Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "help" && (
          <motion.div
            key="help"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FAQ_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(isActive ? "all" : cat.id)} 
                    className={`p-5 border text-left transition-all ${
                      isActive 
                        ? "border-neutral-900 bg-neutral-900 text-white" 
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-3 ${isActive ? "text-white" : "text-neutral-600"}`} />
                    <p className="text-xs tracking-[0.05em]">{cat.label}</p>
                  </button>
                );
              })}
            </div>

            {/* FAQs */}
            <div className="bg-white border border-neutral-200">
              <div className="p-6 border-b border-neutral-100">
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                  Frequently Asked Questions
                </p>
              </div>
              <div className="divide-y divide-neutral-100">
                {filteredFaqs.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border-neutral-100">
                      <button
                        onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-neutral-50 transition"
                      >
                        <span className="text-sm font-light text-neutral-900">{faq.q}</span>
                        <HiChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${
                          openFaqId === faq.id ? "rotate-180" : ""
                        }`} />
                      </button>
                      <AnimatePresence>
                        {openFaqId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 pb-6 text-sm text-neutral-600 font-light leading-relaxed">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                    <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-sm font-light">Live Chat</p>
                    <p className="text-xs text-neutral-500">Available 9 AM - 9 PM</p>
                  </div>
                </div>
                <button className="w-full border border-neutral-200 py-3 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition">
                  Start Chat
                </button>
              </div>
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center">
                    <HiOutlineTicket className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-sm font-light">Email Support</p>
                    <p className="text-xs text-neutral-500">Response within 24 hours</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full border border-neutral-200 py-3 text-xs tracking-[0.1em] uppercase hover:border-neutral-900 transition"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <motion.div
            key="tickets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white border border-neutral-200">
              <div className="p-6 border-b border-neutral-100">
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                  Your Support Tickets
                </p>
              </div>
              
              {tickets.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
                    <HiOutlineTicket className="w-8 h-8 text-neutral-300" />
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">No support tickets yet</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-neutral-900 text-white px-6 py-3 text-xs tracking-[0.1em] uppercase"
                  >
                    Create Your First Ticket
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {tickets.map((ticket, i) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-6 flex items-center justify-between hover:bg-neutral-50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm">{ticket.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                            ticket.status === "Open" 
                              ? "bg-amber-50 text-amber-700 border border-amber-200" 
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm font-light text-neutral-900">{ticket.subject}</p>
                        <p className="text-xs text-neutral-500 mt-1">{ticket.category} · {ticket.date}</p>
                      </div>
                      <HiChevronDown className="w-4 h-4 text-neutral-400 -rotate-90" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-neutral-900/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                    Support
                  </p>
                  <h3 className="text-xl font-extralight">Create Ticket</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 transition"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitTicket} className="p-6 space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setSpecificIssue(""); }}
                    className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition bg-white"
                  >
                    {Object.keys(ISSUE_TYPES).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Specific Issue */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Issue Type
                  </label>
                  <select
                    value={specificIssue}
                    onChange={(e) => setSpecificIssue(e.target.value)}
                    className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition bg-white"
                  >
                    <option value="">Select an issue</option>
                    {ISSUE_TYPES[category]?.map((issue) => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                </div>

                {/* Related Order */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Related Order (Optional)
                  </label>
                  <select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition bg-white"
                  >
                    <option value="">Select an order</option>
                    {RECENT_ORDERS.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id} - {order.items} ({order.total})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full border border-neutral-200 px-4 py-3 text-sm font-light focus:outline-none focus:border-neutral-900 transition resize-none"
                  />
                </div>

                {/* Attachment */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                    Attachment (Optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-neutral-300 p-6 flex flex-col items-center gap-2 hover:border-neutral-400 transition"
                  >
                    {attachment ? (
                      <>
                        <HiCheck className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm text-neutral-600">{attachment.name}</span>
                      </>
                    ) : (
                      <>
                        <HiArrowUpTray className="w-5 h-5 text-neutral-400" />
                        <span className="text-xs text-neutral-500">Upload screenshot or file</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white py-4 text-xs tracking-[0.1em] uppercase hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border border-white border-t-transparent animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
