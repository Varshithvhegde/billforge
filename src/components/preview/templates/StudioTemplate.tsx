import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock, BankBlock } from "./shared";

export function StudioTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const purple = "#1e1b4b";
  const accent = "#818cf8";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, color: "#0f172a", fontFamily: "'Inter', sans-serif", display: "flex" }}>
      {/* Left sidebar */}
      <div style={{ width: 220, backgroundColor: purple, padding: "48px 28px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <div style={{ width: 40, height: 3, backgroundColor: accent, borderRadius: 2, marginBottom: 20 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: -0.5 }}>
            {data.fromName || "Your Studio"}
          </div>
          {data.fromGSTIN && (
            <div style={{ fontSize: 10, color: "#a5b4fc", marginTop: 6 }}>GSTIN: {data.fromGSTIN}</div>
          )}
        </div>

        <div style={{ fontSize: 11, color: "#a5b4fc", lineHeight: 1.8 }}>
          {data.fromEmail && <div>{data.fromEmail}</div>}
          {data.fromPhone && <div>{data.fromPhone}</div>}
          {data.fromAddress && <div style={{ whiteSpace: "pre-line", marginTop: 4 }}>{data.fromAddress}</div>}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Bill To</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{data.toName || "—"}</div>
          <div style={{ fontSize: 11, color: "#a5b4fc", marginTop: 4, lineHeight: 1.8 }}>
            {data.toEmail && <div>{data.toEmail}</div>}
            {data.toPhone && <div>{data.toPhone}</div>}
            {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 4 }}>{data.toAddress}</div>}
            {data.toGSTIN && <div style={{ marginTop: 6, fontSize: 10 }}>GSTIN: {data.toGSTIN}</div>}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Dates</div>
          <div style={{ fontSize: 11, color: "#a5b4fc", lineHeight: 2 }}>
            <div>Issued: <span style={{ color: "white", fontWeight: 600 }}>{formatDate(data.invoiceDate)}</span></div>
            <div>Due: <span style={{ color: "white", fontWeight: 600 }}>{formatDate(data.dueDate)}</span></div>
            {isProposal && <div>Valid: <span style={{ color: "white", fontWeight: 600 }}>{formatDate(data.validUntil)}</span></div>}
          </div>
        </div>

        {(data.bankDetails.bankName || data.bankDetails.upiId) && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, marginTop: "auto" }}>
            <BankBlock data={data} accentColor={accent} />
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: "48px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: purple, textTransform: "uppercase", letterSpacing: 3 }}>
              {isProposal ? "Proposal" : "Invoice"}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>#{data.invoiceNumber}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: purple }}>
              {formatCurrency(totals.total, data.currency)}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Amount Due</div>
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 32, padding: "20px 24px", backgroundColor: "#eef2ff", borderRadius: 10, borderLeft: `4px solid ${accent}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: purple, marginBottom: 8 }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        {(data.notes || data.terms) && (
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
            {data.notes && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, marginBottom: 12 }}>{data.notes}</div>}
            {data.terms && <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>{data.terms}</div>}
          </div>
        )}

        <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 80, height: 4, background: `linear-gradient(90deg, ${purple}, ${accent})`, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}
