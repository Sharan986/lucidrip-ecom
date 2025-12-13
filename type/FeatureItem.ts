export type FeatureItem = {
  id: number;
  img: string;
  price: number;
  name: string;
  slug: string;
  // New required fields
  description: string;
  sizes: string[];
  colors: string[];
  // Optional fields
  images?: string[]; 
  inStock?: boolean;
};