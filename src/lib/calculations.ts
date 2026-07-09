import type { InvoiceData } from "@/types/invoice";

export function calculateTotals(data: InvoiceData) {
  const subtotal = data.lineItems.reduce((s, i) => s + i.amount, 0);
  const gstAmount = data.enableGST ? (subtotal * data.gstRate) / 100 : 0;
  const total = subtotal + gstAmount;

  let cgst = 0, sgst = 0, igst = 0;
  if (data.enableGST) {
    if (data.gstType === "CGST+SGST") {
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    } else {
      igst = gstAmount;
    }
  }

  return { subtotal, gstAmount, total, cgst, sgst, igst };
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
