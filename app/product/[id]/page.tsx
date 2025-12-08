
import { featuredItems } from "@/data/products";
import ProductUI from "@/components/ProductUI/ProductUI"; 

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const productId = Number(id);
  const product = featuredItems.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
      </div>
    );
  }

 
  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <ProductUI product={product} />
    </div>
  );
}