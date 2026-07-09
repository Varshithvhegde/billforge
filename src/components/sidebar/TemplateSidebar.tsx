"use client";
import React from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

export function TemplateSidebar() {
  const { templateId, setTemplate } = useInvoiceStore();

  return (
    <ScrollArea className="h-full">
      <div className="p-3">
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-1">Templates</div>
        <div className="space-y-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={cn(
                "w-full text-left rounded-xl border transition-all overflow-hidden",
                templateId === tpl.id
                  ? "border-indigo-500/50 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
                  : "border-white/[0.06] hover:border-white/[0.15] bg-zinc-900/50"
              )}
            >
              <TemplatePreviewCard id={tpl.id} accentColor={tpl.accentColor} />
              <div className="px-3 py-2 flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-zinc-200">{tpl.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{tpl.description}</div>
                </div>
                {templateId === tpl.id && (
                  <CheckCircle2 size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

function TemplatePreviewCard({ id, accentColor }: { id: string; accentColor: string }) {
  const bgColor = id === "neon" ? "#09090b" : "white";
  return (
    <div className="mx-2.5 mt-2.5 rounded-lg overflow-hidden" style={{ height: 90, background: bgColor }}>
      {id === "minimal" && <MinimalPreview accent={accentColor} />}
      {id === "classic" && <ClassicPreview accent={accentColor} />}
      {id === "bold" && <BoldPreview />}
      {id === "elegant" && <ElegantPreview accent={accentColor} />}
      {id === "studio" && <StudioPreview accent={accentColor} />}
      {id === "slate" && <SlatePreview />}
      {id === "neon" && <NeonPreview />}
      {id === "terra" && <TerraPreview accent={accentColor} />}
      {id === "arctic" && <ArcticPreview accent={accentColor} />}
      {id === "executive" && <ExecutivePreview />}
    </div>
  );
}

function MinimalPreview({ accent }: { accent: string }) {
  return (
    <div style={{ padding: 9, height: "100%", background: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <div style={{ width: 55, height: 5, background: "#0f172a", borderRadius: 2 }} />
        <div style={{ width: 25, height: 5, background: accent, borderRadius: 2 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
        {[0, 1].map(i => <div key={i} style={{ height: 18, background: "#f8fafc", borderRadius: 2 }} />)}
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 2, height: 26 }} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
        <div style={{ width: 45, height: 7, background: accent, borderRadius: 2, opacity: 0.8 }} />
      </div>
    </div>
  );
}

function ClassicPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ background: accent, padding: "8px 10px", height: 30 }}>
        <div style={{ width: 45, height: 5, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
      </div>
      <div style={{ padding: 9 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 7 }}>
          {[0, 1].map(i => <div key={i} style={{ height: 14, background: "#f8fafc", borderRadius: 2 }} />)}
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 2, height: 18 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
          <div style={{ width: 38, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

function BoldPreview() {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ background: "#0f172a", padding: "9px 10px", height: 32 }}>
        <div style={{ width: 45, height: 5, background: "white", opacity: 0.7, borderRadius: 2 }} />
        <div style={{ marginTop: 4, height: 2, background: "linear-gradient(90deg, #6366f1, #ec4899)", borderRadius: 2 }} />
      </div>
      <div style={{ padding: 9 }}>
        <div style={{ background: "#f8fafc", borderRadius: 2, height: 22, marginBottom: 5 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 40, height: 7, background: "#6366f1", borderRadius: 2, opacity: 0.9 }} />
        </div>
      </div>
    </div>
  );
}

function ElegantPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", fontFamily: "Georgia, serif" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, #d97706, ${accent})` }} />
      <div style={{ padding: 9 }}>
        <div style={{ textAlign: "center", marginBottom: 7 }}>
          <div style={{ width: 55, height: 5, background: "#1c1917", borderRadius: 2, margin: "0 auto 4px" }} />
          <div style={{ width: 30, height: 2, background: accent, borderRadius: 1, margin: "0 auto" }} />
        </div>
        <div style={{ background: "#fef3c7", borderRadius: 2, height: 18, marginBottom: 5 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 36, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, #d97706, ${accent})` }} />
    </div>
  );
}

function StudioPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div style={{ width: 30, background: accent, padding: "8px 6px" }}>
        <div style={{ width: "100%", height: 2, background: "#818cf8", borderRadius: 1, marginBottom: 6 }} />
        <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.5)", borderRadius: 1, marginBottom: 3 }} />
        <div style={{ width: "80%", height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 1, marginBottom: 2 }} />
        <div style={{ width: "90%", height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
      </div>
      <div style={{ flex: 1, padding: 9 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ width: 35, height: 5, background: accent, borderRadius: 1, opacity: 0.8 }} />
          <div style={{ width: 30, height: 5, background: "#0f172a", borderRadius: 1 }} />
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 2, height: 22, marginBottom: 5 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 38, height: 7, background: accent, borderRadius: 2, opacity: 0.9 }} />
        </div>
      </div>
    </div>
  );
}

function SlatePreview() {
  return (
    <div style={{ height: "100%", padding: 9, background: "white" }}>
      <div style={{ height: 2, background: "#475569", marginBottom: 7 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <div style={{ width: 50, height: 5, background: "#0f172a", borderRadius: 2 }} />
        <div style={{ width: 20, height: 5, background: "#475569", borderRadius: 2 }} />
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 2, height: 22, marginBottom: 5 }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: 38, height: 7, background: "#0f172a", borderRadius: 2 }} />
      </div>
      <div style={{ height: 2, background: "#e2e8f0", marginTop: 5 }} />
    </div>
  );
}

