"use client";
import React, { useState } from "react";
import { Plus, Trash2, Settings2 } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ColumnConfig {
  unit: boolean;
  hsn: boolean;
  taxRate: boolean;
}

export function LineItemsEditor() {
  const { data, addLineItem, removeLineItem, updateLineItem } = useInvoiceStore();
  const [cols, setCols] = useState<ColumnConfig>({ unit: false, hsn: false, taxRate: false });

  const activeExtras = Object.entries(cols).filter(([, v]) => v);
  const extraCount = activeExtras.length;

  // Build grid template based on active columns
  // Base: description(1fr) qty(48px) rate(68px) delete(16px)
  // Extras inserted between description and qty
  const extraCols = [
    cols.unit && "56px",
    cols.hsn && "64px",
    cols.taxRate && "48px",
  ].filter(Boolean);
  const gridCols = `1fr ${extraCols.join(" ")} 48px 68px 16px`;

  return (
    <div className="space-y-2">
      {/* Column config toggle */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Items</span>
        <Popover>
          <PopoverTrigger className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
            <Settings2 size={11} />
            Columns {extraCount > 0 && <span className="text-indigo-400">+{extraCount}</span>}
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-zinc-900 border-white/[0.1] p-3 space-y-3" align="end">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-2">Extra Columns</p>
            {[
              { key: "unit" as const, label: "Unit (hrs/pcs/etc)" },
              { key: "hsn" as const, label: "HSN / SAC Code" },
              { key: "taxRate" as const, label: "Line Tax %" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`col-${key}`} className="text-xs text-zinc-400 cursor-pointer">{label}</Label>
                <Switch
                  id={`col-${key}`}
                  checked={cols[key]}
                  onCheckedChange={(v) => setCols((c) => ({ ...c, [key]: v }))}
                />
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Header row */}
      <div className="grid gap-1" style={{ gridTemplateColumns: gridCols }}>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider px-1">Description</span>
        {cols.unit && <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-center">Unit</span>}
        {cols.hsn && <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-center">HSN</span>}
        {cols.taxRate && <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-right">Tax%</span>}
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-center">Qty</span>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider text-right">Rate</span>
        <span />
      </div>

      {/* Item rows */}
      {data.lineItems.map((item) => (
        <div key={item.id} className="grid gap-1 items-center" style={{ gridTemplateColumns: gridCols }}>
          <Input
            value={item.description}
            onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
            placeholder="Item description"
            className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 placeholder:text-zinc-600 focus:border-indigo-500/50"
          />
          {cols.unit && (
            <Input
              value={item.unit || ""}
              onChange={(e) => updateLineItem(item.id, { unit: e.target.value })}
              placeholder="hrs"
              className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 text-center placeholder:text-zinc-600 focus:border-indigo-500/50"
            />
          )}
          {cols.hsn && (
            <Input
              value={(item as { hsn?: string }).hsn || ""}
              onChange={(e) => updateLineItem(item.id, { hsn: e.target.value } as never)}
              placeholder="9983"
              className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 text-center placeholder:text-zinc-600 focus:border-indigo-500/50"
            />
          )}
          {cols.taxRate && (
            <Input
              type="number"
              min="0"
              max="100"
              value={item.taxRate ?? ""}
              onChange={(e) => updateLineItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
              placeholder="18"
              className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 text-right placeholder:text-zinc-600 focus:border-indigo-500/50"
            />
          )}
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
            className="text-zinc-600 hover:text-red-400 disabled:opacity-20 transition-colors flex justify-center"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <button
        onClick={addLineItem}
        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 pl-0.5"
      >
        <Plus size={13} />
        Add item
      </button>
    </div>
  );
}
