"use client";

import { FormEvent, useState } from "react";
import { Product } from "@/types/product";
import {
  ContactInfo,
  ShippingInfo,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateOrderErrorResponse,
} from "@/types/order";
import { addOrderToStorage } from "@/lib/storage/orders";

interface OrderFormProps {
  product: Product;
  quantity: number;
  onClose: () => void;
}

function validateContact(contact: ContactInfo) {
  if (!contact.name.trim()) return "이름을 입력해주세요.";
  if (!contact.phone.trim()) return "전화번호를 입력해주세요.";
  if (!contact.email.trim()) return "이메일을 입력해주세요.";
  return null;
}

function validateShipping(shipping: ShippingInfo) {
  if (!shipping.receiverName.trim()) return "수령인 이름을 입력해주세요.";
  if (!shipping.receiverPhone.trim()) return "수령인 전화번호를 입력해주세요.";
  if (!shipping.address1.trim()) return "주소를 입력해주세요.";
  if (!shipping.address2.trim()) return "상세 주소를 입력해주세요.";
  return null;
}

export default function OrderForm({
  product,
  quantity,
  onClose,
}: OrderFormProps) {
  const [contact, setContact] = useState<ContactInfo>({
    name: "",
    phone: "",
    email: "",
  });

  const [shipping, setShipping] = useState<ShippingInfo>({
    receiverName: "",
    receiverPhone: "",
    address1: "",
    address2: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalPrice = (product.sale_price ?? product.price) * quantity;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const contactError = validateContact(contact);
    if (contactError) {
      setError(contactError);
      return;
    }

    const shippingError = validateShipping(shipping);
    if (shippingError) {
      setError(shippingError);
      return;
    }

    const payload: CreateOrderRequest = {
      productId: product.id,
      productName: product.name,
      unitPrice: product.sale_price ?? product.price,
      quantity,
      totalPrice,
      contact,
      shipping,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as
        | CreateOrderResponse
        | CreateOrderErrorResponse;

      if (!response.ok || !data.success || !("data" in data)) {
        setError(
          "message" in data ? data.message : "주문 처리 중 오류가 발생했습니다."
        );
        return;
      }

      // localStorage는 임시 캐시로만 사용
      // - 주문 데이터는 서버(DB)로 이전될 수 있으므로, 클라이언트 저장 방식은 유틸 함수 뒤에 숨긴다.
      // - 이렇게 하면 나중에 저장소 구현을 교체하더라도 OrderForm 코드는 최대한 수정하지 않는다.
      addOrderToStorage(data.data);

      setSuccessMessage("주문이 완료되었습니다.");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setError("주문 요청 중 네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">주문하기</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800">연락처 정보</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">이름</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  value={contact.name}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">전화번호</label>
                <input
                  type="tel"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-gray-700">이메일</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  value={contact.email}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800">배송지 정보</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">수령인 이름</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  value={shipping.receiverName}
                  onChange={(e) =>
                    setShipping((prev) => ({
                      ...prev,
                      receiverName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">수령인 전화번호</label>
                <input
                  type="tel"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  value={shipping.receiverPhone}
                  onChange={(e) =>
                    setShipping((prev) => ({
                      ...prev,
                      receiverPhone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-gray-700">주소</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  placeholder="도로명 주소"
                  value={shipping.address1}
                  onChange={(e) =>
                    setShipping((prev) => ({
                      ...prev,
                      address1: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-gray-700">상세 주소</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
                  placeholder="동/호수 등"
                  value={shipping.address2}
                  onChange={(e) =>
                    setShipping((prev) => ({
                      ...prev,
                      address2: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="space-y-2 rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-800">주문 요약</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>상품명</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>수량</span>
                <span className="font-medium">{quantity}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span>단가</span>
                <span className="font-medium">
                  ₩{(product.sale_price ?? product.price).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>총 금액</span>
                  <span>₩{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-sm text-emerald-600">{successMessage}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "주문 접수 중..." : "주문 제출하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
