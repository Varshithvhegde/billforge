"use client";

import React from "react";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { calculateTotals, formatCurrency, formatDate } from "@/lib/calculations";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { BoldTemplate } from "./templates/BoldTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";

interface Props {
  data: InvoiceData;
  templateId: TemplateId;
}

export function InvoicePreview({ data, templateId }: Props) {
  const totals = calculateTotals(data);
  const props = { data, totals, formatCurrency, formatDate };

  const Template =
    templateId === "classic"
      ? ClassicTemplate
      : templateId === "bold"
      ? BoldTemplate
      : templateId === "elegant"
      ? ElegantTemplate
      : MinimalTemplate;

  return (
    <div
      id="invoice-preview"
      className="w-[794px] min-h-[1123px] bg-white shadow-2xl"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Template {...props} />
    </div>
  );
}
