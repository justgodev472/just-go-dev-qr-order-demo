"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Utensils, ChefHat } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { INITIAL_TABLES } from "@/data";

export default function RootHomePage() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const { tableId, setTableId } = useOrder();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-lg shadow-primary/25 animate-bounce">
        <Utensils className="w-8 h-8" />
      </div>

      <h1 className="text-xl font-bold text-foreground">
        {dictionary.brand.name}
      </h1>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed font-normal">
        {dictionary.brand.tagline}
      </p>

      {/* Table Selector Box */}
      <div className="mt-6 w-full p-4 rounded-2xl bg-card border border-border shadow-xs text-left space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span>ເລືອກໂຕ໊ະເພື່ອທົດລອງ (Select Table):</span>
          <span className="text-primary">{tableId}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {INITIAL_TABLES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTableId(t.id);
                router.push(`/table/${t.id}`);
              }}
              className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                tableId === t.id
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-secondary text-foreground border-border hover:border-primary/40"
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 w-full">
        <Link
          href={`/table/${tableId || "T04"}`}
          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <span>ເຂົ້າສູ່ໜ້າຮ້ານ (Enter Table {tableId || "T04"})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/admin/kitchen"
          className="w-full py-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium flex items-center justify-center gap-1.5 border border-border"
        >
          <ChefHat className="w-4 h-4 text-orange-500" />
          <span>ເບິ່ງຈໍຫ້ອງຄົວ (Kitchen KDS)</span>
        </Link>
      </div>
    </div>
  );
}
