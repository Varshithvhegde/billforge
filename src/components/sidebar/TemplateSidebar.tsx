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
      <div className="p-4">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Template</div>
        <div className="space-y-3">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={cn(
                "w-full text-left rounded-xl border transition-all overflow-hidden group",
                templateId === tpl.id
                  ? "border-indigo-500/50 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
                  : "border-white/[0.06] hover:border-white/[0.15] bg-zinc-900/50"
              )}
            >
              {/* Mini preview */}
              <TemplatePreviewCard id={tpl.id} accentColor={tpl.accentColor} />
              {/* Info */}
              <div className="px-3 py-2.5 flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-zinc-200">{tpl.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{tpl.description}</div>
                </div>
                {templateId === tpl.id && (
                  <CheckCircle2 size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Color swatches hint */}
        <div className="mt-6">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Accent Colors</div>
          <div className="flex flex-wrap gap-2">
            {["#6366f1", "#1e3a5f", "#0f172a", "#b45309", "#059669", "#dc2626", "#7c3aed", "#0ea5e9"].map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border-2 border-transparent hover:border-white/30 transition-all"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <p className="text-[10px] text-zinc-600 mt-2">Coming soon: custom accent colors</p>
        </div>
      </div>
    </ScrollArea>
  );
}

function TemplatePreviewCard({ id, accentColor }: { id: string; accentColor: string }) {
  return (
    <div className="mx-3 mt-3 rounded-lg overflow-hidden bg-white" style={{ height: 100 }}>
      {id === "minimal" && <MinimalPreview accent={accentColor} />}
      {id === "classic" && <ClassicPreview accent={accentColor} />}
      {id === "bold" && <BoldPreview accent={accentColor} />}
      {id === "elegant" && <ElegantPreview accent={accentColor} />}
    </div>
  );
}

function MinimalPreview({ accent }: { accent: string }) {
  return (
    <div style={{ padding: 10, height: "100%", background: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ width: 60, height: 6, background: "#0f172a", borderRadius: 2 }} />
        <div style={{ width: 30, height: 6, background: accent, borderRadius: 2 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        {[0, 1].map(i => <div key={i} style={{ height: 20, background: "#f8fafc", borderRadius: 3 }} />)}
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 3, height: 30 }} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <div style={{ width: 50, height: 8, background: accent, borderRadius: 2, opacity: 0.7 }} />
      </div>
    </div>
  );
}

function ClassicPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", fontFamily: "sans-serif" }}>
      <div style={{ background: accent, padding: "10px", height: 32 }}>
        <div style={{ width: 50, height: 5, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          {[0, 1].map(i => <div key={i} style={{ height: 16, background: "#f8fafc", borderRadius: 2 }} />)}
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 2, height: 20 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <div style={{ width: 40, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

function BoldPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f172a", padding: "10px", height: 36 }}>
        <div style={{ width: 50, height: 5, background: "white", opacity: 0.7, borderRadius: 2 }} />
        <div style={{ marginTop: 4, height: 2, background: "linear-gradient(90deg, #6366f1, #ec4899)", borderRadius: 2, width: "100%" }} />
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ background: "#f8fafc", borderRadius: 3, height: 25, marginBottom: 6 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 45, height: 8, background: "#6366f1", borderRadius: 2, opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

function ElegantPreview({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", fontFamily: "Georgia, serif" }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, #d97706, ${accent})` }} />
      <div style={{ padding: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ width: 60, height: 5, background: "#1c1917", borderRadius: 2, margin: "0 auto 4px" }} />
          <div style={{ width: 35, height: 3, background: accent, borderRadius: 1, margin: "0 auto" }} />
        </div>
        <div style={{ background: "#fef3c7", borderRadius: 2, height: 20, marginBottom: 6 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 40, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
        </div>
      </div>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, #d97706, ${accent})` }} />
    </div>
  );
}
