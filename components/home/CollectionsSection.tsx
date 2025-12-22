"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowLongRight } from "react-icons/hi2";
import { useRef } from 'react';

interface CollectionItem {
  id: number;
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  href: string;
}

const collectionsData: CollectionItem[] = [
  {
    id: 1,
    title: 'Women',
    subtitle: 'Elegance redefined',
    imageSrc: '/Hero/Coll1.avif', 
    altText: 'Women Collection',
    href: '/products?category=women',
  },
  {
    id: 2,
    title: 'Men',
    subtitle: 'Contemporary classics',
    imageSrc: '/Hero/Coll2.avif',
    altText: 'Men Collection',
    href: '/products?category=men',
  },
  {
    id: 3,
    title: 'Accessories',
    subtitle: 'Complete the look',
    imageSrc: '/Hero/Coll3.avif',
    altText: 'Accessories Collection',
    href: '/products?category=accessories',
  },
];

function CollectionCard({ item, index }: { item: CollectionItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <Link href={item.href} className="group block relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={item.imageSrc}
            alt={item.altText}
            fill
            className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            sizes="100vw"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-xs tracking-[0.3em] uppercase mb-4"
            >
              {item.subtitle}
            </motion.p>
            
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-8"
            >
              {item.title}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-4 text-white text-sm tracking-widest uppercase group/link"
            >
              <span className="group-hover/link:mr-2 transition-all duration-300">Explore</span>
              <HiArrowLongRight className="text-2xl group-hover:translate-x-2 transition-transform duration-300" />
            </motion.div>
          </div>
        </div>

        {/* Collection Number */}
        <div className="absolute top-8 right-8 md:top-16 md:right-16">
          <span className="text-white/30 text-6xl md:text-8xl font-extralight">
            0{index + 1}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CollectionsSection() {
  return (
    <section className="bg-black">
      {/* Section Header */}
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-white/10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">Collections</p>
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight">
              Shop by <span className="italic font-normal">Category</span>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Collection Cards */}
      <div className="space-y-1">
        {collectionsData.map((item, index) => (
          <CollectionCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
