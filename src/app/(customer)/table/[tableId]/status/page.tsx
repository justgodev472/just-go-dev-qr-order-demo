"use client";

import React, { useEffect, use } from "react";
import { LiveOrderStatusView } from "@/components/customer/LiveOrderStatusView";
import { useOrder } from "@/context/OrderContext";

export default function TableOrderStatusPage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const resolvedParams = use(params);
  const tableIdParam = resolvedParams.tableId || "T04";
  const { tableId, setTableId } = useOrder();

  useEffect(() => {
    if (tableIdParam && tableIdParam !== tableId) {
      setTableId(tableIdParam);
    }
  }, [tableIdParam, tableId, setTableId]);

  return <LiveOrderStatusView />;
}
