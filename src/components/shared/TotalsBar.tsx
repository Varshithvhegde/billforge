"use client";
import React from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { calculateTotals, formatCurrency } from "@/lib/calculations";

export function TotalsBar() {
  const { data } = useInvoiceStore();
  const { subtotal, gstAmount, total } = calculateTotals(data);

  return (
    <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between gap-4 text-xs flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="text-zinc-500">
          Subtotal: <span className="text-zinc-300 font-medium">{formatCurrency(subtotal, data.currency)}</span>
        </div>
        {data.enableGST && gstAmount > 0 && (
          <div className="text-zinc-500">
            GST ({data.gstRate}%): <span className="text-zinc-300 font-medium">{formatCurrency(gstAmount, data.currency)}</span>
          </div>
        )}
      </div>
      <div className="text-sm font-semibold text-white">
        Total: <span className="text-indigo-400">{formatCurrency(total, data.currency)}</span>
      </div>
    </div>
  );
}
