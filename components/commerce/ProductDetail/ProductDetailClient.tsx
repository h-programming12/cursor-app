"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import OrderForm from "@/components/commerce/order/OrderForm";

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onOrderClick: () => void;
}

function AddToCartSection({
  product,
  quantity,
  onQuantityChange,
  onOrderClick,
}: AddToCartSectionProps) {
  const handleDecrease = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const totalPrice = (product.sale_price ?? product.price) * quantity;

  return (
    <section className="mt-6 space-y-4 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">수량</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrease}
            className="h-8 w-8 rounded-full border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100"
            aria-label="수량 감소"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="h-8 w-8 rounded-full border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100"
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm text-gray-600">총 금액</span>
        <span className="text-lg font-semibold text-gray-900">
          ₩{totalPrice.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          장바구니 담기
        </button>
        <button
          type="button"
          onClick={onOrderClick}
          className="flex-1 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          바로 주문하기
        </button>
      </div>
    </section>
  );
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

  const displayPrice = product.sale_price ?? product.price;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">
                ₩{displayPrice.toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-sm text-gray-400 line-through">
                  ₩{product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600">
              편안한 공간을 완성해 줄 감성적인 인테리어 아이템입니다. 예시
              데이터로 구성된 상품 상세 설명 영역입니다.
            </p>

            <AddToCartSection
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onOrderClick={() => setShowOrderModal(true)}
            />
          </div>
        </div>
      </main>

      {showOrderModal && (
        <OrderForm
          product={product}
          quantity={quantity}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}
