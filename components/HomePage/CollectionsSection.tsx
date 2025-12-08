import Image from 'next/image';
import Link from 'next/link';
// Ensure you have react-icons installed
import { HiArrowRight } from "react-icons/hi2"; 

interface CollectionItem {
  id: number;
  title: string;
  imageSrc: string;
  altText: string;
  href: string; // Added href for navigation
}

const collectionsData: CollectionItem[] = [
  {
    id: 1,
    title: 'Women Collection',
    imageSrc: '/Hero/Coll1.avif', 
    altText: 'Woman in a beige sweatshirt',
    href: '/collections/women',
  },
  {
    id: 2,
    title: 'Men Collection',
    imageSrc: '/Hero/Coll2.avif',
    altText: 'Man in a casual outfit',
    href: '/collections/men',
  },
  {
    id: 3,
    title: 'Bags & Accessories',
    imageSrc: '/Hero/Coll3.avif',
    altText: 'Bag collection',
    href: '/collections/accessories',
  },
];

export default function CollectionsSection() {
  return (
    <section className="py-20 px-5 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Our Collections
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Inspire and let yourself be inspired, from one unique fashion to another.
          </p>
        </div>

        {/* --- Collections List --- */}
        <div className="flex flex-col gap-10">
          {collectionsData.map((item) => (
            <Link 
              key={item.id} 
              href={item.href}
              className="group block"
            >
              <div className="flex flex-col md:flex-row bg-gray-100 rounded-xl overflow-hidden min-h-[450px] transition-shadow ">
                
                {/* Text Section */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start z-10 relative">
                  <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {item.title}
                  </h3>
                  
                  {/* Animated CTA Button */}
                  <div className="flex items-center gap-3 text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    <span>Shop Collection</span>
                    <span className="bg-white p-2 rounded-full border border-gray-200   ">
                      <HiArrowRight />
                    </span>
                  </div>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-1/2 flex items-end justify-end relative overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.altText}
                    width={900}
                    height={800}
                    // Added hover zoom effect (scale-105)
                    className="w-full h-[350px] md:h-[500px] object-cover object-bottom  "
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}