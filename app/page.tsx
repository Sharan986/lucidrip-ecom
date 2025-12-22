import { 
  HeroSection, 
  FeaturedProducts, 
  CollectionsSection, 
  TestimonialSection, 
  NewsletterSection 
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <TestimonialSection />
      <CollectionsSection />
      <NewsletterSection />
    </>
  );
}