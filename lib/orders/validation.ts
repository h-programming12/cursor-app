import { CreateOrderRequest } from "@/types/order";

export interface OrderValidationError {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const PHONE_REGEX = /^[0-9+\-\s]{7,20}$/;

export function validateOrderInput(
  body: CreateOrderRequest
): OrderValidationError | null {
  if (!body.productId) {
    return { field: "productId", message: "상품 ID가 필요합니다." };
  }

  if (!body.productName) {
    return { field: "productName", message: "상품명이 필요합니다." };
  }

  if (typeof body.unitPrice !== "number" || body.unitPrice <= 0) {
    return {
      field: "unitPrice",
      message: "단가는 0보다 큰 숫자여야 합니다.",
    };
  }

  if (typeof body.quantity !== "number" || !Number.isInteger(body.quantity)) {
    return {
      field: "quantity",
      message: "수량은 정수여야 합니다.",
    };
  }

  if (body.quantity < 1 || body.quantity > 9999) {
    return {
      field: "quantity",
      message: "수량은 1 이상 9999 이하여야 합니다.",
    };
  }

  if (typeof body.totalPrice !== "number" || body.totalPrice <= 0) {
    return {
      field: "totalPrice",
      message: "총 금액은 0보다 큰 숫자여야 합니다.",
    };
  }

  const expectedTotal = body.unitPrice * body.quantity;
  if (Math.abs(body.totalPrice - expectedTotal) > 0.0001) {
    return {
      field: "totalPrice",
      message: "총 금액이 단가와 수량에 맞지 않습니다.",
    };
  }

  if (!body.contact) {
    return { field: "contact", message: "연락처 정보가 필요합니다." };
  }

  if (!body.contact.name.trim()) {
    return { field: "contact.name", message: "이름을 입력해주세요." };
  }

  if (!body.contact.phone.trim()) {
    return { field: "contact.phone", message: "전화번호를 입력해주세요." };
  }

  if (!PHONE_REGEX.test(body.contact.phone.trim())) {
    return {
      field: "contact.phone",
      message: "전화번호 형식이 올바르지 않습니다.",
    };
  }

  if (!body.contact.email.trim()) {
    return { field: "contact.email", message: "이메일을 입력해주세요." };
  }

  if (!EMAIL_REGEX.test(body.contact.email.trim())) {
    return {
      field: "contact.email",
      message: "이메일 형식이 올바르지 않습니다.",
    };
  }

  if (!body.shipping) {
    return { field: "shipping", message: "배송지 정보가 필요합니다." };
  }

  if (!body.shipping.receiverName.trim()) {
    return {
      field: "shipping.receiverName",
      message: "수령인 이름을 입력해주세요.",
    };
  }

  if (!body.shipping.receiverPhone.trim()) {
    return {
      field: "shipping.receiverPhone",
      message: "수령인 전화번호를 입력해주세요.",
    };
  }

  if (!PHONE_REGEX.test(body.shipping.receiverPhone.trim())) {
    return {
      field: "shipping.receiverPhone",
      message: "수령인 전화번호 형식이 올바르지 않습니다.",
    };
  }

  if (!body.shipping.address1.trim()) {
    return { field: "shipping.address1", message: "주소를 입력해주세요." };
  }

  if (!body.shipping.address2.trim()) {
    return {
      field: "shipping.address2",
      message: "상세 주소를 입력해주세요.",
    };
  }

  return null;
}
