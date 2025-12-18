import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import ProductDetailClient from "@/components/commerce/ProductDetail/ProductDetailClient";

const PRODUCTS: Product[] = [
  {
    id: "1",
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
    name: "Loveseat Sofa",
    price: 400.0,
    sale_price: 199.0,
  },
  {
    id: "2",
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    name: "Table Lamp",
    price: 24.99,
  },
  {
    id: "3",
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    name: "Beige Table Lamp",
    price: 24.99,
  },
  {
    id: "4",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
    name: "Bamboo basket",
    price: 24.99,
  },
];

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
