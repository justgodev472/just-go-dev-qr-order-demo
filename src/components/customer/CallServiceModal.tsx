"use client";

import React, { useState } from "react";
import {
  X,
  Bell,
  Droplets,
  Utensils,
  Receipt,
  CheckCircle2,
  BellRing,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { ServiceCallType } from "@/types";
import { CUTLERY_KINDS, WATER_KINDS, ServiceOption } from "@/data";
import { useBackToClose } from "@/lib/useBackToClose";

type Step = "type" | "details" | "sent";
type SelectedMap = Record<string, number>;

function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 9,
  unit,
  onRemove,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  unit: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-secondary/30 border border-border">
      <span className="text-[11px] font-bold text-foreground truncate">{unit}</span>
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center gap-1 border border-border rounded-lg bg-card p-0.5">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            aria-label="qty-decrease"
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer active:scale-90 transition-transform"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-5 text-center text-xs font-bold text-foreground">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            aria-label="qty-increase"
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer active:scale-90 transition-transform"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="remove-item"
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive cursor-pointer active:scale-90 transition-transform"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function MultiPicker({
  options,
  values,
  onChange,
  locale,
}: {
  options: ServiceOption[];
  values: SelectedMap;
  onChange: (next: SelectedMap) => void;
  locale: "lo" | "th" | "en";
}) {
  const chosen = options.filter((option) => values[option.id] !== undefined);
  const available = options.filter((option) => values[option.id] === undefined);

  const setQty = (id: string, quantity: number) =>
    onChange({ ...values, [id]: quantity });

  const remove = (id: string) => {
    const next = { ...values };
    delete next[id];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setQty(option.id, 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold bg-secondary/40 text-muted-foreground border border-border hover:text-foreground hover:bg-secondary/70 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>{option.name[locale]}</span>
            </button>
          ))}
        </div>
      )}

      {chosen.map((option) => (
        <QtyStepper
          key={option.id}
          value={values[option.id]}
          unit={option.name[locale]}
          onChange={(next) => setQty(option.id, next)}
          onRemove={() => remove(option.id)}
        />
      ))}
    </div>
  );
}

export function CallServiceModal() {
  const { dictionary, locale } = useLanguage();
  const {
    isServiceModalOpen,
    setIsServiceModalOpen,
    requestServiceCall,
    tableId,
  } = useOrder();

  const [step, setStep] = useState<Step>("type");
  const [activeType, setActiveType] = useState<ServiceCallType | null>(null);
  const [selected, setSelected] = useState<SelectedMap>({});
  const [note, setNote] = useState("");

  useBackToClose(isServiceModalOpen, () => {
    setIsServiceModalOpen(false);
    setStep("type");
    setActiveType(null);
    setSelected({});
    setNote("");
  });

  if (!isServiceModalOpen) return null;

  const services: {
    type: ServiceCallType;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
  }[] = [
    {
      type: "waiter",
      icon: Bell,
      title: dictionary.service.callWaiter,
      desc: dictionary.service.callWaiterDesc,
    },
    {
      type: "water",
      icon: Droplets,
      title: dictionary.service.refillWater,
      desc: dictionary.service.refillWaterDesc,
    },
    {
      type: "spoon",
      icon: Utensils,
      title: dictionary.service.extraCutlery,
      desc: dictionary.service.extraCutleryDesc,
    },
    {
      type: "bill",
      icon: Receipt,
      title: dictionary.service.requestBill,
      desc: dictionary.service.requestBillDesc,
    },
  ];

  const resetDraft = () => {
    setStep("type");
    setActiveType(null);
    setSelected({});
    setNote("");
  };

  const close = () => {
    setIsServiceModalOpen(false);
    resetDraft();
  };

  const openDetails = (type: ServiceCallType) => {
    setActiveType(type);
    setSelected({});
    setNote("");
    setStep("details");
  };

  /** บริการที่ไม่ต้องกรอกอะไร: กดครั้งเดียวส่งเลย */
  const submitInstantly = (type: ServiceCallType) => {
    const service = services.find((item) => item.type === type);
    requestServiceCall(type, service?.title ?? "");
    setActiveType(type);
    setStep("sent");
    setTimeout(() => {
      setIsServiceModalOpen(false);
      resetDraft();
    }, 1600);
  };

  /** ปุ่ม X ใช้เป็น "ย้อนกลับ" เมื่ออยู่หน้ารายละเอียด */
  const handleCloseOrBack = () => {
    if (step === "details") {
      resetDraft();
      return;
    }
    close();
  };

  const isWater = activeType === "water";
  const isCutlery = activeType === "spoon";
  const needsDetails = isWater || isCutlery;
  const itemEntries = Object.entries(selected);
  const canSubmit = !needsDetails || itemEntries.length > 0;

  const submit = () => {
    if (!activeType || !canSubmit) return;
    const service = services.find((item) => item.type === activeType);
    requestServiceCall(activeType, service?.title ?? "", {
      items: itemEntries.map(([id, quantity]) => ({ id, quantity })),
      note: note.trim() ? note.trim() : undefined,
    });
    setStep("sent");
    setTimeout(() => {
      setIsServiceModalOpen(false);
      resetDraft();
    }, 1600);
  };

  const activeService = services.find((item) => item.type === activeType);

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={dictionary.service.title}
        className="w-full max-w-md bg-card rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-border animate-in slide-in-from-bottom duration-300 pb-safe"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {step === "details" ? (
                <BellRing className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate">
                {step === "details" && activeService
                  ? `${activeService.title} · ${dictionary.service.detailsTitle}`
                  : `${dictionary.service.title} (${dictionary.brand.table} ${tableId})`}
              </h3>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                {step === "details" && activeService
                  ? activeService.desc
                  : dictionary.service.desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseOrBack}
            aria-label={step === "details" ? dictionary.service.back : undefined}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {step === "sent" ? (
            <div className="py-12 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {dictionary.service.requestSent}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dictionary.service.pendingStaff}
                </p>
              </div>
            </div>
          ) : step === "details" ? (
            <div className="space-y-3">
              {isWater && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground">
                    {dictionary.service.waterKind}
                  </p>
                  <MultiPicker
                    options={WATER_KINDS}
                    values={selected}
                    onChange={setSelected}
                    locale={locale}
                  />
                </div>
              )}

              {isCutlery && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground">
                    {dictionary.service.cutleryKind}
                  </p>
                  <MultiPicker
                    options={CUTLERY_KINDS}
                    values={selected}
                    onChange={setSelected}
                    locale={locale}
                  />
                </div>
              )}

              <p className="text-[11px] font-bold text-muted-foreground pt-1">
                {dictionary.service.noteLabel}
              </p>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                maxLength={120}
                placeholder={dictionary.service.notePlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-secondary/30 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary resize-none"
              />

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.99] transition-all"
              >
                <BellRing className="w-4 h-4" />
                <span>{dictionary.service.confirm}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {services.map((srv) => {
                const Icon = srv.icon;

                return (
                  <button
                    key={srv.type}
                    type="button"
                    onClick={() =>
                      srv.type === "waiter" || srv.type === "bill"
                        ? submitInstantly(srv.type)
                        : openDetails(srv.type)
                    }
                    className="w-full p-3 rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 flex items-center gap-3 text-left transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-foreground">{srv.title}</h4>
                      <p className="text-[11px] text-muted-foreground truncate font-normal">
                        {srv.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
