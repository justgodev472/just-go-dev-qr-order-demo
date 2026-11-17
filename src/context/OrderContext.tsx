"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useCallback,
  useMemo,
} from "react";
import {
  CartItem,
  CurrencyCode,
  MenuItem,
  OrderItemStatus,
  OrderRound,
  PlacedOrderItem,
  SelectedOption,
  ServiceCallDetails,
  ServiceCallRequest,
  ServiceCallType,
  TableOrderRecord,
} from "@/types";
import {
  getClientSnapshot,
  getServerSnapshot,
  subscribeStore,
  updateOrderState,
  resetOrderSandbox,
  QrOrderSandboxState,
} from "@/lib/storage";
import { INITIAL_RESTAURANT_CONFIG } from "@/data";
import { formatPrice } from "@/lib/formatters";

interface OrderContextValue {
  isMounted: boolean;
  state: QrOrderSandboxState;
  tableId: string;
  guestCount: number;
  currency: CurrencyCode;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  tableOrder: TableOrderRecord | null;
  serviceCalls: ServiceCallRequest[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isServiceModalOpen: boolean;
  setIsServiceModalOpen: (open: boolean) => void;
  isBillModalOpen: boolean;
  setIsBillModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  // Actions
  setTableId: (tableId: string) => void;
  setGuestCount: (count: number) => void;
  setCurrency: (currency: CurrencyCode) => void;
  addToCart: (
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  submitOrderToKitchen: () => void;
  updateOrderItemStatus: (itemId: string, status: OrderItemStatus) => void;
  markRoundServed: (roundNumber: number) => void;
  requestServiceCall: (
    type: ServiceCallType,
    title: string,
    details?: ServiceCallDetails
  ) => void;
  resolveServiceCall: (callId: string) => void;
  payBill: (method: "onepay" | "cash" | "card") => void;
  resetSandbox: (tableId?: string) => void;
  formatStorePrice: (amountInLak: number) => string;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

function emptySubscribe() {
  return () => {};
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const state = useSyncExternalStore(
    subscribeStore,
    getClientSnapshot,
    getServerSnapshot
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = state.cart.reduce((sum, item) => sum + item.subtotal, 0);

  const formatStorePrice = useCallback(
    (amountInLak: number) =>
      formatPrice(amountInLak, state.currency, INITIAL_RESTAURANT_CONFIG.exchangeRates),
    [state.currency]
  );

  const setTableId = useCallback((tableId: string) => {
    updateOrderState((prev) => {
      if (prev.tableId === tableId) return prev;
      return { ...prev, tableId };
    });
  }, []);

  const setGuestCount = useCallback((guestCount: number) => {
    updateOrderState((prev) => {
      if (prev.guestCount === guestCount) return prev;
      return { ...prev, guestCount };
    });
  }, []);

  const setCurrency = useCallback((currency: CurrencyCode) => {
    updateOrderState((prev) => {
      if (prev.currency === currency) return prev;
      return { ...prev, currency };
    });
  }, []);

  const addToCart = useCallback(
    (
      menuItem: MenuItem,
      quantity: number,
      selectedOptions: SelectedOption[],
      specialInstructions?: string
    ) => {
      const optionsExtra = selectedOptions.reduce(
        (sum, opt) => sum + opt.priceExtra,
        0
      );
      const unitPrice = menuItem.price + optionsExtra;
      const subtotal = unitPrice * quantity;

      // Check if duplicate with same options exists
      const optionsKey = selectedOptions
        .map((o) => `${o.groupId}:${o.optionId}`)
        .sort()
        .join("|");

      updateOrderState((prev) => {
        const existingIdx = prev.cart.findIndex((item) => {
          if (item.menuItem.id !== menuItem.id) return false;
          if ((item.specialInstructions || "") !== (specialInstructions || "")) return false;
          const itemKey = item.selectedOptions
            .map((o) => `${o.groupId}:${o.optionId}`)
            .sort()
            .join("|");
          return itemKey === optionsKey;
        });

        if (existingIdx > -1) {
          const nextCart = [...prev.cart];
          const nextQty = nextCart[existingIdx].quantity + quantity;
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextQty,
            subtotal: nextCart[existingIdx].unitPrice * nextQty,
          };
          return { ...prev, cart: nextCart };
        }

        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          menuItem,
          quantity,
          selectedOptions,
          specialInstructions,
          unitPrice,
          subtotal,
        };

        return {
          ...prev,
          cart: [...prev.cart, newItem],
        };
      });
    },
    []
  );

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      updateOrderState((prev) => ({
        ...prev,
        cart: prev.cart.filter((item) => item.id !== cartItemId),
      }));
      return;
    }
    updateOrderState((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity, subtotal: item.unitPrice * quantity }
          : item
      ),
    }));
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    updateOrderState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== cartItemId),
    }));
  }, []);

  const clearCart = useCallback(() => {
    updateOrderState((prev) => {
      if (prev.cart.length === 0) return prev;
      return { ...prev, cart: [] };
    });
  }, []);

  const submitOrderToKitchen = useCallback(() => {
    updateOrderState((prev) => {
      if (prev.cart.length === 0) return prev;

      const currentRoundNumber = (prev.tableOrder?.rounds.length || 0) + 1;

      const newPlacedItems: PlacedOrderItem[] = prev.cart.map((c) => ({
        id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        menuItem: c.menuItem,
        quantity: c.quantity,
        selectedOptions: c.selectedOptions,
        specialInstructions: c.specialInstructions,
        unitPrice: c.unitPrice,
        subtotal: c.subtotal,
        status: "pending",
        round: currentRoundNumber,
      }));

      const newRound: OrderRound = {
        roundNumber: currentRoundNumber,
        placedAt: new Date().toISOString(),
        items: newPlacedItems,
      };

      const existingRounds = prev.tableOrder?.rounds || [];
      const updatedRounds = [...existingRounds, newRound];

      // Calculate total subtotal across all rounds
      const accumulatedSubtotal = updatedRounds.reduce(
        (sum, r) =>
          sum + r.items.reduce((rSum, item) => rSum + item.subtotal, 0),
        0
      );

      const serviceCharge = Math.round(
        accumulatedSubtotal * INITIAL_RESTAURANT_CONFIG.serviceChargeRate
      );
      const vat = Math.round(
        (accumulatedSubtotal + serviceCharge) * INITIAL_RESTAURANT_CONFIG.vatRate
      );
      const total = accumulatedSubtotal + serviceCharge + vat;

      const updatedTableOrder: TableOrderRecord = {
        orderId: prev.tableOrder?.orderId || `ord-${Date.now()}`,
        orderNumber:
          prev.tableOrder?.orderNumber ||
          `ORD-${Math.floor(100 + Math.random() * 900)}`,
        tableId: prev.tableId,
        guestCount: prev.guestCount,
        createdAt: prev.tableOrder?.createdAt || new Date().toISOString(),
        rounds: updatedRounds,
        subtotal: accumulatedSubtotal,
        serviceCharge,
        vat,
        total,
        status: "active",
      };

      return {
        ...prev,
        cart: [],
        tableOrder: updatedTableOrder,
        tables: prev.tables.map((t) =>
          t.id === prev.tableId ? { ...t, status: "active" as const } : t
        ),
      };
    });

    setIsCartOpen(false);
  }, []);

  const updateOrderItemStatus = useCallback((itemId: string, status: OrderItemStatus) => {
    updateOrderState((prev) => {
      if (!prev.tableOrder) return prev;
      const updatedRounds = prev.tableOrder.rounds.map((r) => ({
        ...r,
        items: r.items.map((i) => (i.id === itemId ? { ...i, status } : i)),
      }));

      return {
        ...prev,
        tableOrder: {
          ...prev.tableOrder,
          rounds: updatedRounds,
        },
      };
    });
  }, []);

  const markRoundServed = useCallback((roundNumber: number) => {
    updateOrderState((prev) => {
      if (!prev.tableOrder) return prev;
      const updatedRounds = prev.tableOrder.rounds.map((r) =>
        r.roundNumber === roundNumber
          ? {
              ...r,
              items: r.items.map((i) => ({ ...i, status: "served" as const })),
            }
          : r
      );

      return {
        ...prev,
        tableOrder: {
          ...prev.tableOrder,
          rounds: updatedRounds,
        },
      };
    });
  }, []);

  const requestServiceCall = useCallback(
    (type: ServiceCallType, title: string, details?: ServiceCallDetails) => {
      updateOrderState((prev) => {
        const newCall: ServiceCallRequest = {
          id: `call-${Date.now()}`,
          tableId: prev.tableId,
          type,
          title,
          requestedAt: new Date().toISOString(),
          status: "pending",
          ...details,
        };

        return {
          ...prev,
          serviceCalls: [newCall, ...prev.serviceCalls.slice(0, 9)],
        };
      });
    },
    []
  );

  const resolveServiceCall = useCallback((callId: string) => {
    updateOrderState((prev) => ({
      ...prev,
      serviceCalls: prev.serviceCalls.map((c) =>
        c.id === callId ? { ...c, status: "resolved" as const } : c
      ),
    }));
  }, []);

  const payBill = useCallback((paymentMethod: "onepay" | "cash" | "card") => {
    updateOrderState((prev) => {
      if (!prev.tableOrder) return prev;
      return {
        ...prev,
        tableOrder: {
          ...prev.tableOrder,
          status: "paid",
          paymentMethod,
        },
        tables: prev.tables.map((t) =>
          t.id === prev.tableId ? { ...t, status: "available" as const } : t
        ),
      };
    });
  }, []);

  const resetSandbox = useCallback((tableId = "T04") => {
    resetOrderSandbox(tableId);
    setIsCartOpen(false);
    setIsServiceModalOpen(false);
    setIsBillModalOpen(false);
    setIsSettingsOpen(false);
  }, []);

  const contextValue = useMemo<OrderContextValue>(
    () => ({
      isMounted,
      state,
      tableId: state.tableId,
      guestCount: state.guestCount,
      currency: state.currency,
      cart: state.cart,
      cartCount,
      cartSubtotal,
      tableOrder: state.tableOrder,
      serviceCalls: state.serviceCalls,
      isCartOpen,
      setIsCartOpen,
      isServiceModalOpen,
      setIsServiceModalOpen,
      isBillModalOpen,
      setIsBillModalOpen,
      isSettingsOpen,
      setIsSettingsOpen,
      customizingItem,
      setCustomizingItem,
      setTableId,
      setGuestCount,
      setCurrency,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      submitOrderToKitchen,
      updateOrderItemStatus,
      markRoundServed,
      requestServiceCall,
      resolveServiceCall,
      payBill,
      resetSandbox,
      formatStorePrice,
    }),
    [
      isMounted,
      state,
      cartCount,
      cartSubtotal,
      isCartOpen,
      isServiceModalOpen,
      isBillModalOpen,
      isSettingsOpen,
      customizingItem,
      setTableId,
      setGuestCount,
      setCurrency,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      submitOrderToKitchen,
      updateOrderItemStatus,
      markRoundServed,
      requestServiceCall,
      resolveServiceCall,
      payBill,
      resetSandbox,
      formatStorePrice,
    ]
  );

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return ctx;
}
