"use client";

import React from "react";
import { TableHeader } from "@/components/customer/TableHeader";
import { CustomerBottomBar } from "@/components/navigation/CustomerBottomBar";
import { ItemCustomizeModal } from "@/components/customer/ItemCustomizeModal";
import { TableCartDrawer } from "@/components/customer/TableCartDrawer";
import { CallServiceModal } from "@/components/customer/CallServiceModal";
import { BillPaymentModal } from "@/components/customer/BillPaymentModal";
import { SettingsSheet } from "@/components/customer/SettingsSheet";
import { useOrder } from "@/context/OrderContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customizingItem, setCustomizingItem } = useOrder();

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col justify-between max-w-md mx-auto relative border-x border-border/40 shadow-xl pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      {/* Sticky Header */}
      <TableHeader />

      {/* Main Page Content */}
      <main className="flex-1 w-full px-4 pt-3">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <CustomerBottomBar />

      {/* Modals & Drawers */}
      <ItemCustomizeModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
      />
      <TableCartDrawer />
      <CallServiceModal />
      <BillPaymentModal />
      <SettingsSheet />
    </div>
  );
}
