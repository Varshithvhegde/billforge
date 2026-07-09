"use client";
import React from "react";
import { Download, RotateCcw, FileText, Loader2 } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Topbar() {
  const { data, reset } = useInvoiceStore();
  const { downloadPdf, loading } = usePdfDownload();

  return (
    <header className="h-12 border-b border-white/[0.06] flex items-center justify-between px-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
          <FileText size={13} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">BillForge</span>
        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider ml-1">
          {data.documentType}
        </span>
      </div>

      {/* Center — breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <span className="text-zinc-400 font-medium">{data.invoiceNumber || "—"}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger
            onClick={reset}
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
          >
            <RotateCcw size={14} />
          </TooltipTrigger>
          <TooltipContent>Reset form</TooltipContent>
        </Tooltip>

        <button
          onClick={() => downloadPdf(`${data.documentType}-${data.invoiceNumber || "001"}.pdf`)}
          disabled={loading}
          className="flex items-center gap-1.5 h-7 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-medium rounded-md transition-colors"
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          Download PDF
        </button>
      </div>
    </header>
  );
}
