"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Trash2, Edit2, CheckCircle, Clock, Send, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { deleteDocument, updateDocumentStatus } from "@/lib/documents/actions";
import { formatCurrency } from "@/lib/calculations";
import type { DocumentRow } from "@/lib/documents/actions";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20", icon: Clock },
  sent: { label: "Sent", color: "text-sky-400 bg-sky-500/10 border-sky-500/20", icon: Send },
  paid: { label: "Paid", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
};

const TEMPLATE_COLORS: Record<string, string> = {
  minimal: "bg-indigo-600",
  classic: "bg-[#1e3a5f]",
  bold: "bg-zinc-900",
  elegant: "bg-amber-700",
};

interface Props {
  documents: DocumentRow[];
}

export function DocumentGrid({ documents }: Props) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/[0.08] rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-4">
          <FileText size={22} className="text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">No documents yet</h3>
        <p className="text-sm text-zinc-500 mb-6">Create your first invoice or proposal</p>
        <Link
          href="/builder"
          className="flex items-center gap-1.5 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} />
          New Document
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}

function DocumentCard({ doc }: { doc: DocumentRow }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [isPending, startTransition] = useTransition();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const status = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.draft;
  const StatusIcon = status.icon;
  const templateColor = TEMPLATE_COLORS[doc.template_id] || "bg-indigo-600";

  function openMenu() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    setMenuOpen(true);
  }

  function handleDelete() {
    setMenuOpen(false);
    if (!confirm("Delete this document?")) return;
    startTransition(async () => { await deleteDocument(doc.id); });
  }

  function handleStatusChange(s: "draft" | "sent" | "paid") {
    setMenuOpen(false);
    startTransition(async () => { await updateDocumentStatus(doc.id, s); });
  }

  return (
    <div className={cn(
      "group relative rounded-xl border border-white/[0.07] bg-zinc-900/40 transition-all hover:border-white/[0.15] hover:bg-zinc-900/70",
      isPending && "opacity-50 pointer-events-none"
    )}>
      {/* Thumbnail — overflow-hidden only on this section */}
      <Link href={`/builder?id=${doc.id}`} className="block rounded-t-xl overflow-hidden">
        <div className={cn("h-36 flex items-center justify-center relative", templateColor)}>
          <div className="w-24 h-32 bg-white rounded-sm shadow-xl flex flex-col p-1.5 gap-1">
            <div className="h-2 bg-zinc-200 rounded-sm w-3/4" />
            <div className="h-1 bg-zinc-100 rounded-sm w-1/2" />
            <div className="flex-1 mt-1 space-y-0.5">
              {[70, 90, 60, 80, 55].map((w, i) => (
                <div key={i} className="h-0.5 bg-zinc-100 rounded-full" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="h-0.5 bg-zinc-300 rounded-full w-full" />
            <div className="h-1.5 bg-zinc-800 rounded-sm w-1/2 self-end" />
          </div>
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white/80 font-medium capitalize">
            {doc.document_type}
          </div>
        </div>
      </Link>

      {/* Card info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/builder?id=${doc.id}`} className="block">
              <div className="text-sm font-medium text-zinc-200 truncate hover:text-white transition-colors">
                {doc.title}
              </div>
            </Link>
            <div className="text-[11px] text-zinc-600 mt-0.5">
              {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
            </div>
          </div>

          {/* More menu — portal-style fixed dropdown */}
          <button
            ref={btnRef}
            onClick={openMenu}
            className="w-6 h-6 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors flex-shrink-0"
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                className="fixed z-50 w-44 bg-zinc-800 border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden py-1"
                style={{ top: menuPos.top, right: menuPos.right }}
              >
                <Link
                  href={`/builder?id=${doc.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.06] transition-colors"
                >
                  <Edit2 size={12} /> Edit
                </Link>
                <div className="h-px bg-white/[0.06] my-1" />
                <div className="px-3 py-1 text-[10px] text-zinc-600 uppercase tracking-wider">Mark as</div>
                {(["draft", "sent", "paid"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors",
                      doc.status === s ? "text-indigo-300 bg-indigo-500/10" : "text-zinc-300 hover:bg-white/[0.06]"
                    )}
                  >
                    {s === "draft" && <Clock size={12} />}
                    {s === "sent" && <Send size={12} />}
                    {s === "paid" && <CheckCircle size={12} />}
                    <span className="capitalize">{s}</span>
                  </button>
                ))}
                <div className="h-px bg-white/[0.06] my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Status + amount */}
        <div className="flex items-center justify-between mt-2.5">
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium", status.color)}>
            <StatusIcon size={10} />
            {status.label}
          </span>
          {doc.total > 0 && (
            <span className="text-[11px] font-semibold text-zinc-300">
              {formatCurrency(doc.total, (doc.data as { currency?: string })?.currency || "INR")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
