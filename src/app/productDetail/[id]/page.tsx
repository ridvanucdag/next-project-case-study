import ProductDetailPage from "@/app/pages/ProductDetailPage/ProductDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  return <ProductDetailPage productId={productId} />;
}
