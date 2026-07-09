"use client";
import React from "react";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { calculateTotals, formatCurrency, formatDate } from "@/lib/calculations";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { BoldTemplate } from "./templates/BoldTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { StudioTemplate } from "./templates/StudioTemplate";
import { SlateTemplate } from "./templates/SlateTemplate";
import { NeonTemplate } from "./templates/NeonTemplate";
import { TerraTemplate } from "./templates/TerraTemplate";
import { ArcticTemplate } from "./templates/ArcticTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";

const TEMPLATE_MAP = {
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  bold: BoldTemplate,
  elegant: ElegantTemplate,
  studio: StudioTemplate,
  slate: SlateTemplate,
  neon: NeonTemplate,
  terra: TerraTemplate,
  arctic: ArcticTemplate,
  executive: ExecutiveTemplate,
};

interface Props {
  data: InvoiceData;
  templateId: TemplateId;
}

export function InvoicePreview({ data, templateId }: Props) {
  const totals = calculateTotals(data);
  const Template = TEMPLATE_MAP[templateId] ?? MinimalTemplate;
  const props = { data, totals, formatCurrency, formatDate };

  return (
    <div id="invoice-preview" className="w-[794px] min-h-[1123px] bg-white shadow-2xl">
      <Template {...props} />
    </div>
  );
}
