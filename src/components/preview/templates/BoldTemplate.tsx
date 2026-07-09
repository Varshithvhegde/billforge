import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock } from "./shared";

export function BoldTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, color: "#0f172a", fontFamily: "Inter, sans-serif" }}>
      {/* Full-bleed dark header */}
      <div style={{ backgroundColor: "#0f172a", padding: "56px 64px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: -1 }}>
              {data.fromName || "Your Company"}
            </div>
            {data.fromGSTIN && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#f1f5f9", opacity: 0.08, textTransform: "uppercase", lineHeight: 1 }}>
              {isProposal ? "PROP" : "INV"}
            </div>
          </div>
        </div>
        {/* Accent stripe */}
        <div style={{ marginTop: 24, height: 3, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)", borderRadius: 2 }} />
      </div>

      <div style={{ padding: "40px 64px" }}>
        {/* Meta row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Bill To</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{data.toName || "—"}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{data.toEmail}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>{data.toPhone}</div>
            {data.toAddress && <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, whiteSpace: "pre-line" }}>{data.toAddress}</div>}
            {data.toGSTIN && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>GSTIN: {data.toGSTIN}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", textTransform: "uppercase" }}>
              {isProposal ? "Proposal" : "Invoice"}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>#{data.invoiceNumber}</div>
            <div style={{ display: "flex", gap: 24, marginTop: 16, justifyContent: "flex-end" }}>
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Issued</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(data.invoiceDate)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Due</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(data.dueDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 32, padding: "20px 24px", background: "linear-gradient(135deg, #6366f110, #8b5cf610)", border: "1px solid #6366f130", borderRadius: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#4f46e5", marginBottom: 8 }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
          {(data.bankDetails.bankName || data.bankDetails.upiId) && (
            <div style={{ padding: "16px 20px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Payment Details</div>
              {data.bankDetails.bankName && <div style={{ fontSize: 12, color: "#475569" }}>Bank: {data.bankDetails.bankName}</div>}
              {data.bankDetails.accountName && <div style={{ fontSize: 12, color: "#475569" }}>A/C Name: {data.bankDetails.accountName}</div>}
              {data.bankDetails.accountNumber && <div style={{ fontSize: 12, color: "#475569" }}>A/C No: {data.bankDetails.accountNumber}</div>}
              {data.bankDetails.ifscCode && <div style={{ fontSize: 12, color: "#475569" }}>IFSC: {data.bankDetails.ifscCode}</div>}
              {data.bankDetails.upiId && <div style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", marginTop: 8 }}>UPI: {data.bankDetails.upiId}</div>}
            </div>
          )}
          <div>
            {data.notes && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, marginBottom: 12 }}>{data.notes}</div>}
            {data.terms && <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>{data.terms}</div>}
          </div>
        </div>

        <div style={{ marginTop: 40, height: 3, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)", borderRadius: 2 }} />
      </div>
    </div>
  );
}