function NeonPreview() {
  return (
    <div style={{ height: "100%", padding: 9, background: "#09090b" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg, #06b6d4, #d946ef)", marginBottom: 7, borderRadius: 1 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <div style={{ width: 45, height: 5, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
        <div style={{ width: 25, height: 5, background: "#06b6d4", borderRadius: 2 }} />
      </div>
      <div style={{ background: "rgba(6,182,212,0.1)", borderRadius: 2, border: "1px solid rgba(6,182,212,0.2)", height: 20, marginBottom: 5 }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: 38, height: 7, background: "#06b6d4", borderRadius: 2 }} />
      </div>
      <div style={{ height: 2, background: "linear-gradient(90deg, #06b6d4, #d946ef)", marginTop: 5, borderRadius: 1 }} />
    </div>
  );
}

function TerraPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", background: "#faf9f7" }}>
      <div style={{ background: accent, padding: "8px 10px", height: 34 }}>
        <div style={{ width: 45, height: 5, background: "rgba(255,255,255,0.8)", borderRadius: 2 }} />
        <div style={{ width: 25, height: 3, background: "rgba(255,255,255,0.4)", borderRadius: 1, marginTop: 3 }} />
      </div>
      <div style={{ padding: 9 }}>
        <div style={{ background: "#fef3c7", borderRadius: 2, height: 20, marginBottom: 5 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 36, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
        </div>
      </div>
      <div style={{ height: 3, background: accent, marginTop: 4 }} />
    </div>
  );
}

function ArcticPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", background: "white" }}>
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: 9 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
          <div style={{ width: 45, height: 5, background: "#0c4a6e", borderRadius: 2 }} />
          <div style={{ width: 28, height: 9, background: accent, borderRadius: 2 }} />
        </div>
        <div style={{ background: "#f0f9ff", borderRadius: 6, height: 22, marginBottom: 5 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 38, height: 7, background: accent, borderRadius: 4, opacity: 0.9 }} />
        </div>
      </div>
      <div style={{ height: 4, background: accent }} />
    </div>
  );
}

function ExecutivePreview() {
  return (
    <div style={{ height: "100%", background: "white" }}>
      <div style={{ background: "#0f1729", padding: "8px 10px", height: 36 }}>
        <div style={{ width: 1, height: 12, background: "#d4af37", marginBottom: 4 }} />
        <div style={{ width: 50, height: 4, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
        <div style={{ width: 1, height: 12, background: "#d4af37", marginTop: 4 }} />
      </div>
      <div style={{ padding: 9 }}>
        <div style={{ background: "#f8f6f0", borderRadius: 2, height: 20, marginBottom: 5, borderLeft: "3px solid #d4af37" }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 36, height: 7, background: "#d4af37", borderRadius: 1 }} />
        </div>
      </div>
      <div style={{ height: 2, background: "#d4af37", margin: "0 10px" }} />
      <div style={{ height: 6, background: "#0f1729" }} />
    </div>
  );
}
