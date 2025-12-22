import { notFound } from "next/navigation";
import ProductUI from "@/components/ProductUI/ProductUI"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 1. Fetch Single Product
async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// 2. Fetch Related Products
async function getRelatedProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const products = await res.json();
    return products.slice(0, 4); 
  } catch (error) {
    return [];
  }
}
interface ProductData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

// Notice the type definition change: params is now Promise<{ slug: string }>
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  
 
  const { slug } = await params;

  // Now use the unwrapped slug
  const productData: ProductData | null = await getProduct(slug);
  const relatedData: ProductData[] = await getRelatedProducts();

  if (!productData) {
    notFound();
  }

  // Filter out the current product from related items
  const filteredRelated = relatedData.filter((p: ProductData) => p._id !== productData._id);

  return (
    <ProductUI 
      product={productData} 
      relatedProducts={filteredRelated} 
    />
  );
}