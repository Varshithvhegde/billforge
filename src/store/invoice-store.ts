import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InvoiceData, TemplateId } from "@/types/invoice";

const defaultInvoice: InvoiceData = {
  documentType: "invoice",
  fromName: "",
  fromEmail: "",
  fromPhone: "",
  fromAddress: "",
  fromGSTIN: "",
  toName: "",
  toEmail: "",
  toPhone: "",
  toAddress: "",
  toGSTIN: "",
  invoiceNumber: `INV-${new Date().getFullYear()}-001`,
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
  currency: "INR",
  lineItems: [
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 },
  ],
  enableGST: true,
  gstRate: 18,
  gstType: "CGST+SGST",
  notes: "Thank you for your business!",
  terms: "Payment due within 15 days of invoice date.",
  bankDetails: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  },
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  projectTitle: "",
  projectScope: "",
};

interface InvoiceStore {
  data: InvoiceData;
  templateId: TemplateId;
  update: (patch: Partial<InvoiceData>) => void;
  setTemplate: (id: TemplateId) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, patch: Partial<InvoiceData["lineItems"][0]>) => void;
  reset: () => void;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      data: defaultInvoice,
      templateId: "minimal",
      update: (patch) =>
        set((s) => ({ data: { ...s.data, ...patch } })),
      setTemplate: (id) => set({ templateId: id }),
      addLineItem: () =>
        set((s) => ({
          data: {
            ...s.data,
            lineItems: [
              ...s.data.lineItems,
              {
                id: Date.now().toString(),
                description: "",
                quantity: 1,
                rate: 0,
                amount: 0,
              },
            ],
          },
        })),
      removeLineItem: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            lineItems: s.data.lineItems.filter((i) => i.id !== id),
          },
        })),
      updateLineItem: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            lineItems: s.data.lineItems.map((item) => {
              if (item.id !== id) return item;
              const updated = { ...item, ...patch };
              updated.amount = updated.quantity * updated.rate;
              return updated;
            }),
          },
        })),
      reset: () => set({ data: defaultInvoice }),
    }),
    { name: "billforge-invoice" }
  )
);
