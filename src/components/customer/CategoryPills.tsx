"use client";

import React from "react";
import {
  Sparkles,
  UtensilsCrossed,
  Coffee,
  IceCream,
  Sandwich,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MenuCategory } from "@/types";

interface CategoryPillsProps {
  selectedCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  const { dictionary } = useLanguage();

  const categories: { id: MenuCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: dictionary.categories.all, icon: LayoutGrid },
    { id: "recommended", label: dictionary.categories.recommended, icon: Sparkles },
    { id: "food", label: dictionary.categories.food, icon: UtensilsCrossed },
    { id: "drinks", label: dictionary.categories.drinks, icon: Coffee },
    { id: "desserts", label: dictionary.categories.desserts, icon: IceCream },
    { id: "appetizers", label: dictionary.categories.appetizers, icon: Sandwich },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 touch-pan-x">
      <div className="flex items-center gap-2 px-4 min-w-max">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
