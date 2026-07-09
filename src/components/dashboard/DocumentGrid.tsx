"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, Trash2, Edit2, CheckCircle, Clock, Send, Plus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { deleteDocument, updateDocumentStatus } from "@/lib/documents/actions";
import { formatCurrency } from "@/lib/calculations";
import type { DocumentRow } from "@/lib/documents/actions";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "#888", bg: "rgba(255,255,255,0.06)", icon: Clock },
  sent:  { label: "Sent",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)", icon: Send },
  paid:  { label: "Paid",  color: "#4ade80", bg: "rgba(74,222,128,0.1)", icon: CheckCircle },
};

const TEMPLATE_ACCENTS: Record<string, string> = {
  minimal:   "#6366f1",
  classic:   "#1e3a5f",
  bold:      "#0f172a",
  elegant:   "#b45309",
  studio:    "#1e1b4b",
  slate:     "#475569",
  neon:      "#06b6d4",
  terra:     "#c2410c",
  arctic:    "#0ea5e9",
  executive: "#0f1729",
};

interface Props { documents: DocumentRow[]; }

export function DocumentGrid({ documents }: Props) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
        style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
          <FileText size={20} style={{ color: "#f97316" }} />
        </div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#f0eeec" }}>No documents yet</h3>
        <p className="text-[13px] mb-6" style={{ color: "#555" }}>Create your first invoice or proposal</p>
        <Link href="/builder"
          className="flex items-center gap-1.5 h-8 px-4 text-xs font-semibold text-white rounded-md transition-all hover:brightness-110"
          style={{ background: "#f97316" }}>
          <Plus size={13} /> New Document
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((doc) => <DocumentCard key={doc.id} doc={doc} />)}
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
  const accent = TEMPLATE_ACCENTS[doc.template_id] || "#6366f1";

  function openMenu() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
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
    <div className={cn("group relative rounded-xl transition-all", isPending && "opacity-40 pointer-events-none")}
      style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>

      {/* Thumbnail */}
      <Link href={`/builder?id=${doc.id}`} className="block rounded-t-xl overflow-hidden">
        <div className="h-36 flex items-center justify-center relative"
          style={{ background: accent }}>
          {/* Subtle noise texture feel */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />

          {/* A4 mini card */}
          <div className="relative w-[88px] h-[124px] bg-white rounded-sm"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "8px 8px 6px" }}>
              <div style={{ height: 5, width: "65%", background: "#111", borderRadius: 2, marginBottom: 4 }} />
              <div style={{ height: 3, width: "40%", background: "#ddd", borderRadius: 1, marginBottom: 8 }} />
              {[80, 100, 65, 90, 55].map((w, i) => (
                <div key={i} style={{ height: 2.5, width: `${w}%`, background: i === 0 ? accent + "60" : "#efefef", borderRadius: 1, marginBottom: 3 }} />
              ))}
              <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 36, height: 8, background: accent, borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* Doc type badge */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
            style={{ background: "rgba(0,0,0,0.35)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)" }}>
            {doc.document_type}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <Link href={`/builder?id=${doc.id}`} className="block">
              <div className="text-[13px] font-semibold truncate transition-colors"
                style={{ color: "#f0eeec" }}>
                {doc.title}
              </div>
            </Link>
            <div className="text-[11px] mt-0.5" style={{ color: "#444" }}>
              {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
            </div>
          </div>

          {/* Menu trigger */}
          <button ref={btnRef} onClick={openMenu}
            className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            style={{ color: "#555" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f0eeec"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="fixed z-50 w-44 rounded-xl overflow-hidden py-1"
                style={{ top: menuPos.top, right: menuPos.right, background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
                <Link href={`/builder?id=${doc.id}`} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                  style={{ color: "#aaa" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "#f0eeec"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}>
                  <Edit2 size={12} /> Edit
                </Link>
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                <div className="px-3 py-1 text-[10px] uppercase tracking-widest" style={{ color: "#444" }}>Mark as</div>
                {(["draft", "sent", "paid"] as const).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button key={s} onClick={() => handleStatusChange(s)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                      style={{ color: doc.status === s ? cfg.color : "#aaa", background: doc.status === s ? cfg.bg : "transparent" }}
                      onMouseEnter={(e) => { if (doc.status !== s) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#f0eeec"; } }}
                      onMouseLeave={(e) => { if (doc.status !== s) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#aaa"; } }}>
                      <cfg.icon size={12} /> <span className="capitalize">{s}</span>
                    </button>
                  );
                })}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                <button onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                  style={{ color: "#f87171" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Status + amount row */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
            style={{ background: status.bg, color: status.color }}>
            <StatusIcon size={9} />
            {status.label}
          </span>
          {doc.total > 0 && (
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: "#888" }}>
              {formatCurrency(doc.total, (doc.data as { currency?: string })?.currency || "INR")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
