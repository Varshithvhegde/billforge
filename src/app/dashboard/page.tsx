import React from "react";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
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
    totalValue: documents
      .filter((d) => d.status === "paid")
      .reduce((s, d) => s + (d.total || 0), 0),
  };

  return (
    <DashboardShell user={user}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {documents.length === 0
              ? "Create your first invoice or proposal"
              : `${documents.length} document${documents.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/builder"
            className="flex items-center gap-1.5 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            New Document
          </Link>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="mt-8">
        <DocumentGrid documents={documents} />
      </div>
    </DashboardShell>
  );
}
