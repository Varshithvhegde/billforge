"use client";
import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateTotals } from "@/lib/calculations";
import type { InvoiceData, TemplateId } from "@/types/invoice";

interface AutoSaveStatus {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved: Date | null;
}

type SetStatus = (s: AutoSaveStatus) => void;

export function useAutoSave(
  docId: string | null,
  data: InvoiceData,
  templateId: TemplateId,
  setStatus: SetStatus,
  debounceMs = 1500
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ data, templateId });

  // Keep latest values available to the save callback without re-creating it
  useEffect(() => {
    latestRef.current = { data, templateId };
  }, [data, templateId]);

  const save = useCallback(async () => {
    if (!docId) return;
    const { data: d, templateId: tid } = latestRef.current;
    const { total } = calculateTotals(d);
    setStatus({ status: "saving", lastSaved: null });
    const supabase = createClient();
    const { error } = await supabase
      .from("documents")
      .update({
        data: d,
        template_id: tid,
        total,
        client_name: d.toName || "",
        title: d.toName
          ? `${d.documentType === "invoice" ? "Invoice" : "Proposal"} for ${d.toName}`
          : d.invoiceNumber || "Untitled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", docId);

    if (error) {
      setStatus({ status: "error", lastSaved: null });
    } else {
      setStatus({ status: "saved", lastSaved: new Date() });
      setTimeout(() => setStatus({ status: "idle", lastSaved: new Date() }), 2000);
    }
  }, [docId, setStatus]);

  // Debounce: every time data/templateId changes, reset the timer
  useEffect(() => {
    if (!docId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [docId, data, templateId, save, debounceMs]);

  return { save };
}
