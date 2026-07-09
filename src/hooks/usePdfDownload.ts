"use client";
import { useState } from "react";
import { useInvoiceStore } from "@/store/invoice-store";

export function usePdfDownload() {
  const [loading, setLoading] = useState(false);
  const { data, templateId } = useInvoiceStore();

  async function downloadPdf(filename = "invoice.pdf") {
    setLoading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, templateId }),
      });

      if (!res.ok) throw new Error(`PDF generation failed: ${res.statusText}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return { downloadPdf, loading };
}
