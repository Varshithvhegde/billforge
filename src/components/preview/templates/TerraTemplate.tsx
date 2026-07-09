import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock } from "./shared";

export function TerraTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const terracotta = "#c2410c";
  const cream = "#faf9f7";
  const warm = "#78350f";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, backgroundColor: cream, color: warm, fontFamily: "'Georgia', serif" }}>
      {/* Header block */}
      <div style={{ backgroundColor: terracotta, padding: "48px 64px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: -0.5 }}>{data.fromName || "Your Business"}</div>
            {data.fromGSTIN && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>}
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 8, lineHeight: 1.7 }}>
              {data.fromEmail && <div>{data.fromEmail}</div>}
              {data.fromPhone && <div>{data.fromPhone}</div>}
              {data.fromAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.fromAddress}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: 4, lineHeight: 1 }}>
              {isProposal ? "PROP" : "INV"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "white", marginTop: -8, textTransform: "uppercase", letterSpacing: 2 }}>
              {isProposal ? "Proposal" : "Invoice"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>#{data.invoiceNumber}</div>
          </div>
        </div>

        {/* Date bar */}
        <div style={{ display: "flex", gap: 32, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Date</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginTop: 2 }}>{formatDate(data.invoiceDate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Due Date</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginTop: 2 }}>{formatDate(data.dueDate)}</div>
          </div>
          {isProposal && (
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Valid Until</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginTop: 2 }}>{formatDate(data.validUntil)}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "40px 64px" }}>
        {/* Bill To */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: terracotta, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `2px solid ${terracotta}`, paddingBottom: 6, display: "inline-block" }}>Bill To</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: warm }}>{data.toName || "—"}</div>
          <div style={{ fontSize: 13, color: "#92400e", marginTop: 4, lineHeight: 1.7 }}>
            {data.toEmail && <div>{data.toEmail}</div>}
            {data.toPhone && <div>{data.toPhone}</div>}
            {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.toAddress}</div>}
            {data.toGSTIN && <div style={{ fontSize: 11, marginTop: 4 }}>GSTIN: {data.toGSTIN}</div>}
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 32, padding: "20px 24px", backgroundColor: "#fef3c7", borderRadius: 8, border: "1px solid #fde68a" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: terracotta, marginBottom: 8 }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
          {(data.bankDetails.bankName || data.bankDetails.upiId) && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: terracotta, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `2px solid ${terracotta}`, paddingBottom: 6, display: "inline-block" }}>Payment</div>
              {data.bankDetails.bankName && <div style={{ fontSize: 12, color: "#92400e" }}>Bank: {data.bankDetails.bankName}</div>}
              {data.bankDetails.accountName && <div style={{ fontSize: 12, color: "#92400e" }}>A/C: {data.bankDetails.accountName}</div>}
              {data.bankDetails.accountNumber && <div style={{ fontSize: 12, color: "#92400e" }}>No: {data.bankDetails.accountNumber}</div>}
              {data.bankDetails.ifscCode && <div style={{ fontSize: 12, color: "#92400e" }}>IFSC: {data.bankDetails.ifscCode}</div>}
              {data.bankDetails.upiId && <div style={{ fontSize: 12, color: terracotta, fontWeight: 600, marginTop: 4 }}>UPI: {data.bankDetails.upiId}</div>}
            </div>
          )}
          <div>
            {data.notes && <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.7, fontStyle: "italic" }}>{data.notes}</div>}
            {data.terms && <div style={{ fontSize: 11, color: "#a8a29e", lineHeight: 1.6, marginTop: 10 }}>{data.terms}</div>}
          </div>
        </div>
      </div>

      <div style={{ height: 6, backgroundColor: terracotta }} />
    </div>
  );
}
