import { featuredItems } from "@/data/products"; // Ensure this path points to your data file
import ProductUI from "@/components/ProductUI/ProductUI";
import { notFound } from "next/navigation";

// Define the type for the URL parameter 'slug'
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage(props: Props) {
  // 2. Await the params to get the slug text
  const { slug } = await props.params;

  // 3. Find the product where the slug matches
  const product = featuredItems.find((p) => p.slug === slug);

  // 4. If no product is found
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <ProductUI product={product} />
    </div>
  );
}