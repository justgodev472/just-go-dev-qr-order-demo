"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Check, AlertCircle } from "lucide-react";
import { MenuItem, SelectedOption } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { useBackToClose } from "@/lib/useBackToClose";

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function ItemCustomizeModal({ item, onClose }: ItemCustomizeModalProps) {
  const { locale, dictionary } = useLanguage();
  const { formatStorePrice, addToCart } = useOrder();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [specialNote, setSpecialNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useBackToClose(Boolean(item), onClose);

  // Initialize default options when item opens
  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSpecialNote("");
    setErrorMsg("");

    const defaults: SelectedOption[] = [];
    item.optionGroups?.forEach((group) => {
      // If required single choice, pick the first option as default
      if (group.required && group.maxSelect === 1 && group.options.length > 0) {
        defaults.push({
          groupId: group.id,
          optionId: group.options[0].id,
          name: group.options[0].name[locale],
          priceExtra: group.options[0].priceExtra,
        });
      }
    });

    setSelectedOptions(defaults);
  }, [item, locale]);

  if (!item) return null;

  const handleSelectOption = (
    groupId: string,
    optionId: string,
    name: string,
    priceExtra: number,
    isSingle: boolean
  ) => {
    setErrorMsg("");
    if (isSingle) {
      // Replace option in this group
      setSelectedOptions((prev) => [
        ...prev.filter((o) => o.groupId !== groupId),
        { groupId, optionId, name, priceExtra },
      ]);
    } else {
      // Toggle checkbox
      const exists = selectedOptions.some(
        (o) => o.groupId === groupId && o.optionId === optionId
      );
      if (exists) {
        setSelectedOptions((prev) =>
          prev.filter(
            (o) => !(o.groupId === groupId && o.optionId === optionId)
          )
        );
      } else {
        setSelectedOptions((prev) => [
          ...prev,
          { groupId, optionId, name, priceExtra },
        ]);
      }
    }
  };

  // Calculate total price for this customized dish
  const extraTotal = selectedOptions.reduce(
    (sum, opt) => sum + opt.priceExtra,
    0
  );
  const unitPrice = item.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirmAddToCart = () => {
    // Validate required groups
    const missingGroup = item.optionGroups?.find((group) => {
      if (!group.required) return false;
      return !selectedOptions.some((o) => o.groupId === group.id);
    });

    if (missingGroup) {
      setErrorMsg(`ກະລຸນາເລືອກ: ${missingGroup.title[locale]}`);
      return;
    }

    addToCart(item, quantity, selectedOptions, specialNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-card rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl border-t border-border animate-in slide-in-from-bottom duration-300 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Image */}
        <div className="relative w-full aspect-[16/9] bg-muted shrink-0 rounded-t-3xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name[locale]}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md text-foreground flex items-center justify-center cursor-pointer hover:bg-background transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Options List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {item.name[locale]}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-normal leading-relaxed">
              {item.description[locale]}
            </p>
            <div className="mt-2 text-sm font-extrabold text-primary">
              {formatStorePrice(item.price)}
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Option Groups */}
          {item.optionGroups?.map((group) => {
            const isSingle = group.maxSelect === 1;

            return (
              <div key={group.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">
                    {group.title[locale]}
                  </h4>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {group.required
                      ? dictionary.menu.required
                      : dictionary.menu.optional}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedOptions.some(
                      (o) => o.groupId === group.id && o.optionId === opt.id
                    );

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          handleSelectOption(
                            group.id,
                            opt.id,
                            opt.name[locale],
                            opt.priceExtra,
                            isSingle
                          )
                        }
                        className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary/80 bg-accent text-foreground ring-1 ring-primary/20 shadow-xs"
                            : "border-border bg-card text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <span className="text-xs font-medium">
                          {opt.name[locale]}
                        </span>

                        <div className="flex items-center gap-2">
                          {opt.priceExtra > 0 && (
                            <span className="text-[11px] font-semibold text-primary">
                              +{formatStorePrice(opt.priceExtra)}
                            </span>
                          )}

                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "border border-border"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">
              {dictionary.menu.specialNotePlaceholder.split("(")[0]}
            </h4>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder={dictionary.menu.specialNotePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Footer Actions: Quantity Stepper & Add to Cart */}
        <div className="p-4 border-t border-border bg-card flex items-center gap-3 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center border border-border rounded-xl bg-secondary/30 p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer active:scale-90 transition-transform"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer active:scale-90 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>{dictionary.menu.addToCart}</span>
            <span>{formatStorePrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
