"use client";
import React from "react";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { InvoicePreview } from "@/components/preview/InvoicePreview";
import { TemplateSidebar } from "@/components/sidebar/TemplateSidebar";
import { Topbar } from "@/components/shared/Topbar";
import { TotalsBar } from "@/components/shared/TotalsBar";
import { useInvoiceStore } from "@/store/invoice-store";

export default function BuilderPage() {
  const { data, templateId } = useInvoiceStore();

  return (
    <div className="flex flex-col h-screen bg-[#111113] text-white overflow-hidden">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-72 flex-shrink-0 border-r border-white/[0.06] flex flex-col overflow-hidden">
          <EditorPanel />
          <TotalsBar />
        </div>

        {/* Center: A4 Preview */}
        <div className="flex-1 overflow-auto bg-[#0d0d0f]">
          <div className="flex justify-center items-start p-8 min-h-full">
            <div className="relative">
              {/* Page shadow */}
              <div className="absolute inset-0 blur-2xl bg-white/5 rounded-2xl transform scale-95 translate-y-4" />
              <div className="relative" style={{ width: 794 }}>
                <InvoicePreview data={data} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Template Picker */}
        <div className="w-52 flex-shrink-0 border-l border-white/[0.06] overflow-hidden">
          <TemplateSidebar />
        </div>
      </div>
    </div>
  );
}
