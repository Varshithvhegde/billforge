"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Download, RotateCcw, FileText, Loader2, Save,
  LayoutDashboard, Check, AlertCircle, Cloud, Share2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvoiceStore } from "@/store/invoice-store";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { saveDocument } from "@/lib/documents/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SaveStatus {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved: Date | null;
}

interface Props {
  docId?: string;
  saveStatus?: SaveStatus;
  onSaveStatusChange?: (s: SaveStatus) => void;
  shareToken?: string | null;
  onShareClick?: () => void;
}

export function Topbar({ docId, saveStatus, onSaveStatusChange, shareToken, onShareClick }: Props) {
  const { data, templateId, reset } = useInvoiceStore();
  const { downloadPdf, loading: pdfLoading } = usePdfDownload();
  const [manualSaving, setManualSaving] = useState(false);
  const router = useRouter();

  async function handleManualSave() {
    setManualSaving(true);
    onSaveStatusChange?.({ status: "saving", lastSaved: null });
    try {
      const { id } = await saveDocument(data, templateId, docId);
      onSaveStatusChange?.({ status: "saved", lastSaved: new Date() });
      setTimeout(() => onSaveStatusChange?.({ status: "idle", lastSaved: new Date() }), 2000);
      if (!docId) router.replace(`/builder?id=${id}`);
    } catch {
      onSaveStatusChange?.({ status: "error", lastSaved: null });
    } finally {
      setManualSaving(false);
    }
  }

  const isSaving = manualSaving || saveStatus?.status === "saving";

  const SaveIndicator = () => {
    if (!docId) return null;
    if (isSaving) return (
      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
        <Loader2 size={10} className="animate-spin" /> Saving…
      </span>
    );
    if (saveStatus?.status === "saved") return (
      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
        <Check size={10} /> Saved
      </span>
    );
    if (saveStatus?.status === "error") return (
      <span className="flex items-center gap-1 text-[11px] text-red-400">
        <AlertCircle size={10} /> Save failed
      </span>
    );
    if (saveStatus?.lastSaved) return (
      <span className="flex items-center gap-1 text-[11px] text-zinc-600">
        <Cloud size={10} /> Auto-saved
      </span>
    );
    return null;
  };

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

      {/* Center — doc number + save status */}
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="text-zinc-400 font-medium">{data.invoiceNumber || "—"}</span>
        <SaveIndicator />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
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

        {/* Share button */}
        {onShareClick && (
          <button
            onClick={onShareClick}
            className={cn(
              "flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-xs font-medium transition-colors relative",
              shareToken
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-white/[0.1] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
            )}
          >
            <Share2 size={12} />
            Share
            {shareToken && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        )}

        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 h-7 px-3 border border-white/[0.1] hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.07] text-zinc-200 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Save
        </button>

        <button
          onClick={() => downloadPdf(`${data.documentType}-${data.invoiceNumber || "001"}.pdf`)}
          disabled={pdfLoading}
          className="flex items-center gap-1.5 h-7 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-medium rounded-md transition-colors"
        >
          {pdfLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
          PDF
        </button>
      </div>
    </header>
  );
}
