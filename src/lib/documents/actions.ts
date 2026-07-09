"use server";
import { createClient } from "@/lib/supabase/server";
import { calculateTotals } from "@/lib/calculations";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { revalidatePath } from "next/cache";

export type DocumentRow = {
  id: string;
  title: string;
  document_type: string;
  invoice_number: string | null;
  status: "draft" | "sent" | "paid";
  template_id: string;
  data: InvoiceData;
  total: number;
  client_name: string;
  created_at: string;
  updated_at: string;
};

export async function getDocuments(): Promise<DocumentRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as DocumentRow[];
}

export async function getDocument(id: string): Promise<DocumentRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as DocumentRow;
}

export async function saveDocument(
  invoiceData: InvoiceData,
  templateId: TemplateId,
  existingId?: string
): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { total } = calculateTotals(invoiceData);

  const title = invoiceData.toName
    ? `${invoiceData.documentType === "invoice" ? "Invoice" : "Proposal"} for ${invoiceData.toName}`
    : invoiceData.invoiceNumber || "Untitled";

  const payload = {
    user_id: user.id,
    title,
    document_type: invoiceData.documentType,
    invoice_number: invoiceData.invoiceNumber || null,
    template_id: templateId,
    data: invoiceData,
    total,
    client_name: invoiceData.toName || "",
  };

  if (existingId) {
    const { error } = await supabase
      .from("documents")
      .update(payload)
      .eq("id", existingId);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
    return { id: existingId };
  }

  const { data, error } = await supabase
    .from("documents")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  return { id: data.id };
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateDocumentStatus(
  id: string,
  status: "draft" | "sent" | "paid"
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
