import type { InvoiceData, TemplateId } from "@/types/invoice";
import { calculateTotals, formatCurrency, formatDate } from "./calculations";

export function buildInvoiceHtml(data: InvoiceData, templateId: TemplateId, qrDataUrl?: string): string {
  const totals = calculateTotals(data);
  const isProposal = data.documentType === "proposal";

  const bodyMap: Record<string, (d: InvoiceData, t: ReturnType<typeof calculateTotals>, p: boolean, q?: string) => string> = {
    minimal: minimalBody,
    classic: classicBody,
    bold: boldBody,
    elegant: elegantBody,
    studio: studioBody,
    slate: slateBody,
    neon: neonBody,
    terra: terraBody,
    arctic: arcticBody,
    executive: executiveBody,
  };
  const body = (bodyMap[templateId] ?? minimalBody)(data, totals, isProposal, qrDataUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=EB+Garamond:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; }
  body { font-family: 'Inter', sans-serif; color: #0f172a; background: white; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0; }
</style>
</head>
<body>${body}</body>
</html>`;
}

function lineItemsHtml(data: InvoiceData): string {
  const rows = data.lineItems.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? "transparent" : "#f8fafc"}">
      <td style="padding:10px 6px;border-bottom:1px solid #f1f5f9;color:#94a3b8;font-size:12px">${i + 1}</td>
      <td style="padding:10px 6px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:13px">${esc(item.description) || "—"}</td>
      <td style="padding:10px 6px;border-bottom:1px solid #f1f5f9;text-align:right;color:#475569;font-size:13px">${item.quantity}</td>
      <td style="padding:10px 6px;border-bottom:1px solid #f1f5f9;text-align:right;color:#475569;font-size:13px">${formatCurrency(item.rate, data.currency)}</td>
      <td style="padding:10px 6px;border-bottom:1px solid #f1f5f9;text-align:right;color:#1e293b;font-weight:600;font-size:13px">${formatCurrency(item.amount, data.currency)}</td>
    </tr>`).join("");

  return `
  <table>
    <thead>
      <tr>
        <th style="text-align:left;padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569">#</th>
        <th style="text-align:left;padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569">Description</th>
        <th style="text-align:right;padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569">Qty</th>
        <th style="text-align:right;padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569">Rate</th>
        <th style="text-align:right;padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function totalsHtml(data: InvoiceData, totals: ReturnType<typeof calculateTotals>): string {
  const gstRows = !data.enableGST ? "" : data.gstType === "CGST+SGST" ? `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#475569">
      <span>CGST (${data.gstRate / 2}%)</span><span>${formatCurrency(totals.cgst, data.currency)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#475569">
      <span>SGST (${data.gstRate / 2}%)</span><span>${formatCurrency(totals.sgst, data.currency)}</span>
    </div>` : `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#475569">
      <span>IGST (${data.gstRate}%)</span><span>${formatCurrency(totals.igst, data.currency)}</span>
    </div>`;

  const discountRow = data.enableDiscount && totals.discountAmount > 0 ? `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#059669">
      <span>Discount${data.discountType === "percent" ? ` (${data.discountValue}%)` : ""}</span>
      <span>−${formatCurrency(totals.discountAmount, data.currency)}</span>
    </div>` : "";

  return `
  <div style="display:flex;justify-content:flex-end;margin-top:24px">
    <div style="min-width:280px">
      <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#475569">
        <span>Subtotal</span><span>${formatCurrency(totals.subtotal, data.currency)}</span>
      </div>
      ${discountRow}
      ${gstRows}
      ${data.customFields?.filter(cf => cf.label && cf.value).map(cf =>
        `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#475569"><span>${esc(cf.label)}</span><span>${esc(cf.value)}</span></div>`
      ).join("") ?? ""}
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #0f172a;margin-top:4px;font-size:16px;font-weight:700;color:#0f172a">
        <span>Total</span><span>${formatCurrency(totals.total, data.currency)}</span>
      </div>
      ${data.signatureName || data.signatureImage ? `<div style="margin-top:32px;padding-top:8px;border-top:1px solid #e2e8f0;text-align:right">
        ${data.signatureImage ? `<img src="${data.signatureImage}" alt="Signature" style="max-height:48px;max-width:160px;object-fit:contain;margin-left:auto;display:block;margin-bottom:4px"/>` : `<div style="border-bottom:1px solid #94a3b8;width:120px;margin-left:auto;margin-bottom:4px"></div>`}
        <div style="font-size:11px;color:#94a3b8">Authorised Signatory</div>
        ${data.signatureName ? `<div style="font-size:13px;font-weight:600;color:#1e293b;margin-top:2px">${esc(data.signatureName)}</div>` : ""}
      </div>` : ""}
    </div>
  </div>`;
}

function bankHtml(data: InvoiceData, qrDataUrl?: string): string {
  const b = data.bankDetails;
  if (!b.bankName && !b.upiId) return "";
  return `
  <div>
    <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">Payment Details</div>
    ${b.bankName ? `<div style="font-size:12px;color:#475569">Bank: ${esc(b.bankName)}</div>` : ""}
    ${b.accountName ? `<div style="font-size:12px;color:#475569">A/C Name: ${esc(b.accountName)}</div>` : ""}
    ${b.accountNumber ? `<div style="font-size:12px;color:#475569">A/C No: ${esc(b.accountNumber)}</div>` : ""}
    ${b.ifscCode ? `<div style="font-size:12px;color:#475569">IFSC: ${esc(b.ifscCode)}</div>` : ""}
    ${b.upiId ? `<div style="font-size:12px;color:#475569;margin-top:6px">UPI: ${esc(b.upiId)}</div>` : ""}
    ${qrDataUrl && b.upiId ? `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid #e2e8f0;border-radius:8px;margin-top:12px;background:#f8fafc">
      <img src="${qrDataUrl}" alt="UPI QR" style="width:64px;height:64px;border-radius:4px;flex-shrink:0"/>
      <div>
        <div style="font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">Pay via UPI</div>
        <div style="font-size:12px;font-weight:600;color:#0f172a">${esc(b.upiId)}</div>
        <div style="font-size:10px;color:#64748b;margin-top:2px">Scan with any UPI app</div>
      </div>
    </div>` : ""}
  </div>`;
}

function notesHtml(data: InvoiceData): string {
  if (!data.notes && !data.terms) return "";
  return `
  <div>
    ${data.notes ? `<div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Notes</div>
      <div style="font-size:12px;color:#64748b;line-height:1.7">${esc(data.notes)}</div>` : ""}
    ${data.terms ? `<div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;margin-top:16px">Terms</div>
      <div style="font-size:12px;color:#64748b;line-height:1.7">${esc(data.terms)}</div>` : ""}
  </div>`;
}

// ─── Templates ────────────────────────────────────────────────────────────────

function minimalBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const accent = "#6366f1";
  return `
  <div style="padding:56px 64px;min-height:297mm;color:#0f172a;font-family:'Inter',sans-serif">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px">
      <div>
        <div style="font-size:28px;font-weight:800;color:#0f172a;letter-spacing:-1px">${esc(data.fromName) || "Your Name"}</div>
        ${data.fromGSTIN ? `<div style="font-size:11px;color:#94a3b8;margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
      </div>
      <div style="text-align:right">
        <div style="font-size:22px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:2px">${isProposal ? "Proposal" : "Invoice"}</div>
        <div style="font-size:13px;color:#64748b;margin-top:6px"># ${esc(data.invoiceNumber)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-bottom:40px">
      <div>
        <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">From</div>
        <div style="font-size:14px;font-weight:600">${esc(data.fromName) || "—"}</div>
        <div style="font-size:13px;color:#64748b;margin-top:3px">${esc(data.fromEmail)}</div>
        <div style="font-size:13px;color:#64748b">${esc(data.fromPhone)}</div>
        <div style="font-size:13px;color:#64748b;margin-top:6px;white-space:pre-line">${esc(data.fromAddress)}</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">Bill To</div>
        <div style="font-size:14px;font-weight:600">${esc(data.toName) || "—"}</div>
        <div style="font-size:13px;color:#64748b;margin-top:3px">${esc(data.toEmail)}</div>
        <div style="font-size:13px;color:#64748b">${esc(data.toPhone)}</div>
        <div style="font-size:13px;color:#64748b;margin-top:6px;white-space:pre-line">${esc(data.toAddress)}</div>
        ${data.toGSTIN ? `<div style="font-size:11px;color:#94a3b8;margin-top:6px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
      </div>
    </div>

    <div style="display:flex;gap:40px;margin-bottom:36px;padding:16px 20px;background:#f8fafc;border-radius:8px">
      <div>
        <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Date</div>
        <div style="font-size:13px;font-weight:500;margin-top:4px">${formatDate(data.invoiceDate)}</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Due Date</div>
        <div style="font-size:13px;font-weight:500;margin-top:4px">${formatDate(data.dueDate)}</div>
      </div>
      ${isProposal ? `<div>
        <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Valid Until</div>
        <div style="font-size:13px;font-weight:500;margin-top:4px">${formatDate(data.validUntil)}</div>
      </div>` : ""}
    </div>

    ${isProposal && data.projectTitle ? `
    <div style="margin-bottom:32px;padding:20px 24px;border:2px solid ${accent};border-radius:8px">
      <div style="font-size:14px;font-weight:700;color:${accent};margin-bottom:8px">${esc(data.projectTitle)}</div>
      <div style="font-size:13px;color:#475569;line-height:1.7;white-space:pre-line">${esc(data.projectScope)}</div>
    </div>` : ""}

    ${lineItemsHtml(data)}
    ${totalsHtml(data, totals)}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px">
      ${bankHtml(data, qrDataUrl)}
      ${notesHtml(data)}
    </div>

    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center">
      ${data.showBranding !== false ? `<div style="font-size:11px;color:#cbd5e1">Generated by BillForge</div>` : ""}
      <div style="width:40px;height:3px;background:${accent};border-radius:2px;margin-left:auto"></div>
    </div>
  </div>`;
}

function classicBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const accent = "#1e3a5f";
  return `
  <div style="min-height:297mm;color:#0f172a;font-family:'Inter',sans-serif">
    <div style="background:${accent};padding:40px 64px 32px;color:white">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px">${esc(data.fromName) || "Your Company"}</div>
          ${data.fromGSTIN ? `<div style="font-size:11px;opacity:.7;margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
          <div style="font-size:12px;opacity:.8;margin-top:8px;line-height:1.6">
            ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
            ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
            ${data.fromAddress ? `<div style="white-space:pre-line">${esc(data.fromAddress)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:3px;opacity:.9">${isProposal ? "Proposal" : "Invoice"}</div>
          <div style="font-size:14px;opacity:.7;margin-top:6px">#${esc(data.invoiceNumber)}</div>
          <div style="font-size:13px;opacity:.7;margin-top:2px">${formatDate(data.invoiceDate)}</div>
        </div>
      </div>
    </div>

    <div style="padding:40px 64px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px">
        <div>
          <div style="font-size:10px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid ${accent};padding-bottom:6px">Bill To</div>
          <div style="font-size:15px;font-weight:700">${esc(data.toName) || "—"}</div>
          <div style="font-size:13px;color:#64748b;margin-top:4px;line-height:1.6">
            ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
            ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
            ${data.toAddress ? `<div style="white-space:pre-line;margin-top:4px">${esc(data.toAddress)}</div>` : ""}
            ${data.toGSTIN ? `<div style="margin-top:6px;font-size:11px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid ${accent};padding-bottom:6px">Details</div>
          <div style="display:grid;gap:6px">
            <div style="display:flex;justify-content:flex-end;gap:16px">
              <span style="color:#94a3b8;font-size:12px">Invoice Date</span>
              <span style="font-size:12px;font-weight:600">${formatDate(data.invoiceDate)}</span>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:16px">
              <span style="color:#94a3b8;font-size:12px">Due Date</span>
              <span style="font-size:12px;font-weight:600">${formatDate(data.dueDate)}</span>
            </div>
            ${isProposal ? `<div style="display:flex;justify-content:flex-end;gap:16px">
              <span style="color:#94a3b8;font-size:12px">Valid Until</span>
              <span style="font-size:12px;font-weight:600">${formatDate(data.validUntil)}</span>
            </div>` : ""}
          </div>
        </div>
      </div>

      ${isProposal && data.projectTitle ? `
      <div style="margin-bottom:32px;padding:20px 24px;background:#eff6ff;border-left:4px solid ${accent}">
        <div style="font-size:14px;font-weight:700;color:${accent};margin-bottom:8px">${esc(data.projectTitle)}</div>
        <div style="font-size:13px;color:#475569;line-height:1.7;white-space:pre-line">${esc(data.projectScope)}</div>
      </div>` : ""}

      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px">
        ${bankHtml(data, qrDataUrl)}
        ${notesHtml(data)}
      </div>
    </div>
  </div>`;
}

function boldBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  return `
  <div style="min-height:297mm;color:#0f172a;font-family:'Inter',sans-serif">
    <div style="background:#0f172a;padding:56px 64px 40px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:32px;font-weight:900;color:white;letter-spacing:-1px">${esc(data.fromName) || "Your Company"}</div>
          ${data.fromGSTIN ? `<div style="font-size:11px;color:#64748b;margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
        </div>
      </div>
      <div style="margin-top:24px;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899);border-radius:2px"></div>
    </div>

    <div style="padding:40px 64px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
        <div>
          <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Bill To</div>
          <div style="font-size:16px;font-weight:700">${esc(data.toName) || "—"}</div>
          <div style="font-size:13px;color:#64748b;margin-top:4px">${esc(data.toEmail)}</div>
          <div style="font-size:13px;color:#64748b">${esc(data.toPhone)}</div>
          ${data.toAddress ? `<div style="font-size:13px;color:#64748b;margin-top:6px;white-space:pre-line">${esc(data.toAddress)}</div>` : ""}
          ${data.toGSTIN ? `<div style="font-size:11px;color:#94a3b8;margin-top:4px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
        </div>
        <div style="text-align:right">
          <div style="font-size:28px;font-weight:900;color:#0f172a;text-transform:uppercase">${isProposal ? "Proposal" : "Invoice"}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:4px">#${esc(data.invoiceNumber)}</div>
          <div style="display:flex;gap:24px;margin-top:16px;justify-content:flex-end">
            <div>
              <div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Issued</div>
              <div style="font-size:13px;font-weight:600">${formatDate(data.invoiceDate)}</div>
            </div>
            <div>
              <div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Due</div>
              <div style="font-size:13px;font-weight:600">${formatDate(data.dueDate)}</div>
            </div>
          </div>
        </div>
      </div>

      ${isProposal && data.projectTitle ? `
      <div style="margin-bottom:32px;padding:20px 24px;background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(139,92,246,.06));border:1px solid rgba(99,102,241,.2);border-radius:8px">
        <div style="font-size:15px;font-weight:700;color:#4f46e5;margin-bottom:8px">${esc(data.projectTitle)}</div>
        <div style="font-size:13px;color:#475569;line-height:1.7;white-space:pre-line">${esc(data.projectScope)}</div>
      </div>` : ""}

      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px">
        <div style="padding:16px 20px;background:#f8fafc;border-radius:8px">${bankHtml(data, qrDataUrl)}</div>
        ${notesHtml(data)}
      </div>

      <div style="margin-top:40px;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899);border-radius:2px"></div>
    </div>
  </div>`;
}

function elegantBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const gold = "#b45309";
  return `
  <div style="min-height:297mm;color:#1c1917;font-family:'EB Garamond','Georgia',serif">
    <div style="height:6px;background:linear-gradient(90deg,${gold},#d97706,${gold})"></div>
    <div style="padding:48px 64px">
      <div style="text-align:center;margin-bottom:48px;border-bottom:1px solid #e7e5e4;padding-bottom:32px">
        <div style="font-size:30px;font-weight:700;color:#1c1917;letter-spacing:-0.5px">${esc(data.fromName) || "Your Company"}</div>
        ${data.fromGSTIN ? `<div style="font-size:11px;color:#a8a29e;margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
        <div style="font-size:12px;color:#78716c;margin-top:8px">${[data.fromEmail, data.fromPhone].filter(Boolean).map(esc).join(" · ")}</div>
        <div style="display:inline-block;margin-top:16px;padding-top:16px;border-top:2px solid ${gold}">
          <div style="font-size:18px;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:4px">${isProposal ? "Business Proposal" : "Tax Invoice"}</div>
          <div style="font-size:12px;color:#a8a29e;margin-top:4px">#${esc(data.invoiceNumber)}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-bottom:40px">
        <div>
          <div style="font-size:10px;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Billed To</div>
          <div style="font-size:15px;font-weight:700;color:#1c1917">${esc(data.toName) || "—"}</div>
          <div style="font-size:13px;color:#78716c;margin-top:4px;line-height:1.7">
            ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
            ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
            ${data.toAddress ? `<div style="margin-top:4px;white-space:pre-line">${esc(data.toAddress)}</div>` : ""}
            ${data.toGSTIN ? `<div style="margin-top:6px;font-size:11px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Dates</div>
          <div style="font-size:13px;color:#78716c;line-height:2">
            <div>Invoice Date: <strong style="color:#1c1917">${formatDate(data.invoiceDate)}</strong></div>
            <div>Due Date: <strong style="color:#1c1917">${formatDate(data.dueDate)}</strong></div>
            ${isProposal ? `<div>Valid Until: <strong style="color:#1c1917">${formatDate(data.validUntil)}</strong></div>` : ""}
          </div>
        </div>
      </div>

      ${isProposal && data.projectTitle ? `
      <div style="margin-bottom:32px;padding:24px;background:#fef3c7;border-radius:8px;border:1px solid #fde68a">
        <div style="font-size:14px;font-weight:700;color:${gold};margin-bottom:10px">${esc(data.projectTitle)}</div>
        <div style="font-size:13px;color:#78716c;line-height:1.8;white-space:pre-line">${esc(data.projectScope)}</div>
      </div>` : ""}

      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px">
        ${bankHtml(data, qrDataUrl)}
        ${notesHtml(data)}
      </div>
    </div>
    <div style="height:6px;background:linear-gradient(90deg,${gold},#d97706,${gold})"></div>
  </div>`;
}

function studioBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const purple = "#1e1b4b";
  const accent = "#818cf8";
  return `
  <div style="min-height:297mm;color:#0f172a;font-family:'Inter',sans-serif;display:flex">
    <div style="width:220px;background:${purple};padding:48px 28px;flex-shrink:0;display:flex;flex-direction:column;gap:24px">
      <div>
        <div style="width:40px;height:3px;background:${accent};border-radius:2px;margin-bottom:20px"></div>
        <div style="font-size:18px;font-weight:800;color:white;line-height:1.2;letter-spacing:-0.5px">${esc(data.fromName) || "Your Studio"}</div>
        ${data.fromGSTIN ? `<div style="font-size:10px;color:#a5b4fc;margin-top:6px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
        <div style="font-size:11px;color:#a5b4fc;margin-top:8px;line-height:1.8">
          ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
          ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
          ${data.fromAddress ? `<div style="white-space:pre-line;margin-top:4px">${esc(data.fromAddress)}</div>` : ""}
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px">
        <div style="font-size:9px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Bill To</div>
        <div style="font-size:13px;font-weight:700;color:white">${esc(data.toName) || "—"}</div>
        <div style="font-size:11px;color:#a5b4fc;margin-top:4px;line-height:1.8">
          ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
          ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
          ${data.toAddress ? `<div style="white-space:pre-line;margin-top:2px">${esc(data.toAddress)}</div>` : ""}
          ${data.toGSTIN ? `<div style="margin-top:4px;font-size:10px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px">
        <div style="font-size:9px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Dates</div>
        <div style="font-size:11px;color:#a5b4fc;line-height:2">
          <div>Issued: <span style="color:white;font-weight:600">${formatDate(data.invoiceDate)}</span></div>
          <div>Due: <span style="color:white;font-weight:600">${formatDate(data.dueDate)}</span></div>
          ${isProposal ? `<div>Valid: <span style="color:white;font-weight:600">${formatDate(data.validUntil)}</span></div>` : ""}
        </div>
      </div>
    </div>
    <div style="flex:1;padding:48px 40px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
        <div>
          <div style="font-size:32px;font-weight:900;color:${purple};text-transform:uppercase;letter-spacing:3px">${isProposal ? "Proposal" : "Invoice"}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:4px">#${esc(data.invoiceNumber)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:28px;font-weight:800;color:${purple}">${formatCurrency(totals.total, data.currency)}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px">Amount Due</div>
        </div>
      </div>
      ${isProposal && data.projectTitle ? `
      <div style="margin-bottom:32px;padding:20px 24px;background:#eef2ff;border-radius:10px;border-left:4px solid ${accent}">
        <div style="font-size:14px;font-weight:700;color:${purple};margin-bottom:8px">${esc(data.projectTitle)}</div>
        <div style="font-size:13px;color:#475569;line-height:1.7;white-space:pre-line">${esc(data.projectScope)}</div>
      </div>` : ""}
      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}
      ${data.notes || data.terms ? `<div style="margin-top:32px;padding-top:20px;border-top:1px solid #f1f5f9">
        ${data.notes ? `<div style="font-size:12px;color:#64748b;line-height:1.7;margin-bottom:10px">${esc(data.notes)}</div>` : ""}
        ${data.terms ? `<div style="font-size:11px;color:#94a3b8;line-height:1.6">${esc(data.terms)}</div>` : ""}
      </div>` : ""}
    </div>
  </div>`;
}

function slateBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  return `
  <div style="min-height:297mm;color:#1e293b;font-family:'Inter',sans-serif;padding:56px 64px;background:white">
    <div style="height:2px;background:#475569;margin-bottom:48px"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px">
      <div>
        <div style="font-size:26px;font-weight:800;color:#0f172a">${esc(data.fromName) || "Your Company"}</div>
        ${data.fromGSTIN ? `<div style="font-size:11px;color:#94a3b8;margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
        <div style="font-size:12px;color:#64748b;margin-top:8px;line-height:1.7">
          ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
          ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:3px">${isProposal ? "Proposal" : "Invoice"}</div>
        <div style="font-size:36px;font-weight:900;color:#0f172a;letter-spacing:-1px;margin-top:4px">#${esc(data.invoiceNumber)}</div>
        <div style="font-size:12px;color:#64748b;margin-top:8px">Date: <strong style="color:#1e293b">${formatDate(data.invoiceDate)}</strong></div>
        <div style="font-size:12px;color:#64748b">Due: <strong style="color:#1e293b">${formatDate(data.dueDate)}</strong></div>
      </div>
    </div>
    <div style="background:#f8fafc;border-radius:8px;padding:20px 24px;margin-bottom:36px">
      <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Bill To</div>
      <div style="font-size:15px;font-weight:700;color:#0f172a">${esc(data.toName) || "—"}</div>
      <div style="font-size:13px;color:#64748b;margin-top:4px;line-height:1.7">
        ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
        ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
        ${data.toAddress ? `<div style="white-space:pre-line;margin-top:2px">${esc(data.toAddress)}</div>` : ""}
        ${data.toGSTIN ? `<div style="font-size:11px;margin-top:4px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
      </div>
    </div>
    ${lineItemsHtml(data)}
    ${totalsHtml(data, totals)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px">
      ${bankHtml(data, qrDataUrl)}
      ${notesHtml(data)}
    </div>
    <div style="height:2px;background:#e2e8f0;margin-top:40px"></div>
  </div>`;
}

function neonBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const cyan = "#06b6d4";
  const magenta = "#d946ef";
  const gstRows = !data.enableGST ? "" : data.gstType === "CGST+SGST" ? `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#71717a"><span>CGST (${data.gstRate/2}%)</span><span>${formatCurrency(totals.cgst,data.currency)}</span></div>
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#71717a"><span>SGST (${data.gstRate/2}%)</span><span>${formatCurrency(totals.sgst,data.currency)}</span></div>` : `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#71717a"><span>IGST (${data.gstRate}%)</span><span>${formatCurrency(totals.igst,data.currency)}</span></div>`;
  return `
  <div style="min-height:297mm;background:#09090b;color:#f4f4f5;font-family:'Inter',sans-serif;padding:56px 64px">
    <div style="height:3px;background:linear-gradient(90deg,${cyan},${magenta});border-radius:2px;margin-bottom:48px"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px">
      <div>
        <div style="font-size:26px;font-weight:800;color:#f4f4f5">${esc(data.fromName) || "Your Company"}</div>
        ${data.fromGSTIN ? `<div style="font-size:10px;color:#71717a;margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
        <div style="font-size:12px;color:#71717a;margin-top:8px;line-height:1.7">
          ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
          ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;font-weight:700;color:${cyan};text-transform:uppercase;letter-spacing:4px">${isProposal ? "Proposal" : "Invoice"}</div>
        <div style="font-size:22px;font-weight:800;color:#f4f4f5;margin-top:4px">#${esc(data.invoiceNumber)}</div>
        <div style="font-size:28px;font-weight:900;color:${cyan};margin-top:6px">${formatCurrency(totals.total, data.currency)}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:36px">
      <div style="padding:16px 20px;border:1px solid rgba(6,182,212,0.2);border-radius:8px;background:rgba(6,182,212,0.04)">
        <div style="font-size:9px;font-weight:700;color:${cyan};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Bill To</div>
        <div style="font-size:14px;font-weight:700;color:#f4f4f5">${esc(data.toName) || "—"}</div>
        <div style="font-size:12px;color:#71717a;margin-top:4px;line-height:1.7">
          ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
          ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
          ${data.toAddress ? `<div style="white-space:pre-line;margin-top:2px">${esc(data.toAddress)}</div>` : ""}
        </div>
      </div>
      <div style="padding:16px 20px;border:1px solid rgba(217,70,239,0.2);border-radius:8px;background:rgba(217,70,239,0.04)">
        <div style="font-size:9px;font-weight:700;color:${magenta};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Details</div>
        <div style="font-size:12px;color:#a1a1aa;line-height:2">
          <div>Date: <span style="color:#f4f4f5;font-weight:600">${formatDate(data.invoiceDate)}</span></div>
          <div>Due: <span style="color:#f4f4f5;font-weight:600">${formatDate(data.dueDate)}</span></div>
        </div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="border-bottom:1px solid rgba(6,182,212,0.3)">
        <th style="text-align:left;padding:8px 6px;font-weight:600;color:${cyan};font-size:11px;text-transform:uppercase">#</th>
        <th style="text-align:left;padding:8px 6px;font-weight:600;color:${cyan};font-size:11px;text-transform:uppercase">Description</th>
        <th style="text-align:right;padding:8px 6px;font-weight:600;color:${cyan};font-size:11px;text-transform:uppercase">Qty</th>
        <th style="text-align:right;padding:8px 6px;font-weight:600;color:${cyan};font-size:11px;text-transform:uppercase">Rate</th>
        <th style="text-align:right;padding:8px 6px;font-weight:600;color:${cyan};font-size:11px;text-transform:uppercase">Amount</th>
      </tr></thead>
      <tbody>${data.lineItems.map((item, i) => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
          <td style="padding:10px 6px;color:#52525b;font-size:12px">${i+1}</td>
          <td style="padding:10px 6px;color:#e4e4e7">${esc(item.description)||"—"}</td>
          <td style="padding:10px 6px;text-align:right;color:#a1a1aa">${item.quantity}</td>
          <td style="padding:10px 6px;text-align:right;color:#a1a1aa">${formatCurrency(item.rate,data.currency)}</td>
          <td style="padding:10px 6px;text-align:right;color:#f4f4f5;font-weight:600">${formatCurrency(item.amount,data.currency)}</td>
        </tr>`).join("")}</tbody>
    </table>
    <div style="display:flex;justify-content:flex-end;margin-top:24px">
      <div style="min-width:280px">
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#71717a"><span>Subtotal</span><span>${formatCurrency(totals.subtotal,data.currency)}</span></div>
        ${data.enableDiscount && totals.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#34d399"><span>Discount</span><span>−${formatCurrency(totals.discountAmount,data.currency)}</span></div>` : ""}
        ${gstRows}
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid ${cyan};margin-top:4px;font-size:18px;font-weight:800">
          <span style="color:#f4f4f5">Total</span><span style="color:${cyan}">${formatCurrency(totals.total,data.currency)}</span>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:40px">
      ${data.bankDetails.bankName || data.bankDetails.upiId ? `<div style="padding:16px;border:1px solid rgba(255,255,255,0.06);border-radius:8px">
        <div style="font-size:9px;font-weight:700;color:${magenta};text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Payment</div>
        ${data.bankDetails.bankName ? `<div style="font-size:12px;color:#71717a">Bank: ${esc(data.bankDetails.bankName)}</div>` : ""}
        ${data.bankDetails.accountNumber ? `<div style="font-size:12px;color:#71717a">A/C: ${esc(data.bankDetails.accountNumber)}</div>` : ""}
        ${data.bankDetails.upiId ? `<div style="font-size:12px;color:${cyan};font-weight:600;margin-top:4px">${esc(data.bankDetails.upiId)}</div>` : ""}
      </div>` : ""}
      <div>
        ${data.notes ? `<div style="font-size:12px;color:#71717a;line-height:1.7">${esc(data.notes)}</div>` : ""}
        ${data.terms ? `<div style="font-size:11px;color:#52525b;line-height:1.6;margin-top:8px">${esc(data.terms)}</div>` : ""}
      </div>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,${cyan},${magenta});border-radius:2px;margin-top:48px"></div>
  </div>`;
}

function terraBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const terra = "#c2410c";
  return `
  <div style="min-height:297mm;background:#faf9f7;color:#78350f;font-family:'Georgia',serif">
    <div style="background:${terra};padding:48px 64px 36px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:white">${esc(data.fromName) || "Your Business"}</div>
          ${data.fromGSTIN ? `<div style="font-size:11px;color:rgba(255,255,255,0.65);margin-top:4px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
          <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:8px;line-height:1.7">
            ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
            ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:20px;font-weight:700;color:white;text-transform:uppercase;letter-spacing:2px">${isProposal ? "Proposal" : "Invoice"}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:6px">#${esc(data.invoiceNumber)}</div>
        </div>
      </div>
      <div style="display:flex;gap:32px;margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.2)">
        <div><div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase">Date</div><div style="font-size:13px;font-weight:600;color:white;margin-top:2px">${formatDate(data.invoiceDate)}</div></div>
        <div><div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase">Due Date</div><div style="font-size:13px;font-weight:600;color:white;margin-top:2px">${formatDate(data.dueDate)}</div></div>
        ${isProposal ? `<div><div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase">Valid Until</div><div style="font-size:13px;font-weight:600;color:white;margin-top:2px">${formatDate(data.validUntil)}</div></div>` : ""}
      </div>
    </div>
    <div style="padding:40px 64px">
      <div style="margin-bottom:36px">
        <div style="font-size:10px;font-weight:700;color:${terra};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid ${terra};padding-bottom:6px;display:inline-block">Bill To</div>
        <div style="font-size:16px;font-weight:700;color:#78350f">${esc(data.toName) || "—"}</div>
        <div style="font-size:13px;color:#92400e;margin-top:4px;line-height:1.7">
          ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
          ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
          ${data.toAddress ? `<div style="white-space:pre-line;margin-top:2px">${esc(data.toAddress)}</div>` : ""}
          ${data.toGSTIN ? `<div style="font-size:11px;margin-top:4px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
        </div>
      </div>
      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px">
        ${bankHtml(data, qrDataUrl)}
        ${notesHtml(data)}
      </div>
    </div>
    <div style="height:6px;background:${terra}"></div>
  </div>`;
}

function arcticBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const blue = "#0ea5e9";
  return `
  <div style="min-height:297mm;background:white;color:#0c4a6e;font-family:'Inter',sans-serif">
    <div style="height:5px;background:${blue}"></div>
    <div style="padding:64px 72px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:64px">
        <div>
          <div style="font-size:30px;font-weight:800;color:#0c4a6e;letter-spacing:-1px">${esc(data.fromName) || "Your Company"}</div>
          ${data.fromGSTIN ? `<div style="font-size:11px;color:#94a3b8;margin-top:6px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
          <div style="font-size:12px;color:#64748b;margin-top:10px;line-height:1.9">
            ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
            ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;font-weight:700;color:${blue};text-transform:uppercase;letter-spacing:4px">${isProposal ? "Proposal" : "Invoice"}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:8px">#${esc(data.invoiceNumber)}</div>
          <div style="font-size:36px;font-weight:900;color:${blue};margin-top:8px;letter-spacing:-1px">${formatCurrency(totals.total,data.currency)}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px">Due ${formatDate(data.dueDate)}</div>
        </div>
      </div>
      <div style="background:#f0f9ff;border-radius:16px;padding:28px 32px;margin-bottom:48px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
        <div>
          <div style="font-size:10px;font-weight:700;color:${blue};text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Bill To</div>
          <div style="font-size:16px;font-weight:700;color:#0c4a6e">${esc(data.toName) || "—"}</div>
          <div style="font-size:12px;color:#64748b;margin-top:6px;line-height:1.8">
            ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
            ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
            ${data.toAddress ? `<div style="white-space:pre-line;margin-top:2px">${esc(data.toAddress)}</div>` : ""}
            ${data.toGSTIN ? `<div style="font-size:11px;margin-top:4px">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
          </div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:${blue};text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Details</div>
          <div style="font-size:12px;color:#64748b;line-height:2">
            <div>Invoice Date <strong style="color:#0c4a6e;float:right">${formatDate(data.invoiceDate)}</strong></div>
            <div>Due Date <strong style="color:#0c4a6e;float:right">${formatDate(data.dueDate)}</strong></div>
            ${isProposal ? `<div>Valid Until <strong style="color:#0c4a6e;float:right">${formatDate(data.validUntil)}</strong></div>` : ""}
          </div>
        </div>
      </div>
      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:56px">
        ${data.bankDetails.bankName || data.bankDetails.upiId ? `<div style="background:#f0f9ff;border-radius:12px;padding:20px 24px">
          <div style="font-size:10px;font-weight:700;color:${blue};text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Payment Details</div>
          ${data.bankDetails.bankName ? `<div style="font-size:12px;color:#475569">Bank: ${esc(data.bankDetails.bankName)}</div>` : ""}
          ${data.bankDetails.accountName ? `<div style="font-size:12px;color:#475569">A/C: ${esc(data.bankDetails.accountName)}</div>` : ""}
          ${data.bankDetails.accountNumber ? `<div style="font-size:12px;color:#475569">No: ${esc(data.bankDetails.accountNumber)}</div>` : ""}
          ${data.bankDetails.ifscCode ? `<div style="font-size:12px;color:#475569">IFSC: ${esc(data.bankDetails.ifscCode)}</div>` : ""}
          ${data.bankDetails.upiId ? `<div style="font-size:12px;color:${blue};font-weight:700;margin-top:6px">UPI: ${esc(data.bankDetails.upiId)}</div>` : ""}
        </div>` : ""}
        ${notesHtml(data)}
      </div>
    </div>
    <div style="height:5px;background:${blue}"></div>
  </div>`;
}

function executiveBody(data: InvoiceData, totals: ReturnType<typeof calculateTotals>, isProposal: boolean, qrDataUrl?: string): string {
  const navy = "#0f1729";
  const gold = "#d4af37";
  return `
  <div style="min-height:297mm;background:white;color:#1e293b;font-family:'Georgia',serif">
    <div style="background:${navy};padding:56px 64px 44px">
      <div style="height:1px;background:${gold};opacity:0.4;margin-bottom:32px"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:white;letter-spacing:0.5px">${esc(data.fromName) || "Your Firm"}</div>
          ${data.fromGSTIN ? `<div style="font-size:11px;color:rgba(212,175,55,0.7);margin-top:5px;letter-spacing:1px">GSTIN: ${esc(data.fromGSTIN)}</div>` : ""}
          <div style="font-size:12px;color:rgba(255,255,255,0.55);margin-top:12px;line-height:1.9">
            ${data.fromEmail ? `<div>${esc(data.fromEmail)}</div>` : ""}
            ${data.fromPhone ? `<div>${esc(data.fromPhone)}</div>` : ""}
            ${data.fromAddress ? `<div style="white-space:pre-line;margin-top:2px">${esc(data.fromAddress)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;color:${gold};text-transform:uppercase;letter-spacing:5px;font-family:'Inter',sans-serif">${isProposal ? "Business Proposal" : "Tax Invoice"}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:8px">No. ${esc(data.invoiceNumber)}</div>
          <div style="font-size:14px;color:white;font-weight:600;margin-top:16px">${formatDate(data.invoiceDate)}</div>
          <div style="font-size:14px;color:${gold};font-weight:700;margin-top:4px">Due ${formatDate(data.dueDate)}</div>
        </div>
      </div>
      <div style="height:1px;background:${gold};opacity:0.4;margin-top:32px"></div>
    </div>
    <div style="padding:44px 64px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-bottom:44px">
        <div>
          <div style="font-size:10px;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;font-family:'Inter',sans-serif">Billed To</div>
          <div style="font-size:17px;font-weight:700;color:${navy}">${esc(data.toName) || "—"}</div>
          <div style="font-size:13px;color:#475569;margin-top:6px;line-height:1.8">
            ${data.toEmail ? `<div>${esc(data.toEmail)}</div>` : ""}
            ${data.toPhone ? `<div>${esc(data.toPhone)}</div>` : ""}
            ${data.toAddress ? `<div style="white-space:pre-line;margin-top:4px">${esc(data.toAddress)}</div>` : ""}
            ${data.toGSTIN ? `<div style="font-size:11px;margin-top:6px;color:#64748b">GSTIN: ${esc(data.toGSTIN)}</div>` : ""}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end">
          <div style="font-size:10px;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;font-family:'Inter',sans-serif">Amount Due</div>
          <div style="font-size:40px;font-weight:700;color:${navy};letter-spacing:-1px">${formatCurrency(totals.total,data.currency)}</div>
        </div>
      </div>
      ${isProposal && data.projectTitle ? `
      <div style="margin-bottom:36px;padding:24px 28px;background:#f8f6f0;border-radius:4px;border-left:4px solid ${gold}">
        <div style="font-size:14px;font-weight:700;color:${navy};margin-bottom:10px">${esc(data.projectTitle)}</div>
        <div style="font-size:13px;color:#475569;line-height:1.8;white-space:pre-line">${esc(data.projectScope)}</div>
      </div>` : ""}
      ${lineItemsHtml(data)}
      ${totalsHtml(data, totals)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:52px;padding-top:36px;border-top:1px solid #e2e8f0">
        ${bankHtml(data, qrDataUrl)}
        ${notesHtml(data)}
      </div>
    </div>
    <div style="height:3px;background:${gold};margin:0 64px"></div>
    <div style="height:12px;background:${navy}"></div>
  </div>`;
}

function esc(str: string | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
