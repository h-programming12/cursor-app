export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface ShippingInfo {
  receiverName: string;
  receiverPhone: string;
  address1: string;
  address2: string;
}

/**
 * 주문 생성 요청 바디 타입
 * - 클라이언트에서 API로 전송하는 데이터 구조
 */
export interface CreateOrderRequest {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  contact: ContactInfo;
  shipping: ShippingInfo;
}

/**
 * 서버에서 관리하는 주문 도메인 모델
 * - status: 주문 상태
 * - paidAt, cancelledAt: 존재할 수도 있고(null 가능) 없을 수도 있는 시간 정보
 */
export interface OrderData extends CreateOrderRequest {
  id: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string | null;
  cancelledAt?: string | null;
}

/**
 * 주문 생성 성공 응답
 */
export interface CreateOrderResponse {
  success: true;
  data: OrderData;
}

/**
 * 주문 생성 실패 응답
 */
export interface CreateOrderErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode?: "VALIDATION_ERROR" | "SERVER_ERROR" | "UNKNOWN_ERROR";
  details?: Record<string, unknown> | null;
}


