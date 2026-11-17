"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Utensils,
  Receipt,
  BellRing,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { formatTime } from "@/lib/formatters";
import { OrderItemStatus } from "@/types";

export function LiveOrderStatusView() {
  const { locale, dictionary } = useLanguage();
  const {
    tableId,
    tableOrder,
    formatStorePrice,
    setIsServiceModalOpen,
    setIsBillModalOpen,
  } = useOrder();

  const allItems =
    tableOrder?.rounds.flatMap((r) => r.items) || [];

  const totalItemsCount = allItems.reduce((sum, i) => sum + i.quantity, 0);
  const servedItemsCount = allItems
    .filter((i) => i.status === "served")
    .reduce((sum, i) => sum + i.quantity, 0);

  // ลำดับสถานะ: 1 รอครัวรับ → 2 กำลังปรุง → 3 กำลังมาเสิร์ฟ → 4 เสิร์ฟแล้ว
  const STEP_RANK: Record<OrderItemStatus, number> = {
    pending: 1,
    accepted: 2,
    cooking: 2,
    serving: 3,
    served: 4,
    cancelled: 4,
  };
  const activeItems = allItems.filter((i) => i.status !== "cancelled");
  const currentStep = activeItems.length
    ? Math.min(...activeItems.map((i) => STEP_RANK[i.status]))
    : 1;

  const steps = [
    { num: 1, label: dictionary.status.stepPending, icon: Clock },
    { num: 2, label: dictionary.status.stepCooking, icon: ChefHat },
    { num: 3, label: dictionary.status.stepServing, icon: Sparkles },
    { num: 4, label: dictionary.status.stepServed, icon: CheckCircle2 },
  ];

  if (!tableOrder || tableOrder.rounds.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-3xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
          <Utensils className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">
            {dictionary.status.noActiveOrders}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            {dictionary.status.noActiveOrdersDesc}
          </p>
        </div>
        <Link
          href={`/table/${tableId}`}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
        >
          <span>{dictionary.nav.menu}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* 4-Step Stepper Progress Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <h3 className="text-xs font-bold text-foreground">
              {dictionary.status.title} ({tableOrder.orderNumber})
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {servedItemsCount}/{totalItemsCount} {dictionary.cart.itemsCount}
          </span>
        </div>

        {/* Stepper Graphic */}
        <div className="grid grid-cols-4 gap-1 relative pt-2">
          {steps.map((st) => {
            const Icon = st.icon;
            const isPassed = currentStep >= st.num;
            const isCurrent = currentStep === st.num;

            return (
              <div
                key={st.num}
                className="flex flex-col items-center text-center space-y-1.5"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20 scale-105"
                      : isPassed
                      ? "bg-emerald-500 text-white"
                      : "bg-secondary text-muted-foreground border border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-medium leading-tight ${
                    isCurrent
                      ? "text-primary font-bold"
                      : isPassed
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rounds Grouped List */}
      <div className="space-y-3">
        {tableOrder.rounds.map((round) => (
          <div
            key={round.roundNumber}
            className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-border/60">
              <span className="text-foreground">
                {dictionary.status.orderRound} #{round.roundNumber}
              </span>
              <span className="text-muted-foreground font-normal flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(round.placedAt)}
              </span>
            </div>

            <div className="space-y-2">
              {round.items.map((item) => {
                const isServed = item.status === "served";

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">
                          {item.quantity}×
                        </span>
                        <span
                          className={`font-medium truncate ${
                            isServed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {item.menuItem.name[locale]}
                        </span>
                      </div>
                      {item.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-muted-foreground truncate pl-4">
                          {item.selectedOptions.map((o) => o.name).join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                        item.status === "served"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : item.status === "serving"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {item.status === "served"
                        ? dictionary.status.stepServed
                        : item.status === "serving"
                        ? dictionary.status.stepServing
                        : item.status === "pending"
                        ? dictionary.status.stepPending
                        : dictionary.status.stepCooking}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bill & Service Quick Actions */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => setIsServiceModalOpen(true)}
          className="py-3 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <BellRing className="w-4 h-4 text-primary" />
          <span>{dictionary.status.callWaiterBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsBillModalOpen(true)}
          className="py-3 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Receipt className="w-4 h-4" />
          <span>{dictionary.status.requestBillBtn}</span>
        </button>
      </div>
    </div>
  );
}
