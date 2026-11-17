"use client";

import React, { useState } from "react";
import { X, Trash2, Plus, Minus, Send, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { useBackToClose } from "@/lib/useBackToClose";

export function TableCartDrawer() {
  const { locale, dictionary } = useLanguage();
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    submitOrderToKitchen,
    formatStorePrice,
    tableId,
  } = useOrder();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useBackToClose(isCartOpen, () => setIsCartOpen(false));

  if (!isCartOpen) return null;

  const serviceCharge = Math.round(cartSubtotal * 0.05);
  const vat = Math.round((cartSubtotal + serviceCharge) * 0.07);
  const netTotal = cartSubtotal + serviceCharge + vat;

  const handleSendOrder = () => {
    setConfirmModalOpen(false);
    submitOrderToKitchen();
  };

  return (
    <>
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-border animate-in slide-in-from-bottom duration-300 pb-safe"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {dictionary.cart.title}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {dictionary.brand.table} {tableId} • {cart.length}{" "}
                  {dictionary.cart.itemsCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  title={dictionary.cart.clearCart}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  {dictionary.cart.emptyTitle}
                </h4>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  {dictionary.cart.emptyDesc}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {item.menuItem.name[locale]}
                    </h4>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {item.selectedOptions.map((o) => o.name).join(", ")}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 truncate italic">
                        &quot;{item.specialInstructions}&quot;
                      </p>
                    )}
                    <span className="text-xs font-semibold text-primary mt-1 inline-block">
                      {formatStorePrice(item.subtotal)}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border rounded-xl bg-card p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer active:scale-90 transition-transform"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer active:scale-90 transition-transform"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Calculation & Send Button */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-border bg-card space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{dictionary.cart.subtotal}</span>
                  <span className="font-semibold text-foreground">
                    {formatStorePrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>{dictionary.cart.serviceCharge}</span>
                  <span className="font-semibold text-foreground">
                    {formatStorePrice(serviceCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>{dictionary.cart.vat}</span>
                  <span className="font-semibold text-foreground">
                    {formatStorePrice(vat)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-border/60">
                  <span className="text-foreground">{dictionary.cart.total}</span>
                  <span className="text-primary">{formatStorePrice(netTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{dictionary.cart.sendToKitchen}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card rounded-2xl p-5 border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Send className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-sm text-foreground">
                {dictionary.cart.confirmTitle}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                {dictionary.cart.confirmDesc}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                {dictionary.cart.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleSendOrder}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
              >
                {dictionary.cart.confirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
