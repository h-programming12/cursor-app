import { NextRequest, NextResponse } from "next/server";
import {
  CreateOrderRequest,
  OrderData,
  CreateOrderResponse,
  CreateOrderErrorResponse,
} from "@/types/order";
import { validateOrderInput } from "@/lib/orders/validation";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderRequest;
    const validationError = validateOrderInput(body);

    if (validationError) {
      console.error("[ORDER_VALIDATION_FAILED]", {
        field: validationError.field,
        message: validationError.message,
      });

      const errorResponse: CreateOrderErrorResponse = {
        success: false,
        statusCode: 400,
        message: validationError.message ?? "입력 데이터가 올바르지 않습니다.",
        errorCode: "VALIDATION_ERROR",
        details: {
          field: validationError.field,
        },
      };

      return NextResponse.json<CreateOrderErrorResponse>(
        {
          ...errorResponse,
        },
        { status: 400 }
      );
    }

    const order: OrderData = {
      ...body,
      id: `ORD-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      paidAt: null,
      cancelledAt: null,
    };

    console.log("[ORDER_CREATED]", {
      id: order.id,
      status: order.status,
      productId: order.productId,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
    });

    const successResponse: CreateOrderResponse = {
      success: true,
      data: order,
    };

    return NextResponse.json<CreateOrderResponse>(
      {
        ...successResponse,
      },
      { status: 200 }
    );
  } catch {
    const errorResponse: CreateOrderErrorResponse = {
      success: false,
      statusCode: 500,
      message: "주문 처리 중 서버 오류가 발생했습니다.",
      errorCode: "SERVER_ERROR",
      details: null,
    };

    console.error("[ORDER_CREATE_FAILED]", {
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
    });

    return NextResponse.json<CreateOrderErrorResponse>(
      {
        ...errorResponse,
      },
      { status: 500 }
    );
  }
}
