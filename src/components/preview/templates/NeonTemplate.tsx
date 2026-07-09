import React from "react";
import type { TemplateProps } from "./shared";

export function NeonTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const cyan = "#06b6d4";
  const magenta = "#d946ef";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif", padding: "56px 64px" }}>
      {/* Header gradient bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cyan}, ${magenta})`, borderRadius: 2, marginBottom: 48 }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#f4f4f5", letterSpacing: -0.5 }}>{data.fromName || "Your Company"}</div>
          {data.fromGSTIN && <div style={{ fontSize: 10, color: "#71717a", marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>}
          <div style={{ fontSize: 12, color: "#71717a", marginTop: 8, lineHeight: 1.7 }}>
            {data.fromEmail && <div>{data.fromEmail}</div>}
            {data.fromPhone && <div>{data.fromPhone}</div>}
            {data.fromAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.fromAddress}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: cyan, textTransform: "uppercase", letterSpacing: 4 }}>{isProposal ? "Proposal" : "Invoice"}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f4f4f5", marginTop: 4 }}>#{data.invoiceNumber}</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }} >
            <span style={{ color: cyan }}>{formatCurrency(totals.total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* From / To */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
        <div style={{ padding: "16px 20px", border: `1px solid rgba(6,182,212,0.2)`, borderRadius: 8, backgroundColor: "rgba(6,182,212,0.04)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: cyan, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Bill To</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5" }}>{data.toName || "—"}</div>
          <div style={{ fontSize: 12, color: "#71717a", marginTop: 4, lineHeight: 1.7 }}>
            {data.toEmail && <div>{data.toEmail}</div>}
            {data.toPhone && <div>{data.toPhone}</div>}
            {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.toAddress}</div>}
            {data.toGSTIN && <div style={{ fontSize: 10, marginTop: 4 }}>GSTIN: {data.toGSTIN}</div>}
          </div>
        </div>
        <div style={{ padding: "16px 20px", border: `1px solid rgba(217,70,239,0.2)`, borderRadius: 8, backgroundColor: "rgba(217,70,239,0.04)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: magenta, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Details</div>
          <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 2 }}>
            <div>Date: <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{formatDate(data.invoiceDate)}</span></div>
            <div>Due: <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{formatDate(data.dueDate)}</span></div>
            {isProposal && <div>Valid: <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{formatDate(data.validUntil)}</span></div>}
          </div>
        </div>
      </div>

      {isProposal && data.projectTitle && (
        <div style={{ marginBottom: 32, padding: "20px 24px", border: `1px solid rgba(6,182,212,0.3)`, borderRadius: 8, backgroundColor: "rgba(6,182,212,0.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: cyan, marginBottom: 8 }}>{data.projectTitle}</div>
          <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
        </div>
      )}

      {/* Line Items — dark themed */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid rgba(6,182,212,0.3)` }}>
            <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: cyan, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>#</th>
            <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: cyan, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Description</th>
            <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 600, color: cyan, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 600, color: cyan, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Rate</th>
            <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 600, color: cyan, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item, i) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "10px 6px", color: "#52525b", fontSize: 12 }}>{i + 1}</td>
              <td style={{ padding: "10px 6px", color: "#e4e4e7" }}>{item.description || "—"}</td>
              <td style={{ padding: "10px 6px", textAlign: "right", color: "#a1a1aa" }}>{item.quantity}</td>
              <td style={{ padding: "10px 6px", textAlign: "right", color: "#a1a1aa" }}>{formatCurrency(item.rate, data.currency)}</td>
              <td style={{ padding: "10px 6px", textAlign: "right", color: "#f4f4f5", fontWeight: 600 }}>{formatCurrency(item.amount, data.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <div style={{ minWidth: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#71717a" }}>
            <span>Subtotal</span><span>{formatCurrency(totals.subtotal, data.currency)}</span>
          </div>
          {data.enableDiscount && totals.discountAmount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#34d399" }}>
              <span>Discount</span><span>−{formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
          )}
          {data.enableGST && data.gstType === "CGST+SGST" && <>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#71717a" }}><span>CGST ({data.gstRate / 2}%)</span><span>{formatCurrency(totals.cgst, data.currency)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#71717a" }}><span>SGST ({data.gstRate / 2}%)</span><span>{formatCurrency(totals.sgst, data.currency)}</span></div>
          </>}
          {data.enableGST && data.gstType === "IGST" && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#71717a" }}><span>IGST ({data.gstRate}%)</span><span>{formatCurrency(totals.igst, data.currency)}</span></div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: `2px solid ${cyan}`, marginTop: 4, fontSize: 18, fontWeight: 800 }}>
            <span style={{ color: "#f4f4f5" }}>Total</span>
            <span style={{ color: cyan }}>{formatCurrency(totals.total, data.currency)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40 }}>
        {(data.bankDetails.bankName || data.bankDetails.upiId) && (
          <div style={{ padding: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: magenta, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Payment</div>
            {data.bankDetails.bankName && <div style={{ fontSize: 12, color: "#71717a" }}>Bank: {data.bankDetails.bankName}</div>}
            {data.bankDetails.accountNumber && <div style={{ fontSize: 12, color: "#71717a" }}>A/C: {data.bankDetails.accountNumber}</div>}
            {data.bankDetails.ifscCode && <div style={{ fontSize: 12, color: "#71717a" }}>IFSC: {data.bankDetails.ifscCode}</div>}
            {data.bankDetails.upiId && <div style={{ fontSize: 12, color: cyan, fontWeight: 600, marginTop: 4 }}>{data.bankDetails.upiId}</div>}
          </div>
        )}
        <div>
          {data.notes && <div style={{ fontSize: 12, color: "#71717a", lineHeight: 1.7 }}>{data.notes}</div>}
          {data.terms && <div style={{ fontSize: 11, color: "#52525b", lineHeight: 1.6, marginTop: 8 }}>{data.terms}</div>}
        </div>
      </div>

      <div style={{ height: 3, background: `linear-gradient(90deg, ${cyan}, ${magenta})`, borderRadius: 2, marginTop: 48 }} />
    </div>
  );
}
