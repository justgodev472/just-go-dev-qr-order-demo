"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock3,
  BellRing,
  ChefHat,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";

export function CustomerBottomBar() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const {
    tableId,
    cartCount,
    setIsCartOpen,
    setIsServiceModalOpen,
    tableOrder,
  } = useOrder();

  const isMenu = pathname === `/table/${tableId}`;
  const isStatus = pathname === `/table/${tableId}/status`;
  const isBill = pathname === `/table/${tableId}/bill`;

  // Count active cooking items
  const activeOrdersCount =
    tableOrder?.rounds.reduce(
      (sum, r) =>
        sum + r.items.filter((i) => i.status !== "served" && i.status !== "cancelled").length,
      0
    ) || 0;

  return (
    <nav
      aria-label="Table Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl pb-safe"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-1">
        {/* 1. Menu Tab */}
        <Link
          href={`/table/${tableId}`}
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all active:scale-95"
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              isMenu && !isStatus && !isBill
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-medium mt-0.5 tracking-tight whitespace-nowrap leading-tight max-[359px]:text-[9px] ${
              isMenu && !isStatus && !isBill
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {dictionary.nav.menu}
          </span>
        </Link>

        {/* 2. Cart Tab (Drawer Trigger) */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all active:scale-95 relative"
        >
          <div className="relative p-1.5 rounded-xl text-muted-foreground hover:text-foreground">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-5 h-5 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5 tracking-tight whitespace-nowrap leading-tight max-[359px]:text-[9px] text-muted-foreground">
            {dictionary.nav.cart}
          </span>
        </button>

        {/* 3. Live Status Tab */}
        <Link
          href={`/table/${tableId}/status`}
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all active:scale-95 relative"
        >
          <div
            className={`relative p-1.5 rounded-xl transition-all ${
              isStatus
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock3 className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-5 h-5 px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-medium mt-0.5 tracking-tight whitespace-nowrap leading-tight max-[359px]:text-[9px] ${
              isStatus ? "text-primary font-semibold" : "text-muted-foreground"
            }`}
          >
            {dictionary.nav.status}
          </span>
        </Link>

        {/* 4. Call Service Tab (Modal Trigger) */}
        <button
          type="button"
          onClick={() => setIsServiceModalOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all active:scale-95"
        >
          <div className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground">
            <BellRing className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 tracking-tight whitespace-nowrap leading-tight max-[359px]:text-[9px] text-muted-foreground">
            {dictionary.nav.callService}
          </span>
        </button>
      </div>
    </nav>
  );
}
