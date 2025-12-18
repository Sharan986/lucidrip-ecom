import { notFound } from "next/navigation";
import ProductUI from "@/components/ProductUI/ProductUI"; 

// 1. Fetch Single Product
async function getProduct(slug: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${slug}`, {
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
    const res = await fetch("http://localhost:5000/api/products", { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const products = await res.json();
    return products.slice(0, 4); 
  } catch (error) {
    return [];
  }
}

// 3. MAIN COMPONENT (Updated for Next.js 15)
// Notice the type definition change: params is now Promise<{ slug: string }>
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  
  // ⚠️ CRITICAL FIX: You must await params before using the slug
  const { slug } = await params;

  // Now use the unwrapped slug
  const productData = await getProduct(slug);
  const relatedData = await getRelatedProducts();

  if (!productData) {
    notFound();
  }

  // Filter out the current product from related items
  const filteredRelated = relatedData.filter((p: any) => p._id !== productData._id);

  return (
    <ProductUI 
      product={productData} 
      relatedProducts={filteredRelated} 
    />
  );
}