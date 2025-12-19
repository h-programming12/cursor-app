import { test, expect } from "@playwright/test";

test.describe("ProductCard 컴포넌트 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("홈 페이지에 접속하고 상품 카드가 표시되는지 확인", async ({ page }) => {
    // 상품 카드가 표시되는지 확인
    const productCards = page.getByTestId("product-card");
    await expect(productCards).toHaveCount(4);
  });

  test("상품명과 가격이 올바르게 표시되는지 확인", async ({ page }) => {
    // 첫 번째 상품 카드 확인 (Loveseat Sofa)
    const firstProductCard = page.getByTestId("product-card").first();

    // 상품명 확인
    const productName = firstProductCard.getByTestId("product-card-name");
    await expect(productName).toBeVisible();
    await expect(productName).toHaveText("Loveseat Sofa");

    // 할인가 확인 (첫 번째 상품은 할인가가 있음)
    const salePrice = firstProductCard.getByTestId("product-card-sale-price");
    await expect(salePrice).toBeVisible();
    await expect(salePrice).toHaveText("$199.00");

    // 원가 확인
    const originalPrice = firstProductCard.getByTestId(
      "product-card-original-price"
    );
    await expect(originalPrice).toBeVisible();
    await expect(originalPrice).toHaveText("$400.00");

    // 할인율 배지 확인
    const discountBadge = firstProductCard.getByTestId(
      "product-card-discount-badge"
    );
    await expect(discountBadge).toBeVisible();
    await expect(discountBadge).toHaveText("50% OFF");

    // 두 번째 상품 카드 확인 (Table Lamp - 할인가 없음)
    const secondProductCard = page.getByTestId("product-card").nth(1);

    // 상품명 확인
    const secondProductName =
      secondProductCard.getByTestId("product-card-name");
    await expect(secondProductName).toHaveText("Table Lamp");

    // 가격 확인 (할인가가 없는 경우)
    const price = secondProductCard.getByTestId("product-card-price");
    await expect(price).toBeVisible();
    await expect(price).toHaveText("$24.99");
  });

  test("좋아요 버튼이 있는지 확인", async ({ page }) => {
    const firstProductCard = page.getByTestId("product-card").first();

    // 좋아요 버튼 확인
    const likeButton = firstProductCard.getByTestId("product-card-like-button");
    await expect(likeButton).toBeVisible();

    // 초기 상태: 빈 하트 아이콘 표시
    const outlineIcon = firstProductCard.getByTestId(
      "product-card-like-icon-outline"
    );
    await expect(outlineIcon).toBeVisible();

    // 좋아요 버튼 클릭
    await likeButton.click();

    // 클릭 후: 채워진 하트 아이콘 표시
    const filledIcon = firstProductCard.getByTestId(
      "product-card-like-icon-filled"
    );
    await expect(filledIcon).toBeVisible();

    // 다시 클릭하여 해제
    await likeButton.click();
    await expect(outlineIcon).toBeVisible();
  });

  test("상품 카드를 클릭하면 상세 페이지로 이동하는지 확인", async ({
    page,
  }) => {
    const firstProductCard = page.getByTestId("product-card").first();
    const productLink = firstProductCard.getByTestId("product-card-link");

    // 링크의 href 속성 확인
    await expect(productLink).toHaveAttribute("href", "/products/1");

    // 상품 카드 클릭
    await productLink.click();

    // 상세 페이지로 이동했는지 확인
    await expect(page).toHaveURL("http://localhost:3000/products/1");

    // 상세 페이지의 상품명이 표시되는지 확인
    const productDetailName = page.getByTestId("product-detail-name");
    await expect(productDetailName).toBeVisible();
    await expect(productDetailName).toHaveText("Loveseat Sofa");
  });

  test("모든 상품 카드의 좋아요 버튼이 정상 작동하는지 확인", async ({
    page,
  }) => {
    const productCards = page.getByTestId("product-card");

    // 각 상품 카드의 좋아요 버튼 확인
    for (let i = 0; i < 4; i++) {
      const productCard = productCards.nth(i);
      const likeButton = productCard.getByTestId("product-card-like-button");

      await expect(likeButton).toBeVisible();

      // 초기 상태 확인
      const outlineIcon = productCard.getByTestId(
        "product-card-like-icon-outline"
      );
      await expect(outlineIcon).toBeVisible();

      // 좋아요 클릭
      await likeButton.click();

      // 클릭 후 상태 확인
      const filledIcon = productCard.getByTestId(
        "product-card-like-icon-filled"
      );
      await expect(filledIcon).toBeVisible();

      // 다시 클릭하여 해제
      await likeButton.click();
      await expect(outlineIcon).toBeVisible();
    }
  });
});
