import Image from "next/image"
import FeaturedProductsSection from "./FeaturedProductsSection"
import TestimonialSection from "./TestimonialSection"
import CollectionsSection from "./CollectionsSection"
import NewsletterSection from "./NewsletterSection"

const HeroPage = () => {
  return (
    <>
   <div className="px-5">
    <div className="relative w-full  mt-6">
      
      {/* Container controls the height/aspect ratio */}
      <div className="relative w-full h-[60vh] md:h-[85vh] rounded-xl overflow-hidden">
        
        {/* 1. Main Image */}
        <Image
          src="/Hero/HeroImg.avif"
          alt="Hero Background - New Collection"
          fill 
          className="object-cover object-center"
          priority 
          sizes="(max-width: 768px) 100vw, 90vw"
        />

        {/* 2. Dark Overlay (Optional - Improves text readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* 3. Hero Text (Example) */}
        <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Redefine Your Style.
          </h1>
          <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
            Shop Collection
          </button>
        </div>

      </div>
    </div>
    <FeaturedProductsSection />
    
    </div>
    <TestimonialSection />
    <CollectionsSection />
    <NewsletterSection />

    </>
  )
}

export default HeroPage