"use client";
import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { InvoicePreview } from "@/components/preview/InvoicePreview";
import type { InvoiceData, TemplateId } from "@/types/invoice";

interface Props {
  data: InvoiceData;
  templateId: TemplateId;
  title: string;
  status: "draft" | "sent" | "paid";
}

const STATUS_STYLES: Record<Props["status"], string> = {
  draft: "bg-zinc-700 text-zinc-300",
  sent: "bg-blue-500/20 text-blue-300",
  paid: "bg-emerald-500/20 text-emerald-300",
};

export function InvoiceViewClient({ data, templateId, title, status }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, templateId }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.documentType}-${data.invoiceNumber || "001"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 flex-shrink-0 bg-[#111113]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            BillForge
          </span>
        </div>

        {/* Center: title + status */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-zinc-200 truncate max-w-xs">
            {title}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[status]}`}
          >
            {status}
          </span>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 h-8 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-medium rounded-md transition-colors"
        >
          {downloading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          Download PDF
        </button>
      </header>

      {/* Invoice preview */}
      <main className="flex-1 overflow-auto py-10">
        <div className="flex justify-center items-start px-4">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-white/[0.03] rounded-2xl transform scale-95 translate-y-4" />
            <div className="relative" style={{ width: 794 }}>
              <InvoicePreview data={data} templateId={templateId} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-zinc-600">
        Created with{" "}
        <span className="text-zinc-400 font-medium">BillForge</span>
      </footer>
    </div>
  );
}
