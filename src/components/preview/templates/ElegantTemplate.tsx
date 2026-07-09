import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock, BankBlock } from "./shared";

export function ElegantTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const gold = "#b45309";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, color: "#1c1917", fontFamily: "Georgia, serif" }}>
      {/* Top ornament */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${gold}, #d97706, ${gold})` }} />

      <div style={{ padding: "48px 64px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, borderBottom: `1px solid #e7e5e4`, paddingBottom: 32 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1c1917", letterSpacing: -0.5 }}>
            {data.fromName || "Your Company"}
          </div>
          {data.fromGSTIN && <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>}
          <div style={{ fontSize: 12, color: "#78716c", marginTop: 8 }}>
            {[data.fromEmail, data.fromPhone].filter(Boolean).join(" · ")}
          </div>
          <div style={{ display: "inline-block", marginTop: 16, paddingTop: 16, borderTop: `2px solid ${gold}` }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 4 }}>
              {isProposal ? "Business Proposal" : "Tax Invoice"}
            </div>
            <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 4 }}>#{data.invoiceNumber}</div>
          </div>
        </div>

        {/* From / To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Billed To</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1c1917" }}>{data.toName || "—"}</div>
            <div style={{ fontSize: 13, color: "#78716c", marginTop: 4, lineHeight: 1.7 }}>
              {data.toEmail && <div>{data.toEmail}</div>}
              {data.toPhone && <div>{data.toPhone}</div>}
              {data.toAddress && <div style={{ marginTop: 4, whiteSpace: "pre-line" }}>{data.toAddress}</div>}
              {data.toGSTIN && <div style={{ marginTop: 6, fontSize: 11 }}>GSTIN: {data.toGSTIN}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Dates</div>
            <div style={{ fontSize: 13, color: "#78716c", lineHeight: 2 }}>
              <div>Invoice Date: <strong style={{ color: "#1c1917" }}>{formatDate(data.invoiceDate)}</strong></div>
              <div>Due Date: <strong style={{ color: "#1c1917" }}>{formatDate(data.dueDate)}</strong></div>
              {isProposal && <div>Valid Until: <strong style={{ color: "#1c1917" }}>{formatDate(data.validUntil)}</strong></div>}
            </div>
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 32, padding: "24px", backgroundColor: "#fef3c7", borderRadius: 8, border: `1px solid #fde68a` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: gold, marginBottom: 10, fontFamily: "Georgia, serif" }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#78716c", lineHeight: 1.8, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
          <BankBlock data={data} accentColor={gold} />
          <div>
            {data.notes && <div style={{ fontSize: 12, color: "#78716c", lineHeight: 1.8, fontStyle: "italic" }}>{data.notes}</div>}
            {data.terms && <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 12, lineHeight: 1.6 }}>{data.terms}</div>}
          </div>
        </div>
      </div>

      <div style={{ height: 6, background: `linear-gradient(90deg, ${gold}, #d97706, ${gold})` }} />
    </div>
  );
}
