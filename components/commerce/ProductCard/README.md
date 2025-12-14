# ProductCard 컴포넌트

상품 정보를 카드 형태로 표시하는 컴포넌트입니다.

## 기능

- 상품 이미지 표시 (로딩 스켈레톤 포함)
- 찜하기 기능
- 할인가 및 할인율 표시
- 이미지 로드 실패 시 에러 처리
- 접근성 지원 (ARIA 레이블, 키보드 네비게이션)
- React.memo로 최적화된 렌더링

## 사용 예시

### 기본 사용법

```tsx
"use client";

import { useState } from "react";
import ProductCard from "@/components/commerce/ProductCard/ProductCard";
import { Product } from "@/types/product";

export default function ProductList() {
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

  const products: Product[] = [
    {
      id: "1",
      name: "Loveseat Sofa",
      image_url: "https://example.com/sofa.jpg",
      price: 400.0,
      sale_price: 199.0,
    },
    {
      id: "2",
      name: "Table Lamp",
      image_url: "https://example.com/lamp.jpg",
      price: 24.99,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isLiked={likedProducts.has(product.id)}
          onLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
}
```

### 할인가가 없는 상품

```tsx
<ProductCard
  product={{
    id: "3",
    name: "Bamboo Basket",
    image_url: "https://example.com/basket.jpg",
    price: 24.99,
  }}
  isLiked={false}
  onLikeToggle={handleLikeToggle}
/>
```

### 찜하기 상태 관리

```tsx
// 전역 상태 관리 (예: Context API)
const { likedProducts, toggleLike } = useProductLike();

<ProductCard
  product={product}
  isLiked={likedProducts.has(product.id)}
  onLikeToggle={toggleLike}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `Product` | ✅ | 상품 정보 객체 |
| `isLiked` | `boolean` | ✅ | 찜하기 상태 |
| `onLikeToggle` | `(productId: string) => void` | ✅ | 찜하기 토글 이벤트 핸들러 |

## Product 타입

```typescript
interface Product {
  id: string;
  image_url: string;
  name: string;
  price: number;
  sale_price?: number; // 선택사항
}
```

## 접근성

- 모든 버튼과 링크에 적절한 `aria-label` 제공
- 이미지에 의미 있는 `alt` 텍스트
- 키보드 네비게이션 지원
- 스크린 리더를 위한 `sr-only` 텍스트

## 성능 최적화

- `React.memo`로 불필요한 리렌더링 방지
- `useCallback`으로 이벤트 핸들러 메모이제이션
- `useMemo`로 계산된 값 캐싱
- 이미지 로딩 최적화 (Next.js Image 컴포넌트 사용)

## 에러 처리

- 이미지 로드 실패 시 placeholder 이미지 표시
- 사용자 친화적인 에러 메시지 제공
- 로딩 상태 시각적 피드백

