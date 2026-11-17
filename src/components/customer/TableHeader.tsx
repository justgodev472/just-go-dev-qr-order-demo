"use client";

import React from "react";
import { Utensils, Users, Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";

export function TableHeader() {
  const { dictionary } = useLanguage();
  const { tableId, guestCount, setGuestCount, setIsSettingsOpen } = useOrder();

  return (
    <header className="sticky top-0 z-30 w-full bg-card border-b border-border">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand & Table ID */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg tracking-tight shrink-0 shadow-xs whitespace-nowrap">
                {dictionary.brand.table} {tableId}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount(guestCount >= 6 ? 1 : guestCount + 1)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground bg-secondary px-1.5 py-0.5 rounded-md border border-border cursor-pointer transition-colors whitespace-nowrap"
                title={dictionary.brand.guests}
              >
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="font-semibold">{guestCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label={dictionary.settings.title}
            title={dictionary.settings.title}
            className="h-8 w-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border flex items-center justify-center cursor-pointer transition-colors hover:bg-secondary/80 active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
