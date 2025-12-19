import { test, expect } from "@playwright/test";

test.describe("주문 생성 전체 플로우 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 localStorage 초기화
    await page.goto("http://localhost:3000");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("주문 생성 전체 플로우", async ({ page }) => {
    // 1. 상품 상세 페이지로 이동
    await page.goto("http://localhost:3000/products/1");

    // 상세 페이지가 로드되었는지 확인
    const productName = page.getByTestId("product-detail-name");
    await expect(productName).toBeVisible();
    await expect(productName).toHaveText("Loveseat Sofa");

    // 2. "바로 주문하기" 버튼 클릭
    const orderButton = page.getByTestId("product-detail-order-button");
    await expect(orderButton).toBeVisible();
    await orderButton.click();

    // 3. 주문 form 뜨기 확인
    const orderModal = page.getByTestId("order-form-modal");
    await expect(orderModal).toBeVisible();

    // 주문 요약 섹션 확인
    const orderSummary = page.getByTestId("order-form-summary");
    await expect(orderSummary).toBeVisible();

    // 4. 배송지 정보 입력
    // 연락처 정보 입력
    const contactNameInput = page.getByTestId("order-form-contact-name");
    await contactNameInput.fill("홍길동");

    const contactPhoneInput = page.getByTestId("order-form-contact-phone");
    await contactPhoneInput.fill("010-1234-5678");

    const contactEmailInput = page.getByTestId("order-form-contact-email");
    await contactEmailInput.fill("test@test.com");

    // 배송지 정보 입력
    const receiverNameInput = page.getByTestId(
      "order-form-shipping-receiver-name"
    );
    await receiverNameInput.fill("홍길동");

    const receiverPhoneInput = page.getByTestId(
      "order-form-shipping-receiver-phone"
    );
    await receiverPhoneInput.fill("010-1234-5678");

    const address1Input = page.getByTestId("order-form-shipping-address1");
    await address1Input.fill("서울시 강남구");

    const address2Input = page.getByTestId("order-form-shipping-address2");
    await address2Input.fill("111동 222호");

    // 입력된 값 확인
    await expect(contactNameInput).toHaveValue("홍길동");
    await expect(contactPhoneInput).toHaveValue("010-1234-5678");
    await expect(contactEmailInput).toHaveValue("test@test.com");
    await expect(receiverNameInput).toHaveValue("홍길동");
    await expect(receiverPhoneInput).toHaveValue("010-1234-5678");
    await expect(address1Input).toHaveValue("서울시 강남구");
    await expect(address2Input).toHaveValue("111동 222호");

    // 5. "주문 제출하기" 버튼 클릭
    const submitButton = page.getByTestId("order-form-submit-button");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 6. "주문이 완료되었습니다" 텍스트가 뜨는지 확인
    const successMessage = page.getByTestId("order-form-success");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText("주문이 완료되었습니다.");

    // 7. 모달이 자동으로 닫히는지 확인 (1초 후)
    await page.waitForTimeout(1500); // setTimeout 1000ms + 여유 시간
    await expect(orderModal).not.toBeVisible();

    // 8. localStorage에 lastOrder 값이 방금 주문한 데이터로 업데이트 되어있는지 확인
    const storedOrders = await page.evaluate(() => {
      const ordersData = localStorage.getItem("orders:v1");
      if (!ordersData) return null;
      try {
        return JSON.parse(ordersData);
      } catch {
        return null;
      }
    });

    expect(storedOrders).not.toBeNull();
    expect(Array.isArray(storedOrders)).toBe(true);
    expect(storedOrders.length).toBeGreaterThan(0);

    // 최신 주문이 첫 번째에 위치하는지 확인
    const lastOrder = storedOrders[0];
    expect(lastOrder).toHaveProperty("order");
    expect(lastOrder.order).toHaveProperty("id");
    expect(lastOrder.order.id).toMatch(/^ORD-/);
    expect(lastOrder.order.productId).toBe("1");
    expect(lastOrder.order.productName).toBe("Loveseat Sofa");
    expect(lastOrder.order.quantity).toBe(1);
    expect(lastOrder.order.contact.name).toBe("홍길동");
    expect(lastOrder.order.contact.phone).toBe("010-1234-5678");
    expect(lastOrder.order.contact.email).toBe("test@test.com");
    expect(lastOrder.order.shipping.receiverName).toBe("홍길동");
    expect(lastOrder.order.shipping.receiverPhone).toBe("010-1234-5678");
    expect(lastOrder.order.shipping.address1).toBe("서울시 강남구");
    expect(lastOrder.order.shipping.address2).toBe("111동 222호");
    expect(lastOrder.order.status).toBe("pending");
  });

  test("주문 생성 시 수량 변경 후 주문", async ({ page }) => {
    await page.goto("http://localhost:3000/products/1");

    // 수량 증가 버튼 클릭 (수량을 2로 변경)
    const increaseButton = page.getByTestId("product-detail-quantity-increase");
    await increaseButton.click();

    const quantityDisplay = page.getByTestId("product-detail-quantity");
    await expect(quantityDisplay).toHaveText("2");

    // 바로 주문하기 버튼 클릭
    const orderButton = page.getByTestId("product-detail-order-button");
    await orderButton.click();

    // 주문 form 확인
    const orderModal = page.getByTestId("order-form-modal");
    await expect(orderModal).toBeVisible();

    // 주문 요약에서 수량이 2개인지 확인
    const summaryQuantity = page.getByTestId("order-form-summary-quantity");
    await expect(summaryQuantity).toHaveText("2개");

    // 배송지 정보 입력
    await page.getByTestId("order-form-contact-name").fill("홍길동");
    await page.getByTestId("order-form-contact-phone").fill("010-1234-5678");
    await page.getByTestId("order-form-contact-email").fill("test@test.com");
    await page.getByTestId("order-form-shipping-receiver-name").fill("홍길동");
    await page
      .getByTestId("order-form-shipping-receiver-phone")
      .fill("010-1234-5678");
    await page
      .getByTestId("order-form-shipping-address1")
      .fill("서울시 강남구");
    await page.getByTestId("order-form-shipping-address2").fill("111동 222호");

    // 주문 제출
    await page.getByTestId("order-form-submit-button").click();

    // 성공 메시지 확인
    const successMessage = page.getByTestId("order-form-success");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText("주문이 완료되었습니다.");

    // 모달이 닫히는지 확인
    await page.waitForTimeout(1500);
    await expect(orderModal).not.toBeVisible();

    // localStorage에서 수량이 2인지 확인
    const storedOrders = await page.evaluate(() => {
      const ordersData = localStorage.getItem("orders:v1");
      if (!ordersData) return null;
      try {
        return JSON.parse(ordersData);
      } catch {
        return null;
      }
    });

    expect(storedOrders).not.toBeNull();
    const lastOrder = storedOrders[0];
    expect(lastOrder.order.quantity).toBe(2);
  });
});
