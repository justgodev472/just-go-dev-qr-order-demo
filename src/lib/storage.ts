import {
  CartItem,
  CurrencyCode,
  RestaurantTable,
  ServiceCallRequest,
  TableOrderRecord,
} from "@/types";
import { INITIAL_TABLES, INITIAL_RESTAURANT_CONFIG } from "@/data";

const STORAGE_KEY = "jgd_qr_order_sandbox_v1";
const TTL_HOURS = 3;
const TTL_MS = TTL_HOURS * 60 * 60 * 1000;

export interface QrOrderSandboxState {
  tableId: string;
  guestCount: number;
  currency: CurrencyCode;
  cart: CartItem[];
  tableOrder: TableOrderRecord | null;
  serviceCalls: ServiceCallRequest[];
  tables: RestaurantTable[];
  lastUpdated: number;
}

export function createInitialState(tableId = "T04"): QrOrderSandboxState {
  return {
    tableId,
    guestCount: 2,
    currency: "LAK",
    cart: [],
    tableOrder: null,
    serviceCalls: [],
    tables: INITIAL_TABLES,
    lastUpdated: Date.now(),
  };
}

// Server Snapshot for SSR
const SERVER_SNAPSHOT: QrOrderSandboxState = createInitialState("T04");

// In-Memory state for Client
let currentClientState: QrOrderSandboxState = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeStore(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getClientSnapshot(): QrOrderSandboxState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }
  return currentClientState;
}

export function getServerSnapshot(): QrOrderSandboxState {
  return SERVER_SNAPSHOT;
}

// Initialize Client State from LocalStorage
if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as QrOrderSandboxState;
      const isExpired = Date.now() - (parsed.lastUpdated || 0) > TTL_MS;
      if (isExpired) {
        currentClientState = createInitialState("T04");
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClientState));
      } else {
        currentClientState = {
          ...parsed,
          tables: parsed.tables || INITIAL_TABLES,
          currency: parsed.currency || "LAK",
        };
      }
    } else {
      currentClientState = createInitialState("T04");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClientState));
    }
  } catch {
    currentClientState = createInitialState("T04");
  }

  // ซิงก์ข้ามแท็บ/หน้าต่างของเบราว์เซอร์เดียวกัน: จอครัวที่เปิดค้างไว้จะอัปเดตเอง
  // (storage event ยิงเฉพาะแท็บ "อื่น" ที่ origin เดียวกัน แท็บที่แก้จึงไม่โดนทับ)
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const parsed = JSON.parse(event.newValue) as QrOrderSandboxState;
      currentClientState = {
        ...parsed,
        tables: parsed.tables || INITIAL_TABLES,
        currency: parsed.currency || "LAK",
      };
      notify();
    } catch {
      // ข้อมูลเสียหาย — คง state เดิมไว้
    }
  });
}

export function updateOrderState(
  updater: (prev: QrOrderSandboxState) => QrOrderSandboxState
) {
  const prevState = currentClientState;
  const nextState = updater(prevState);

  // If updater returned identical reference, no change
  if (nextState === prevState) {
    return;
  }

  currentClientState = {
    ...nextState,
    lastUpdated: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClientState));
    } catch {
      // Ignore quota errors
    }
  }
  notify();
}

export function resetOrderSandbox(tableId = "T04") {
  currentClientState = createInitialState(tableId);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClientState));
    } catch {
      // Ignore
    }
  }
  notify();
}
