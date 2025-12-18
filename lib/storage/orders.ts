import { OrderData } from "@/types/order";

// localStorage를 '임시 저장소'로만 사용하기 위한 설정
// - MAX_ORDERS: 브라우저에 남겨둘 최대 주문 개수
// - TTL_MS: 각 주문 데이터를 유지할 최대 시간 (예: 7일)
const STORAGE_KEY = "orders:v1";
const MAX_ORDERS = 10;
const TTL_MS = 1000 * 60 * 60 * 24 * 7;

interface StoredOrderEntry {
  order: OrderData;
  // 저장 시점 기준 생성 시간 - 디버깅 및 마이그레이션용
  storedAt: number;
  // 만료 시각 (timestamp)
  expiresAt: number;
}

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function safeParse(value: string | null): StoredOrderEntry[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredOrderEntry[];
  } catch {
    // 손상된 데이터가 있을 수 있으므로, 파싱 실패 시에는 그냥 초기화
    return [];
  }
}

function readAllEntries(): StoredOrderEntry[] {
  if (!isStorageAvailable()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
}

function writeAllEntries(entries: StoredOrderEntry[]): void {
  if (!isStorageAvailable()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    // QuotaExceededError 방어
    // - 용량이 꽉 찬 경우 전체 주문 캐시를 비우고, 더 이상 예외를 전파하지 않음
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.code === 22)
    ) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // 제거도 실패하면 더 이상 할 수 있는 일이 없으므로 무시
      }
    }
  }
}

function removeExpired(entries: StoredOrderEntry[], now: number): StoredOrderEntry[] {
  // 만료 시간이 지난 주문은 모두 제거
  return entries.filter((entry) => entry.expiresAt > now);
}

export function addOrderToStorage(order: OrderData): void {
  // 서버 사이드 렌더링 환경에서는 아무 작업도 하지 않음
  if (!isStorageAvailable()) return;

  const now = Date.now();
  const expiresAt = now + TTL_MS;

  const existing = readAllEntries();
  const withoutExpired = removeExpired(existing, now);

  const updated: StoredOrderEntry[] = [
    {
      order,
      storedAt: now,
      expiresAt,
    },
    // 같은 주문 ID가 이미 있다면 중복으로 남기지 않기 위해 필터링
    ...withoutExpired.filter((entry) => entry.order.id !== order.id),
  ]
    // 최신 순으로 정렬
    .sort((a, b) => b.storedAt - a.storedAt)
    // 최대 개수 제한
    .slice(0, MAX_ORDERS);

  writeAllEntries(updated);
}

export function getValidOrdersFromStorage(): OrderData[] {
  if (!isStorageAvailable()) return [];
  const now = Date.now();
  const entries = removeExpired(readAllEntries(), now);

  // 읽기 시에도 만료된 데이터는 정리하여 불필요한 용량 사용을 줄인다.
  writeAllEntries(entries);

  return entries.map((entry) => entry.order);
}


