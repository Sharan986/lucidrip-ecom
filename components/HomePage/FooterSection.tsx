import React from 'react';
import Link from 'next/link';
// Consolidate imports
import { HiOutlineTruck, HiOutlineBanknotes, HiOutlinePhone, HiOutlineLockClosed } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaTwitter, } from "react-icons/fa6";

export default function FooterSection() {
  const features = [
    {
      id: 1,
      icon: <HiOutlineTruck />,
      title: "Free Shipping",
      subtitle: "On orders above $200",
    },
    {
      id: 2,
      icon: <HiOutlineBanknotes />,
      title: "Money-back",
      subtitle: "30-day return guarantee",
    },
    {
      id: 3,
      icon: <HiOutlinePhone />,
      title: "Premium Support",
      subtitle: "24/7 Phone and email support",
    },
    {
      id: 4,
      icon: <HiOutlineLockClosed />,
      title: "Secure Payments",
      subtitle: "Secured by Stripe & SSL",
    },
  ];

  return (
    <>
 

      {/* --- PART 2: Main Footer (Black Background) --- */}
      <footer className="bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-4xl font-serif font-bold tracking-tight text-white">
                SABINA
              </h3>
              <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
                Discover timeless pieces for effortless style. We craft fashion that empowers and inspires confidence in every step you take.
              </p>
              
              <div className="flex space-x-4 pt-2">
                {[
                  { icon: <FaFacebookF />, href: "#" },
                  { icon: <FaInstagram />, href: "#" },
                  { icon: <FaTwitter />, href: "#" },
                 
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-sm">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Column 1 */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="text-lg font-bold mb-6 text-white">Information</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {["Shipping Policy", "Returns & Refunds", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {["About Us", "Contact", "Careers", "Our Blog"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="lg:col-span-3">
              <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <p className="leading-relaxed">
                  2810 N Church St PMB 48572,<br />
                  Wilmington, Delaware
                </p>
                <p className="font-medium text-white hover:underline cursor-pointer">
                  +1 123 456–7890
                </p>
                <p className="font-medium text-white hover:underline cursor-pointer">
                  info@sabina-store.com
                </p>
              </div>
            </div>
          </div>

         
        </div>
      </footer>
    </>
  );
}