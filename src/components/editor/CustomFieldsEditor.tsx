"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import { Input } from "@/components/ui/input";

export function CustomFieldsEditor() {
  const { data, addCustomField, removeCustomField, updateCustomField } = useInvoiceStore();

  return (
    <div className="space-y-2">
      {data.customFields.length === 0 && (
        <p className="text-[11px] text-zinc-600 leading-snug">
          Add custom fields like PO Number, Project Code, or any label/value pair that prints on the invoice.
        </p>
      )}
      {data.customFields.map((field) => (
        <div key={field.id} className="flex gap-1.5 items-center">
          <Input
            value={field.label}
            onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
            placeholder="Label"
            className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 placeholder:text-zinc-600 focus:border-indigo-500/50 w-[40%]"
          />
          <Input
            value={field.value}
            onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
            placeholder="Value"
            className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-xs h-7 placeholder:text-zinc-600 focus:border-indigo-500/50 flex-1"
          />
          <button
            onClick={() => removeCustomField(field.id)}
            className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={addCustomField}
        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pl-0.5"
      >
        <Plus size={13} /> Add field
      </button>
    </div>
  );
}
