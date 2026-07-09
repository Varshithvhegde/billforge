import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDocuments } from "@/lib/documents/actions";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DocumentGrid } from "@/components/dashboard/DocumentGrid";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const documents = await getDocuments();

  const stats = {
    total: documents.length,
    invoices: documents.filter((d) => d.document_type === "invoice").length,
    proposals: documents.filter((d) => d.document_type === "proposal").length,
    paid: documents.filter((d) => d.status === "paid").length,
    totalValue: documents.filter((d) => d.status === "paid").reduce((s, d) => s + (d.total || 0), 0),
  };

  return (
    <DashboardShell user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "#f0eeec" }}>Documents</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "#555" }}>
            {documents.length === 0
              ? "Create your first invoice or proposal"
              : `${documents.length} document${documents.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/builder"
          className="flex items-center gap-1.5 h-8 px-4 text-xs font-semibold text-white rounded-md transition-all hover:brightness-110"
          style={{ background: "#f97316" }}
        >
          <Plus size={13} />
          New Document
        </Link>
      </div>

      <DashboardStats stats={stats} />
      <DocumentGrid documents={documents} />
    </DashboardShell>
  );
}
