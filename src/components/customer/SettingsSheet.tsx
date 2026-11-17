"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X, Globe, Coins, ChefHat, RotateCcw, Check, Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { Locale } from "@/locales";
import { CurrencyCode } from "@/types";
import { useBackToClose } from "@/lib/useBackToClose";

const LOCALES: Locale[] = ["lo", "th", "en"];
const CURRENCIES: CurrencyCode[] = ["LAK", "THB", "USD"];

export function SettingsSheet() {
  const { locale, setLocale, dictionary } = useLanguage();
  const { isSettingsOpen, setIsSettingsOpen, tableId, currency, setCurrency, resetSandbox } =
    useOrder();

  const [confirmReset, setConfirmReset] = useState(false);

  const close = useCallback(() => {
    setIsSettingsOpen(false);
    setConfirmReset(false);
  }, [setIsSettingsOpen]);

  useBackToClose(isSettingsOpen, close);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSettingsOpen, close]);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = setTimeout(() => setConfirmReset(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmReset]);

  if (!isSettingsOpen) return null;

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetSandbox(tableId);
    close();
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={dictionary.settings.title}
        className="w-full max-w-md bg-card rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-border animate-in slide-in-from-bottom duration-300 pb-safe"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-foreground">
                {dictionary.settings.title}
              </h3>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                {dictionary.brand.table} {tableId} • {dictionary.settings.desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {/* Language */}
          <div className="p-3 rounded-2xl bg-secondary/30 border border-border space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Globe className="w-3.5 h-3.5" />
              <span>{dictionary.settings.language}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-card border border-border/60">
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  aria-pressed={locale === code}
                  className={`h-8 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer active:scale-95 ${
                    locale === code
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="p-3 rounded-2xl bg-secondary/30 border border-border space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Coins className="w-3.5 h-3.5" />
              <span>{dictionary.settings.currency}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-card border border-border/60">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  aria-pressed={currency === code}
                  className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                    currency === code
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Demo controls */}
          <div className="text-[11px] font-bold text-muted-foreground px-1 pt-1">
            {dictionary.settings.demoSection}
          </div>

          <Link
            href="/admin/kitchen"
            onClick={close}
            className="w-full p-3 rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 flex items-center gap-3 text-left transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-foreground">{dictionary.nav.kitchen}</h4>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer active:scale-[0.99] ${
              confirmReset
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "border-border bg-secondary/30 hover:bg-destructive/5 hover:border-destructive/40"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                confirmReset
                  ? "bg-white/20 text-destructive-foreground"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`text-xs font-bold ${confirmReset ? "" : "text-destructive"}`}>
                {confirmReset ? dictionary.settings.resetConfirm : dictionary.settings.reset}
              </h4>
              <p
                className={`text-[11px] font-normal ${
                  confirmReset ? "text-destructive-foreground/80" : "text-muted-foreground"
                }`}
              >
                {dictionary.settings.resetDesc}
              </p>
            </div>
            {confirmReset && <Check className="w-4 h-4 shrink-0" />}
          </button>
        </div>
      </div>
    </div>
  );
}
