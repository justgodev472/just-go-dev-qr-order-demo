"use client";

import React from "react";
import { Plus, Clock, Sparkles } from "lucide-react";
import { MenuItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const { locale, dictionary } = useLanguage();
  const { formatStorePrice, addToCart } = useOrder();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    // If item has option groups (e.g. sweetness, spiciness), open customize modal
    if (item.optionGroups && item.optionGroups.length > 0) {
      onSelect(item);
      return;
    }

    // Otherwise add directly
    addToCart(item, 1, []);
  };

  return (
    <div
      onClick={() => item.isAvailable && onSelect(item)}
      className={`group flex flex-col rounded-2xl bg-card border border-border shadow-xs overflow-hidden transition-all text-left ${
        item.isAvailable
          ? "cursor-pointer active:scale-[0.98] hover:border-primary/40 hover:shadow-sm"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Food Image & Badge */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name[locale]}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {item.isPopular && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" />
            {dictionary.menu.popular}
          </span>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center">
            <span className="px-2.5 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded-lg border border-destructive/20">
              {dictionary.menu.soldOut}
            </span>
          </div>
        )}

        <div className="absolute bottom-1.5 right-2 px-1.5 py-0.5 bg-background/85 backdrop-blur-md text-muted-foreground text-[10px] font-medium rounded-md flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          <span>
            {item.preparationTimeMinutes} {dictionary.menu.mins}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.name[locale]}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug font-normal">
            {item.description[locale]}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
          <span className="text-xs sm:text-sm font-bold text-foreground">
            {formatStorePrice(item.price)}
          </span>

          {item.isAvailable && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-7 h-7 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center cursor-pointer transition-transform active:scale-90 shadow-xs"
              title={dictionary.menu.add}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
