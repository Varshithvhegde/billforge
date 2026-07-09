"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Download, RotateCcw, FileText, Loader2, Save, LayoutDashboard, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvoiceStore } from "@/store/invoice-store";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { saveDocument } from "@/lib/documents/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  docId?: string;
}

export function Topbar({ docId }: Props) {
  const { data, templateId, reset } = useInvoiceStore();
  const { downloadPdf, loading: pdfLoading } = usePdfDownload();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    try {
      const { id } = await saveDocument(data, templateId, docId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // If new doc, redirect to ?id= so future saves update the same record
      if (!docId) {
        router.replace(`/builder?id=${id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <header className="h-12 border-b border-white/[0.06] flex items-center justify-between px-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">BillForge</span>
        </Link>
        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider ml-1">
          {data.documentType}
        </span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <span className="text-zinc-400 font-medium">{data.invoiceNumber || "—"}</span>
        {saved && (
          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
            <Check size={11} /> Saved
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
          title="Dashboard"
        >
          <LayoutDashboard size={14} />
        </Link>

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
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 h-7 px-3 border border-white/[0.1] hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.07] text-zinc-200 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Save
        </button>

        <button
          onClick={() => downloadPdf(`${data.documentType}-${data.invoiceNumber || "001"}.pdf`)}
          disabled={pdfLoading}
          className="flex items-center gap-1.5 h-7 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-medium rounded-md transition-colors"
        >
          {pdfLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
          Download PDF
        </button>
      </div>
    </header>
  );
}
