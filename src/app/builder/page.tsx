"use client";
import React, { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { InvoicePreview } from "@/components/preview/InvoicePreview";
import { TemplateSidebar } from "@/components/sidebar/TemplateSidebar";
import { Topbar } from "@/components/shared/Topbar";
import { TotalsBar } from "@/components/shared/TotalsBar";
import { useInvoiceStore } from "@/store/invoice-store";
import { createClient } from "@/lib/supabase/client";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { calculateTotals } from "@/lib/calculations";

function BuilderInner() {
  const { data, templateId, update, setTemplate } = useInvoiceStore();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const loadedRef = useRef<string | null>(null);

  // Load document from Supabase when ?id= is present
  useEffect(() => {
    if (!docId || loadedRef.current === docId) return;
    loadedRef.current = docId;

    const supabase = createClient();
    supabase
      .from("documents")
      .select("*")
      .eq("id", docId)
      .single()
      .then(({ data: doc }) => {
        if (!doc) return;
        update(doc.data as InvoiceData);
        setTemplate(doc.template_id as TemplateId);
      });
  }, [docId, update, setTemplate]);

  // Auto-save every 30s for existing docs
  useEffect(() => {
    if (!docId) return;
    const interval = setInterval(async () => {
      const supabase = createClient();
      const { total } = calculateTotals(data);
      await supabase
        .from("documents")
        .update({
          data,
          template_id: templateId,
          total,
          client_name: data.toName || "",
          title: data.toName
            ? `${data.documentType === "invoice" ? "Invoice" : "Proposal"} for ${data.toName}`
            : data.invoiceNumber || "Untitled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", docId);
    }, 30000);
    return () => clearInterval(interval);
  }, [docId, data, templateId]);

  return (
    <div className="flex flex-col h-screen bg-[#111113] text-white overflow-hidden">
      <Topbar docId={docId ?? undefined} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 border-r border-white/[0.06] flex flex-col overflow-hidden">
          <EditorPanel />
          <TotalsBar />
        </div>

        <div className="flex-1 overflow-auto bg-[#0d0d0f]">
          <div className="flex justify-center items-start p-8 min-h-full">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-white/5 rounded-2xl transform scale-95 translate-y-4" />
              <div className="relative" style={{ width: 794 }}>
                <InvoicePreview data={data} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-52 flex-shrink-0 border-l border-white/[0.06] overflow-hidden">
          <TemplateSidebar />
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#111113]">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BuilderInner />
    </Suspense>
  );
}
