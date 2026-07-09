import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock } from "./shared";

export function MinimalTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const accent = "#6366f1";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ padding: "56px 64px", minHeight: 1123, color: "#0f172a", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: -1 }}>
            {data.fromName || "Your Name"}
          </div>
          {data.fromGSTIN && (
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 2 }}>
            {isProposal ? "Proposal" : "Invoice"}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
            {isProposal ? `# ${data.invoiceNumber}` : `# ${data.invoiceNumber}`}
          </div>
        </div>
      </div>

      {/* From / To */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>From</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{data.fromName || "—"}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{data.fromEmail}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{data.fromPhone}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, whiteSpace: "pre-line" }}>{data.fromAddress}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Bill To</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{data.toName || "—"}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{data.toEmail}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{data.toPhone}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, whiteSpace: "pre-line" }}>{data.toAddress}</div>
          {data.toGSTIN && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>GSTIN: {data.toGSTIN}</div>}
        </div>
      </div>

      {/* Dates */}
      <div style={{ display: "flex", gap: 40, marginBottom: 36, padding: "16px 20px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Date</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{formatDate(data.invoiceDate)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Due Date</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{formatDate(data.dueDate)}</div>
        </div>
        {isProposal && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Valid Until</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{formatDate(data.validUntil)}</div>
          </div>
        )}
      </div>

      {/* Proposal extras */}
      {isProposal && data.projectTitle && (
        <div style={{ marginBottom: 32, padding: "20px 24px", border: `2px solid ${accent}`, borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 8 }}>{data.projectTitle}</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
        </div>
      )}

      {/* Line Items */}
      <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

      {/* Totals */}
      <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

      {/* Bank & Notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
        {(data.bankDetails.bankName || data.bankDetails.upiId) && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Payment Details</div>
            {data.bankDetails.bankName && <div style={{ fontSize: 12, color: "#475569" }}>Bank: {data.bankDetails.bankName}</div>}
            {data.bankDetails.accountName && <div style={{ fontSize: 12, color: "#475569" }}>A/C Name: {data.bankDetails.accountName}</div>}
            {data.bankDetails.accountNumber && <div style={{ fontSize: 12, color: "#475569" }}>A/C No: {data.bankDetails.accountNumber}</div>}
            {data.bankDetails.ifscCode && <div style={{ fontSize: 12, color: "#475569" }}>IFSC: {data.bankDetails.ifscCode}</div>}
            {data.bankDetails.upiId && <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>UPI: {data.bankDetails.upiId}</div>}
          </div>
        )}
        <div>
          {data.notes && (
            <>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Notes</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{data.notes}</div>
            </>
          )}
          {data.terms && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Terms</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{data.terms}</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#cbd5e1" }}>Generated by BillForge</div>
        <div style={{ width: 40, height: 3, backgroundColor: accent, borderRadius: 2 }} />
      </div>
    </div>
  );
}
