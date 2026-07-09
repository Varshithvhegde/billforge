export type DocumentType = "invoice" | "proposal";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface InvoiceData {
  documentType: DocumentType;
  // From
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  fromAddress: string;
  fromGSTIN: string;
  // To
  toName: string;
  toEmail: string;
  toPhone: string;
  toAddress: string;
  toGSTIN: string;
  // Document details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  // Line items
  lineItems: LineItem[];
  // Taxes
  enableGST: boolean;
  gstRate: number; // 0, 5, 12, 18, 28
  gstType: "CGST+SGST" | "IGST";
  // Notes
  notes: string;
  terms: string;
  // Bank
  bankDetails: BankDetails;
  // Proposal extras
  validUntil: string;
  projectTitle: string;
  projectScope: string;
}

export type TemplateId = "minimal" | "classic" | "bold" | "elegant";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  accentColor: string;
  preview: string;
}
