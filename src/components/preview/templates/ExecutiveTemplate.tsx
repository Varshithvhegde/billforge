import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock } from "./shared";

export function ExecutiveTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const navy = "#0f1729";
  const gold = "#d4af37";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, backgroundColor: "#fff", color: "#1e293b", fontFamily: "'Georgia', serif" }}>
      {/* Full-bleed navy header */}
      <div style={{ backgroundColor: navy, padding: "56px 64px 44px" }}>
        {/* Gold rule */}
        <div style={{ height: 1, backgroundColor: gold, opacity: 0.4, marginBottom: 32 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: 0.5, fontFamily: "'Georgia', serif" }}>
              {data.fromName || "Your Firm"}
            </div>
            {data.fromGSTIN && <div style={{ fontSize: 11, color: "rgba(212,175,55,0.7)", marginTop: 5, letterSpacing: 1 }}>GSTIN: {data.fromGSTIN}</div>}
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 12, lineHeight: 1.9, letterSpacing: 0.3 }}>
              {data.fromEmail && <div>{data.fromEmail}</div>}
              {data.fromPhone && <div>{data.fromPhone}</div>}
              {data.fromAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.fromAddress}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: gold, textTransform: "uppercase", letterSpacing: 5, fontFamily: "'Inter', sans-serif" }}>
              {isProposal ? "Business Proposal" : "Tax Invoice"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8, letterSpacing: 1 }}>No. {data.invoiceNumber}</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, fontFamily: "'Inter', sans-serif" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Issued</div>
              <div style={{ fontSize: 14, color: "white", fontWeight: 600 }}>{formatDate(data.invoiceDate)}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>Due</div>
              <div style={{ fontSize: 14, color: gold, fontWeight: 700 }}>{formatDate(data.dueDate)}</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, backgroundColor: gold, opacity: 0.4, marginTop: 32 }} />
      </div>

      <div style={{ padding: "44px 64px" }}>
        {/* Bill To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, marginBottom: 44 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>Billed To</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: navy }}>{data.toName || "—"}</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 6, lineHeight: 1.8 }}>
              {data.toEmail && <div>{data.toEmail}</div>}
              {data.toPhone && <div>{data.toPhone}</div>}
              {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 4 }}>{data.toAddress}</div>}
              {data.toGSTIN && <div style={{ fontSize: 11, marginTop: 6, color: "#64748b" }}>GSTIN: {data.toGSTIN}</div>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>Amount Due</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: navy, letterSpacing: -1 }}>
              {formatCurrency(totals.total, data.currency)}
            </div>
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 36, padding: "24px 28px", backgroundColor: "#f8f6f0", borderRadius: 4, borderLeft: `4px solid ${gold}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 10 }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 52, paddingTop: 36, borderTop: `1px solid #e2e8f0` }}>
          {(data.bankDetails.bankName || data.bankDetails.upiId) && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>Banking Details</div>
              {data.bankDetails.bankName && <div style={{ fontSize: 12, color: "#475569" }}>Bank: {data.bankDetails.bankName}</div>}
              {data.bankDetails.accountName && <div style={{ fontSize: 12, color: "#475569" }}>A/C Name: {data.bankDetails.accountName}</div>}
              {data.bankDetails.accountNumber && <div style={{ fontSize: 12, color: "#475569" }}>A/C No: {data.bankDetails.accountNumber}</div>}
              {data.bankDetails.ifscCode && <div style={{ fontSize: 12, color: "#475569" }}>IFSC: {data.bankDetails.ifscCode}</div>}
              {data.bankDetails.upiId && <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginTop: 6 }}>UPI: {data.bankDetails.upiId}</div>}
            </div>
          )}
          <div>
            {data.notes && <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, fontStyle: "italic" }}>{data.notes}</div>}
            {data.terms && <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, marginTop: 10 }}>{data.terms}</div>}
          </div>
        </div>
      </div>

      {/* Gold footer rule */}
      <div style={{ height: 3, backgroundColor: gold, margin: "0 64px 0" }} />
      <div style={{ height: 12, backgroundColor: navy }} />
    </div>
  );
}
