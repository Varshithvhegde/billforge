import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock, BankBlock } from "./shared";

export function SlateTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, color: "#1e293b", fontFamily: "'Inter', sans-serif", padding: "56px 64px", backgroundColor: "#fff" }}>
      {/* Top rule */}
      <div style={{ height: 2, backgroundColor: "#475569", marginBottom: 48 }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>{data.fromName || "Your Company"}</div>
          {data.fromGSTIN && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>}
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.7 }}>
            {data.fromEmail && <div>{data.fromEmail}</div>}
            {data.fromPhone && <div>{data.fromPhone}</div>}
            {data.fromAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.fromAddress}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: 3 }}>{isProposal ? "Proposal" : "Invoice"}</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: -1, marginTop: 4 }}>#{data.invoiceNumber}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12, alignItems: "flex-end" }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>Date: <strong style={{ color: "#1e293b" }}>{formatDate(data.invoiceDate)}</strong></div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Due: <strong style={{ color: "#1e293b" }}>{formatDate(data.dueDate)}</strong></div>
            {isProposal && <div style={{ fontSize: 12, color: "#64748b" }}>Valid: <strong style={{ color: "#1e293b" }}>{formatDate(data.validUntil)}</strong></div>}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "20px 24px", marginBottom: 36 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Bill To</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{data.toName || "—"}</div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.7 }}>
          {data.toEmail && <div>{data.toEmail}</div>}
          {data.toPhone && <div>{data.toPhone}</div>}
          {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{data.toAddress}</div>}
          {data.toGSTIN && <div style={{ fontSize: 11, marginTop: 6 }}>GSTIN: {data.toGSTIN}</div>}
        </div>
      </div>

      {isProposal && data.projectTitle && (
        <div style={{ marginBottom: 32, padding: "20px 24px", border: "1px solid #e2e8f0", borderRadius: 8, borderLeft: "4px solid #475569" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{data.projectTitle}</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
        </div>
      )}

      <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
      <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
        <BankBlock data={data} accentColor="#475569" />
        <div>
          {data.notes && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, marginBottom: 10 }}>{data.notes}</div>}
          {data.terms && <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>{data.terms}</div>}
        </div>
      </div>

      <div style={{ height: 2, backgroundColor: "#e2e8f0", marginTop: 48 }} />
    </div>
  );
}
