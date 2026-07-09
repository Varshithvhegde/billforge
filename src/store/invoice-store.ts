import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InvoiceData, TemplateId, SavedProfile, SavedCustomer } from "@/types/invoice";

const defaultInvoice: InvoiceData = {
  documentType: "invoice",
  fromName: "",
  fromEmail: "",
  fromPhone: "",
  fromAddress: "",
  fromGSTIN: "",
  fromLogo: "",
  toName: "",
  toEmail: "",
  toPhone: "",
  toAddress: "",
  toGSTIN: "",
  invoiceNumber: `INV-${new Date().getFullYear()}-001`,
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
  currency: "INR",
  lineItems: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
  enableGST: true,
  gstRate: 18,
  gstType: "CGST+SGST",
  enableDiscount: false,
  discountType: "percent",
  discountValue: 0,
  notes: "Thank you for your business!",
  terms: "Payment due within 15 days of invoice date.",
  bankDetails: { bankName: "", accountName: "", accountNumber: "", ifscCode: "", upiId: "" },
  customFields: [],
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  projectTitle: "",
  projectScope: "",
  signatureName: "",
};

interface InvoiceStore {
  data: InvoiceData;
  templateId: TemplateId;
  savedProfiles: SavedProfile[];
  savedCustomers: SavedCustomer[];

  update: (patch: Partial<InvoiceData>) => void;
  setTemplate: (id: TemplateId) => void;
  reset: () => void;

  // Line items
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, patch: Partial<InvoiceData["lineItems"][0]>) => void;

  // Custom fields
  addCustomField: () => void;
  removeCustomField: (id: string) => void;
  updateCustomField: (id: string, patch: { label?: string; value?: string }) => void;

  // Profiles (my info)
  saveProfile: (profile: Omit<SavedProfile, "id">) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;

  // Customers
  saveCustomer: (customer: Omit<SavedCustomer, "id" | "createdAt">) => void;
  loadCustomer: (id: string) => void;
  deleteCustomer: (id: string) => void;
  updateCustomer: (id: string, patch: Partial<Omit<SavedCustomer, "id" | "createdAt">>) => void;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      data: defaultInvoice,
      templateId: "minimal",
      savedProfiles: [],
      savedCustomers: [],

      update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
      setTemplate: (id) => set({ templateId: id }),
      reset: () => set({ data: { ...defaultInvoice, invoiceNumber: `INV-${new Date().getFullYear()}-001` } }),

      addLineItem: () =>
        set((s) => ({
          data: {
            ...s.data,
            lineItems: [
              ...s.data.lineItems,
              { id: Date.now().toString(), description: "", quantity: 1, rate: 0, amount: 0 },
            ],
          },
        })),

      removeLineItem: (id) =>
        set((s) => ({
          data: { ...s.data, lineItems: s.data.lineItems.filter((i) => i.id !== id) },
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

      addCustomField: () =>
        set((s) => ({
          data: {
            ...s.data,
            customFields: [
              ...s.data.customFields,
              { id: Date.now().toString(), label: "", value: "" },
            ],
          },
        })),

      removeCustomField: (id) =>
        set((s) => ({
          data: { ...s.data, customFields: s.data.customFields.filter((f) => f.id !== id) },
        })),

      updateCustomField: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            customFields: s.data.customFields.map((f) =>
              f.id === id ? { ...f, ...patch } : f
            ),
          },
        })),

      saveProfile: (profile) =>
        set((s) => {
          const id = Date.now().toString();
          const profiles = profile.isDefault
            ? s.savedProfiles.map((p) => ({ ...p, isDefault: false }))
            : [...s.savedProfiles];
          return { savedProfiles: [...profiles, { ...profile, id }] };
        }),

      loadProfile: (id) =>
        set((s) => {
          const profile = s.savedProfiles.find((p) => p.id === id);
          if (!profile) return s;
          return {
            data: {
              ...s.data,
              fromName: profile.name,
              fromEmail: profile.email,
              fromPhone: profile.phone,
              fromAddress: profile.address,
              fromGSTIN: profile.gstin,
            },
          };
        }),

      deleteProfile: (id) =>
        set((s) => ({ savedProfiles: s.savedProfiles.filter((p) => p.id !== id) })),

      saveCustomer: (customer) =>
        set((s) => ({
          savedCustomers: [
            ...s.savedCustomers,
            { ...customer, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
        })),

      loadCustomer: (id) =>
        set((s) => {
          const c = s.savedCustomers.find((c) => c.id === id);
          if (!c) return s;
          return {
            data: {
              ...s.data,
              toName: c.name,
              toEmail: c.email,
              toPhone: c.phone,
              toAddress: c.address,
              toGSTIN: c.gstin,
            },
          };
        }),

      deleteCustomer: (id) =>
        set((s) => ({ savedCustomers: s.savedCustomers.filter((c) => c.id !== id) })),

      updateCustomer: (id, patch) =>
        set((s) => ({
          savedCustomers: s.savedCustomers.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),
    }),
    { name: "billforge-v2" }
  )
);
