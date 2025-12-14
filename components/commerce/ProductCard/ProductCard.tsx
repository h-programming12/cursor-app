"use client";

import { memo, useReducer, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Product } from "@/types/product";

/**
 * ProductCard 컴포넌트 Props 인터페이스
 */
interface ProductCardProps {
  /** 상품 정보 */
  product: Product;
  /** 찜하기 상태 */
  isLiked: boolean;
  /** 찜하기 토글 이벤트 핸들러 */
  onLikeToggle: (productId: string) => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop";

interface ImageState {
  isLoading: boolean;
  errorImageSrc: string | null;
  hasError: boolean;
}

type ImageAction =
  | { type: "RESET"; payload: { imageUrl: string } }
  | { type: "LOADING_COMPLETE" }
  | { type: "LOAD_ERROR"; payload: { placeholder: string } };

function imageReducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case "RESET":
      return {
        isLoading: true,
        errorImageSrc: null,
        hasError: false,
      };
    case "LOADING_COMPLETE":
      return {
        ...state,
        isLoading: false,
      };
    case "LOAD_ERROR":
      return {
        isLoading: false,
        errorImageSrc: action.payload.placeholder,
        hasError: true,
      };
    default:
      return state;
  }
}

/**
 * 상품 카드 컴포넌트
 *
 * @example
 * ```tsx
 * const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
 *
 * const handleLikeToggle = (productId: string) => {
 *   setLikedProducts((prev) => {
 *     const newSet = new Set(prev);
 *     if (newSet.has(productId)) {
 *       newSet.delete(productId);
 *     } else {
 *       newSet.add(productId);
 *     }
 *     return newSet;
 *   });
 * };
 *
 * <ProductCard
 *   product={{
 *     id: "1",
 *     name: "Loveseat Sofa",
 *     image_url: "https://example.com/image.jpg",
 *     price: 400.0,
 *     sale_price: 199.0,
 *   }}
 *   isLiked={likedProducts.has("1")}
 *   onLikeToggle={handleLikeToggle}
 * />
 * ```
 *
 * @param props - ProductCardProps
 * @returns JSX.Element
 */
function ProductCard({ product, isLiked, onLikeToggle }: ProductCardProps) {
  const [imageState, dispatch] = useReducer(imageReducer, {
    isLoading: true,
    errorImageSrc: null,
    hasError: false,
  });

  const discountRate = useMemo(() => {
    if (product.sale_price === undefined) return 0;
    return Math.round(
      ((product.price - product.sale_price) / product.price) * 100
    );
  }, [product.price, product.sale_price]);

  useEffect(() => {
    dispatch({ type: "RESET", payload: { imageUrl: product.image_url } });
  }, [product.image_url]);

  const handleLikeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onLikeToggle(product.id);
    },
    [product.id, onLikeToggle]
  );

  const handleImageLoad = useCallback(() => {
    setTimeout(() => {
      dispatch({ type: "LOADING_COMPLETE" });
    }, 1500);
  }, []);

  const handleImageError = useCallback(() => {
    dispatch({
      type: "LOAD_ERROR",
      payload: { placeholder: PLACEHOLDER_IMAGE },
    });
  }, []);

  const imageAlt = useMemo(() => `${product.name} 상품 이미지`, [product.name]);

  const imageSrc = useMemo(
    () => imageState.errorImageSrc || product.image_url,
    [imageState.errorImageSrc, product.image_url]
  );

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl"
      aria-label={`${product.name} 상품 상세 페이지로 이동`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {imageState.isLoading && (
          <div
            className="absolute inset-0 animate-pulse bg-gray-200"
            role="status"
            aria-label="이미지 로딩 중"
          >
            <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            <span className="sr-only">이미지를 불러오는 중입니다...</span>
          </div>
        )}
        {imageState.hasError && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-100"
            role="alert"
            aria-label="이미지를 불러올 수 없습니다"
          >
            <div className="text-center px-4">
              <p className="text-sm text-gray-500">
                이미지를 불러올 수 없습니다
              </p>
            </div>
          </div>
        )}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-cover transition-transform duration-300 ${
            imageState.isLoading || imageState.hasError
              ? "opacity-0"
              : "opacity-100"
          } group-hover:scale-110`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoadingComplete={handleImageLoad}
          onError={handleImageError}
        />
        <button
          onClick={handleLikeClick}
          className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label={
            isLiked
              ? `${product.name} 찜하기 해제하기`
              : `${product.name} 찜하기 추가하기`
          }
          aria-pressed={isLiked}
        >
          {isLiked ? (
            <AiFillHeart className="h-5 w-5 text-red-500" aria-hidden="true" />
          ) : (
            <AiOutlineHeart
              className="h-5 w-5 text-gray-600"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-black">{product.name}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {product.sale_price !== undefined ? (
            <>
              <span
                className="text-xl font-bold text-black"
                aria-label={`할인가 ${product.sale_price.toFixed(2)}달러`}
              >
                ${product.sale_price.toFixed(2)}
              </span>
              <span
                className="text-base text-gray-400 line-through"
                aria-label={`원가 ${product.price.toFixed(2)}달러`}
              >
                ${product.price.toFixed(2)}
              </span>
              {discountRate > 0 && (
                <span
                  className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-600"
                  aria-label={`${discountRate}퍼센트 할인`}
                >
                  {discountRate}% OFF
                </span>
              )}
            </>
          ) : (
            <span
              className="text-xl font-bold text-black"
              aria-label={`가격 ${product.price.toFixed(2)}달러`}
            >
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
