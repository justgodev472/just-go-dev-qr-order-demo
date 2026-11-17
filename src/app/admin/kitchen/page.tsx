"use client";

import React from "react";
import Link from "next/link";
import {
  ChefHat,
  ArrowLeft,
  BellRing,
  Utensils,
  RotateCcw,
} from "lucide-react";
import { KitchenOrderCard } from "@/components/kitchen/KitchenOrderCard";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { serviceOptionName } from "@/data";
import { formatTime } from "@/lib/formatters";

export default function KitchenKdsPage() {
  const { dictionary, locale } = useLanguage();
  const {
    tableOrder,
    tableId,
    serviceCalls,
    resolveServiceCall,
    resetSandbox,
  } = useOrder();

  const pendingServiceCalls = serviceCalls.filter((c) => c.status === "pending");

  return (
    <div className="min-h-screen bg-background text-foreground max-w-xl mx-auto p-4 space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href={`/table/${tableId || "T04"}`}
            className="w-8 h-8 rounded-xl bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">
                {dictionary.kitchen.title}
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                Live Kitchen Display System
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => resetSandbox(tableId)}
          className="h-8 px-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium border border-border flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset Demo Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Pending Service Calls */}
      {pendingServiceCalls.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1 text-xs font-bold text-muted-foreground">
            <BellRing className="w-3.5 h-3.5 text-amber-500" />
            <span>{dictionary.kitchen.serviceRequests}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
              {pendingServiceCalls.length}
            </span>
          </div>

          {pendingServiceCalls.map((call) => {
            const unit =
              call.type === "water"
                ? dictionary.service.unitGlass
                : dictionary.service.unitPiece;
            const detailItems =
              call.items && call.items.length > 0
                ? call.items
                : (call.kindIds ?? []).map((id) => ({
                    id,
                    quantity: call.quantity ?? 1,
                  }));
            const detailParts = detailItems.map(
              (item) =>
                `${serviceOptionName(item.id, locale)} × ${item.quantity} ${unit}`
            );

            return (
              <div
                key={call.id}
                className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <BellRing className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                    <span className="font-bold text-foreground shrink-0">
                      {call.tableId}:
                    </span>
                    <span className="font-bold text-foreground truncate">
                      {call.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                      {formatTime(call.requestedAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => resolveServiceCall(call.id)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    {dictionary.kitchen.done}
                  </button>
                </div>

                {detailParts.length > 0 && (
                  <p className="pl-6 text-[11px] font-medium text-foreground">
                    {detailParts.join(" · ")}
                  </p>
                )}

                {call.note && (
                  <p className="pl-6 text-[11px] italic text-amber-700 dark:text-amber-400">
                    &ldquo;{call.note}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Active Orders List */}
      <div className="space-y-3">
        {!tableOrder || tableOrder.rounds.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                ຍັງບໍ່ມີອໍເດີໃນຄົວ (No Orders)
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                ກະລຸນາໄປທີ່ໜ້າໂຕ໊ະລູກຄ້າ ແລ້ວກົດສັ່ງອາຫານສົ່ງເຂົ້າຄົວເພື່ອທົດສອບ
              </p>
            </div>
            <Link
              href={`/table/${tableId || "T04"}`}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs"
            >
              ໄປທີ່ໂຕ໊ະ {tableId || "T04"}
            </Link>
          </div>
        ) : (
          tableOrder.rounds.map((round) => (
            <KitchenOrderCard
              key={round.roundNumber}
              tableId={tableOrder.tableId}
              round={round}
            />
          ))
        )}
      </div>
    </div>
  );
}
