"use client";

import React, { useEffect, use } from "react";
import { useOrder } from "@/context/OrderContext";

export default function TableOrderBillPage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const resolvedParams = use(params);
  const tableIdParam = resolvedParams.tableId || "T04";
  const { tableId, setTableId, setIsBillModalOpen } = useOrder();

  useEffect(() => {
    if (tableIdParam && tableIdParam !== tableId) {
      setTableId(tableIdParam);
    }
    setIsBillModalOpen(true);
  }, [tableIdParam, tableId, setTableId, setIsBillModalOpen]);

  return (
    <div className="py-20 text-center">
      <p className="text-xs text-muted-foreground animate-pulse">
        ກຳລັງເປີດໜ້າຈໍສະຫຼຸບບິນ...
      </p>
    </div>
  );
}
