"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LineItemsEditor() {
  const { data, addLineItem, removeLineItem, updateLineItem } = useInvoiceStore();

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[1fr_52px_72px_20px] gap-1.5 px-1">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Description</span>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-center">Qty</span>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-right">Rate</span>
        <span />
      </div>

      {data.lineItems.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr_52px_72px_20px] gap-1.5 items-center">
          <Input
            value={item.description}
            onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
            placeholder="Item description"
            className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 placeholder:text-zinc-600 focus:border-indigo-500/50"
          />
          <Input
            type="number"
            min="0"
            value={item.quantity}
            onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
            className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 text-center focus:border-indigo-500/50"
          />
          <Input
            type="number"
            min="0"
            value={item.rate}
            onChange={(e) => updateLineItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
            className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 text-right focus:border-indigo-500/50"
          />
          <button
            onClick={() => removeLineItem(item.id)}
            disabled={data.lineItems.length === 1}
            className="text-zinc-600 hover:text-red-400 disabled:opacity-20 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <button
        onClick={addLineItem}
        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 pl-1"
      >
        <Plus size={13} />
        Add item
      </button>
    </div>
  );
}
