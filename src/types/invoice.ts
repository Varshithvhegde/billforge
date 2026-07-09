export type DocumentType = "invoice" | "proposal";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  unit?: string;
  taxRate?: number; // per-line tax override
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
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
  fromLogo?: string;
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
  gstRate: number;
  gstType: "CGST+SGST" | "IGST";
  // Discount
  enableDiscount: boolean;
  discountType: "percent" | "fixed";
  discountValue: number;
  // Notes
  notes: string;
  terms: string;
  // Bank
  bankDetails: BankDetails;
  // Custom fields
  customFields: CustomField[];
  // Proposal extras
  validUntil: string;
  projectTitle: string;
  projectScope: string;
  // Branding
  showBranding: boolean;
  // Signature
  signatureName: string;
  signatureImage?: string; // base64 data URL
}

export type TemplateId =
  | "minimal"
  | "classic"
  | "bold"
  | "elegant"
  | "studio"
  | "slate"
  | "neon"
  | "terra"
  | "arctic"
  | "executive";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  accentColor: string;
  preview: string;
}

export interface SavedProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  isDefault: boolean;
}

export interface SavedBankAccount {
  id: string;
  label: string; // e.g. "HDFC Savings", "Paytm UPI"
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  isDefault: boolean;
}

export interface SavedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  createdAt: string;
}
