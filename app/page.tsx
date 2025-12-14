"use client";

import { useState } from "react";
import ProductCard from "@/components/commerce/ProductCard/ProductCard";
import { Product } from "@/types/product";

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

export default function Home() {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const handleLikeToggle = (productId: string) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-black">All</h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={likedProducts.has(product.id)}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
