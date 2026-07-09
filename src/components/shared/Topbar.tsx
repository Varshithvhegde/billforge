"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download, RotateCcw, FileText, Loader2, Save,
  LayoutDashboard, Check, AlertCircle, Cloud,
  Share2, Copy, Trash2, Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvoiceStore } from "@/store/invoice-store";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { saveDocument, generateShareLink, revokeShareLink } from "@/lib/documents/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SaveStatus {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved: Date | null;
}

interface Props {
  docId?: string;
  saveStatus?: SaveStatus;
  onSaveStatusChange?: (s: SaveStatus) => void;
  initialShareToken?: string | null;
}

export function Topbar({ docId, saveStatus, onSaveStatusChange, initialShareToken }: Props) {
  const { data, templateId, reset } = useInvoiceStore();
  const { downloadPdf, loading: pdfLoading } = usePdfDownload();
  const [manualSaving, setManualSaving] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(initialShareToken ?? null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShareToken(initialShareToken ?? null);
  }, [initialShareToken]);

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

  async function handleGenerateLink() {
    if (!docId) return;
    setShareLoading(true);
    try {
      const token = await generateShareLink(docId);
      setShareToken(token);
    } finally {
      setShareLoading(false);
    }
  }

  async function handleRevokeLink() {
    if (!docId) return;
    setShareLoading(true);
    try {
      await revokeShareLink(docId);
      setShareToken(null);
    } finally {
      setShareLoading(false);
    }
  }

  function getShareUrl(token: string) {
    if (typeof window === "undefined") return `/view/${token}`;
    return `${window.location.origin}/view/${token}`;
  }

  async function handleCopy(token: string) {
    await navigator.clipboard.writeText(getShareUrl(token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* Share button — only shown when doc is saved */}
        {docId && (
          <Popover>
            <PopoverTrigger
              className={cn(
                "relative flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-xs font-medium transition-colors",
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
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-80 bg-[#1a1a1c] border-white/[0.08] text-zinc-200">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-200">Share invoice</p>

                {shareToken ? (
                  <div className="space-y-2.5">
                    {/* Link display */}
                    <div className="flex items-center gap-1.5 p-2 rounded-md bg-white/[0.04] border border-white/[0.06]">
                      <Link2 size={12} className="text-zinc-500 flex-shrink-0" />
                      <span className="text-[11px] text-zinc-400 truncate flex-1 font-mono">
                        {`/view/${shareToken}`}
                      </span>
                      <button
                        onClick={() => handleCopy(shareToken)}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors flex-shrink-0 px-1.5 py-0.5 rounded hover:bg-white/[0.06]"
                      >
                        {copied ? (
                          <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                        ) : (
                          <><Copy size={11} /> Copy</>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                      Anyone with this link can view the invoice without signing in.
                    </p>

                    <button
                      onClick={handleRevokeLink}
                      disabled={shareLoading}
                      className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      {shareLoading ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Trash2 size={11} />
                      )}
                      Revoke link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Generate a shareable link so anyone can view this invoice without signing in.
                    </p>
                    <button
                      onClick={handleGenerateLink}
                      disabled={shareLoading}
                      className="flex items-center gap-1.5 w-full h-8 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-medium rounded-md transition-colors justify-center"
                    >
                      {shareLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Link2 size={12} />
                      )}
                      Create shareable link
                    </button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
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
