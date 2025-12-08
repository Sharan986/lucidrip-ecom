// components/TestimonialSection.tsx
import React from 'react';
import Marquee from 'react-fast-marquee';
import { FaStar } from "react-icons/fa6";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiTypescript, 
  SiFigma, 
  SiVercel 
} from "react-icons/si";

const logos = [
  { name: "AlphaWave", icon: <SiVercel /> },
  { name: "Alt+Shift", icon: <SiReact /> },
  { name: "Biosynthesia", icon: <SiTailwindcss /> },
  { name: "3Poly", icon: <SiNextdotjs /> },
  { name: "TypeCo", icon: <SiTypescript /> },
  { name: "FigDesign", icon: <SiFigma /> },
];

const TestimonialSection: React.FC = () => {
  return (
    <div className="w-full bg-[#efefef] py-20 border-b border-gray-100 overflow-hidden mt-10">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center px-4">
        
        {/* --- Five Stars --- */}
        <div className="flex gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-black text-xl" />
          ))}
        </div>

       
        <h2 className="text-2xl md:text-4xl font-normal text-gray-900 leading-snug mb-8">
          I love the variety of styles and the high-quality clothing on this web fashion site.
        </h2>

      
        <p className="text-gray-800 font-medium text-sm mb-20">
          – Some & Co
        </p>
      </div>

  
      <div className="w-full grayscale opacity-50 transition-opacity hover:opacity-100">
        <Marquee 
          gradient={true} 
          gradientColor="#efefef" 
          gradientWidth={100}
          speed={40}
          pauseOnHover={true}
        >
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 mx-12 text-gray-600 font-bold text-xl select-none"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span>{logo.name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default TestimonialSection;