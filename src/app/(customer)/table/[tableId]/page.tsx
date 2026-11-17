"use client";

import React, { useState, useEffect, use } from "react";
import { Search, X, Sparkles, Utensils } from "lucide-react";
import { CategoryPills } from "@/components/customer/CategoryPills";
import { MenuItemCard } from "@/components/customer/MenuItemCard";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { INITIAL_MENU_ITEMS } from "@/data";
import { MenuCategory, MenuItem } from "@/types";

export default function TableMenuPage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const resolvedParams = use(params);
  const tableIdParam = resolvedParams.tableId || "T04";

  const { locale, dictionary } = useLanguage();
  const { tableId, setTableId, setCustomizingItem } = useOrder();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tableId to context only when different
  useEffect(() => {
    if (tableIdParam && tableIdParam !== tableId) {
      setTableId(tableIdParam);
    }
  }, [tableIdParam, tableId, setTableId]);

  // Filter items by category and search
  const filteredItems = INITIAL_MENU_ITEMS.filter((item) => {
    // Category match
    const categoryMatch =
      selectedCategory === "all" ||
      (selectedCategory === "recommended" && item.isPopular) ||
      item.category === selectedCategory;

    if (!categoryMatch) return false;

    // Search query match
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const nameMatch =
      item.name.lo.toLowerCase().includes(query) ||
      item.name.th.toLowerCase().includes(query) ||
      item.name.en.toLowerCase().includes(query);
    const skuMatch = item.sku.toLowerCase().includes(query);

    return nameMatch || skuMatch;
  });

  return (
    <div className="space-y-3 pb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={dictionary.menu.searchPlaceholder}
          className="w-full pl-9.5 pr-8 py-2.5 rounded-2xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills (Touch Swipeable) */}
      <div className="-mx-4">
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Dishes Count Header */}
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pt-1 px-1">
        <span>
          {filteredItems.length} {dictionary.cart.itemsCount}
        </span>
        {selectedCategory === "recommended" && (
          <span className="flex items-center gap-1 text-primary text-[11px]">
            <Sparkles className="w-3 h-3" />
            {dictionary.categories.recommended}
          </span>
        )}
      </div>

      {/* 2-Column Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
            <Utensils className="w-6 h-6" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            ບໍ່ພົບລາຍການອາຫານທີ່ກົງກັບການຄົ້ນຫາ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelect={(selected) => setCustomizingItem(selected)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
