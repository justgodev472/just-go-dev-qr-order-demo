"use client";

import React from "react";
import { ChefHat, CheckCircle2, Clock } from "lucide-react";
import { OrderRound, OrderItemStatus, PlacedOrderItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { formatTime } from "@/lib/formatters";

const STATUS_BADGE: Record<string, string> = {
  pending:
    "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  accepted: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  cooking:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  serving: "bg-primary/10 text-primary border-primary/20",
  served:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

interface KitchenOrderCardProps {
  tableId: string;
  round: OrderRound;
}

export function KitchenOrderCard({ tableId, round }: KitchenOrderCardProps) {
  const { locale, dictionary } = useLanguage();
  const { updateOrderItemStatus } = useOrder();

  const servedCount = round.items.filter((i) => i.status === "served").length;

  const statusLabel = (status: OrderItemStatus) => {
    switch (status) {
      case "pending":
        return dictionary.status.stepPending;
      case "accepted":
      case "cooking":
        return dictionary.status.stepCooking;
      case "serving":
        return dictionary.status.stepServing;
      case "served":
        return dictionary.status.stepServed;
      default:
        return dictionary.status.stepPending;
    }
  };

  /** ปุ่มถัดไปในลำดับ: รอรับ → รับแล้ว → ปรุง → กำลังมาเสิร์ฟ → เสิร์ฟแล้ว */
  const nextAction = (status: OrderItemStatus) => {
    switch (status) {
      case "pending":
        return {
          to: "cooking" as OrderItemStatus,
          label: dictionary.kitchen.accept,
          icon: ChefHat,
        };
      case "accepted":
      case "cooking":
        return {
          to: "serving" as OrderItemStatus,
          label: dictionary.kitchen.markServing,
          icon: Clock,
        };
      case "serving":
        return {
          to: "served" as OrderItemStatus,
          label: dictionary.kitchen.markServed,
          icon: CheckCircle2,
        };
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-3xl bg-card border border-border shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-xs">
            {tableId}
          </span>
          <span className="text-xs font-bold text-foreground">
            {dictionary.kitchen.round} #{round.roundNumber}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground">
            {servedCount}/{round.items.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatTime(round.placedAt)}</span>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2.5">
        {round.items.map((item: PlacedOrderItem) => {
          const action = nextAction(item.status);
          const ActionIcon = action?.icon;

          return (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-secondary/40 border border-border/60 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
                      {item.quantity}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        item.status === "served"
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {item.menuItem.name[locale]}
                    </span>
                  </div>
                  {item.selectedOptions.length > 0 && (
                    <p className="text-[10px] text-muted-foreground truncate pl-6">
                      {item.selectedOptions.map((o) => o.name).join(", ")}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 truncate pl-6 italic">
                      &quot;{item.specialInstructions}&quot;
                    </p>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                    STATUS_BADGE[item.status] ?? STATUS_BADGE.pending
                  }`}
                >
                  {statusLabel(item.status)}
                </span>
              </div>

              {action ? (
                <button
                  type="button"
                  onClick={() => updateOrderItemStatus(item.id, action.to)}
                  className="w-full py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-[0.99] transition-colors"
                >
                  {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                  <span>{action.label}</span>
                </button>
              ) : (
                <div className="w-full py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{dictionary.status.stepServed}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
