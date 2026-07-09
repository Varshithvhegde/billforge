import React from "react";
import { createClient } from "@/lib/supabase/server";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { InvoiceViewClient } from "./InvoiceViewClient";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicInvoicePage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("title, status, template_id, data")
    .eq("share_token", token)
    .eq("is_public", true)
    .single();

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-zinc-200">
            Invoice not found or link has expired
          </h1>
          <p className="text-sm text-zinc-500">
            This link may have been revoked or it does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceViewClient
      data={doc.data as InvoiceData}
      templateId={doc.template_id as TemplateId}
      title={doc.title}
      status={doc.status as "draft" | "sent" | "paid"}
    />
  );
}
