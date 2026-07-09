import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock } from "./shared";

export function ArcticTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const blue = "#0ea5e9";
  const light = "#f0f9ff";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, backgroundColor: "#fff", color: "#0c4a6e", fontFamily: "'Inter', sans-serif" }}>
      {/* Top accent */}
      <div style={{ height: 5, backgroundColor: blue }} />

      <div style={{ padding: "64px 72px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 64 }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0c4a6e", letterSpacing: -1 }}>{data.fromName || "Your Company"}</div>
            {data.fromGSTIN && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>GSTIN: {data.fromGSTIN}</div>}
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 10, lineHeight: 1.9 }}>
              {data.fromEmail && <div>{data.fromEmail}</div>}
              {data.fromPhone && <div>{data.fromPhone}</div>}
              {data.fromAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.fromAddress}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: 4 }}>{isProposal ? "Proposal" : "Invoice"}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>#{data.invoiceNumber}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: blue, marginTop: 8, letterSpacing: -1 }}>
              {formatCurrency(totals.total, data.currency)}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Due {formatDate(data.dueDate)}</div>
          </div>
        </div>

        {/* Bill To card */}
        <div style={{ backgroundColor: light, borderRadius: 16, padding: "28px 32px", marginBottom: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Bill To</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0c4a6e" }}>{data.toName || "—"}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6, lineHeight: 1.8 }}>
              {data.toEmail && <div>{data.toEmail}</div>}
              {data.toPhone && <div>{data.toPhone}</div>}
              {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.toAddress}</div>}
              {data.toGSTIN && <div style={{ fontSize: 11, marginTop: 6 }}>GSTIN: {data.toGSTIN}</div>}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Details</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 2.2 }}>
              <div>Invoice Date <strong style={{ color: "#0c4a6e", float: "right" }}>{formatDate(data.invoiceDate)}</strong></div>
              <div>Due Date <strong style={{ color: "#0c4a6e", float: "right" }}>{formatDate(data.dueDate)}</strong></div>
              {isProposal && <div>Valid Until <strong style={{ color: "#0c4a6e", float: "right" }}>{formatDate(data.validUntil)}</strong></div>}
            </div>
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 40, padding: "24px 28px", border: `2px solid ${blue}`, borderRadius: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: blue, marginBottom: 10 }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 56 }}>
          {(data.bankDetails.bankName || data.bankDetails.upiId) && (
            <div style={{ backgroundColor: light, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Payment Details</div>
              {data.bankDetails.bankName && <div style={{ fontSize: 12, color: "#475569" }}>Bank: {data.bankDetails.bankName}</div>}
              {data.bankDetails.accountName && <div style={{ fontSize: 12, color: "#475569" }}>A/C: {data.bankDetails.accountName}</div>}
              {data.bankDetails.accountNumber && <div style={{ fontSize: 12, color: "#475569" }}>No: {data.bankDetails.accountNumber}</div>}
              {data.bankDetails.ifscCode && <div style={{ fontSize: 12, color: "#475569" }}>IFSC: {data.bankDetails.ifscCode}</div>}
              {data.bankDetails.upiId && <div style={{ fontSize: 12, color: blue, fontWeight: 700, marginTop: 6 }}>UPI: {data.bankDetails.upiId}</div>}
            </div>
          )}
          <div>
            {data.notes && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>{data.notes}</div>}
            {data.terms && <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginTop: 10 }}>{data.terms}</div>}
          </div>
        </div>
      </div>

      <div style={{ height: 5, backgroundColor: blue }} />
    </div>
  );
}
