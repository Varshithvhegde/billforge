import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getDocuments } from "@/lib/documents/actions";
import { calculateTotals } from "@/lib/calculations";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GSTReport } from "@/components/dashboard/GSTReport";
import type { GSTDocumentRow } from "@/components/dashboard/GSTReport";

export default async function GSTReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const documents = await getDocuments();

  // Filter to GST-enabled documents and compute breakdowns server-side
  const gstRows: GSTDocumentRow[] = documents
    .filter((doc) => doc.data?.enableGST === true)
    .map((doc) => {
      const { taxableAmount, cgst, sgst, igst, gstAmount, total } = calculateTotals(doc.data);
      return {
        id: doc.id,
        invoiceNumber: doc.invoice_number,
        invoiceDate: doc.data.invoiceDate ?? "",
        clientName: doc.client_name ?? doc.data.toName ?? "",
        status: doc.status,
        taxableAmount,
        gstRate: doc.data.gstRate,
        cgst,
        sgst,
        igst,
        gstAmount,
        total,
      };
    });

  return (
    <DashboardShell user={user}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">GST Report</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {gstRows.length === 0
            ? "No GST-enabled invoices found"
            : `${gstRows.length} GST-enabled invoice${gstRows.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <GSTReport rows={gstRows} />
    </DashboardShell>
  );
}
