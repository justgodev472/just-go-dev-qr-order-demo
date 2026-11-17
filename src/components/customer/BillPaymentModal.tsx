"use client";

import React, { useState } from "react";
import {
  X,
  QrCode,
  Banknote,
  CreditCard,
  CheckCircle2,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { useBackToClose } from "@/lib/useBackToClose";

export function BillPaymentModal() {
  const { dictionary } = useLanguage();
  const {
    isBillModalOpen,
    setIsBillModalOpen,
    tableOrder,
    formatStorePrice,
    tableId,
    payBill,
    resetSandbox,
  } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState<"onepay" | "cash" | "card">("onepay");
  const [isPaid, setIsPaid] = useState(false);

  useBackToClose(isBillModalOpen, () => {
    if (!isPaid) setIsBillModalOpen(false);
  });

  if (!isBillModalOpen) return null;

  const total = tableOrder?.total || 0;

  const handleConfirmPay = () => {
    payBill(paymentMethod);
    setIsPaid(true);
  };

  const handleFinish = () => {
    resetSandbox(tableId);
    setIsPaid(false);
    setIsBillModalOpen(false);
  };

  return (
    <div
      onClick={() => !isPaid && setIsBillModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-card rounded-t-3xl sm:rounded-3xl p-5 border border-border shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 space-y-4 pb-safe max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div>
            <h3 className="font-bold text-sm text-foreground">
              {dictionary.bill.title} ({dictionary.brand.table} {tableId})
            </h3>
            <p className="text-[11px] text-muted-foreground font-normal">
              {dictionary.bill.desc}
            </p>
          </div>
          {!isPaid && (
            <button
              type="button"
              onClick={() => setIsBillModalOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isPaid ? (
          /* Payment Success & E-Receipt */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-foreground">
                {dictionary.bill.paidSuccessfully}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                {dictionary.bill.thankYouDesc}
              </p>
            </div>

            {/* Mini E-Receipt Box */}
            <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-left text-xs space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{dictionary.bill.tableNumber}:</span>
                <span className="font-bold text-foreground">{tableId}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Total Paid:</span>
                <span className="font-bold text-primary text-sm">
                  {formatStorePrice(total)}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground text-[11px]">
                <span>Payment Mode:</span>
                <span className="uppercase font-semibold text-foreground">
                  {paymentMethod}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{dictionary.bill.backToHome}</span>
            </button>
          </div>
        ) : (
          /* Bill Breakdown & Payment Selector */
          <div className="space-y-4">
            {/* Bill Summary */}
            <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border text-xs space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>{dictionary.cart.subtotal}:</span>
                <span className="font-semibold text-foreground">
                  {formatStorePrice(tableOrder?.subtotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>{dictionary.cart.serviceCharge}:</span>
                <span className="font-semibold text-foreground">
                  {formatStorePrice(tableOrder?.serviceCharge || 0)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>{dictionary.cart.vat}:</span>
                <span className="font-semibold text-foreground">
                  {formatStorePrice(tableOrder?.vat || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-border/60">
                <span className="text-foreground">{dictionary.cart.total}:</span>
                <span className="text-base text-primary">
                  {formatStorePrice(total)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                {dictionary.bill.paymentMethods}
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("onepay")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                    paymentMethod === "onepay"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">OnePay QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-[11px]">{dictionary.bill.cash}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">{dictionary.bill.card}</span>
                </button>
              </div>
            </div>

            {/* QR Mock Display for OnePay */}
            {paymentMethod === "onepay" && (
              <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-2.5">
                <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs mx-auto flex items-center justify-center">
                  {/* Real visual QR pattern representation */}
                  <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2 text-center">
                    <QrCode className="w-14 h-14" />
                    <span className="text-[9px] font-mono tracking-tight mt-1">
                      ONEPAY • {tableId}
                    </span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-foreground">
                    {dictionary.bill.scanToPay}
                  </h5>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    {dictionary.bill.scanDesc}
                  </p>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleConfirmPay}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>
                {paymentMethod === "onepay"
                  ? "ຈຳລອງການຈ່າຍເງິນ OnePay (Simulate)"
                  : "ຢືນຢັນການຊຳລະເງິນ"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
