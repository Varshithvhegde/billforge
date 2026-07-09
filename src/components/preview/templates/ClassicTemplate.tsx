import React from "react";
import type { TemplateProps } from "./shared";
import { LineItemsTable, TotalsBlock, BankBlock } from "./shared";

export function ClassicTemplate({ data, totals, formatCurrency, formatDate }: TemplateProps) {
  const accent = "#1e3a5f";
  const isProposal = data.documentType === "proposal";

  return (
    <div style={{ minHeight: 1123, color: "#0f172a", fontFamily: "Inter, sans-serif" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: accent, padding: "40px 64px 32px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{data.fromName || "Your Company"}</div>
            {data.fromGSTIN && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>GSTIN: {data.fromGSTIN}</div>}
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8, lineHeight: 1.6 }}>
              {data.fromEmail && <div>{data.fromEmail}</div>}
              {data.fromPhone && <div>{data.fromPhone}</div>}
              {data.fromAddress && <div style={{ whiteSpace: "pre-line" }}>{data.fromAddress}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 900, textTransform: "uppercase", letterSpacing: 3, opacity: 0.9 }}>
              {isProposal ? "Proposal" : "Invoice"}
            </div>
            <div style={{ fontSize: 14, opacity: 0.7, marginTop: 6 }}>#{data.invoiceNumber}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{formatDate(data.invoiceDate)}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "40px 64px" }}>
        {/* Bill To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `2px solid ${accent}`, paddingBottom: 6 }}>Bill To</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{data.toName || "—"}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.6 }}>
              {data.toEmail && <div>{data.toEmail}</div>}
              {data.toPhone && <div>{data.toPhone}</div>}
              {data.toAddress && <div style={{ whiteSpace: "pre-line", marginTop: 4 }}>{data.toAddress}</div>}
              {data.toGSTIN && <div style={{ marginTop: 6, fontSize: 11 }}>GSTIN: {data.toGSTIN}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `2px solid ${accent}`, paddingBottom: 6 }}>Details</div>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                <span style={{ color: "#94a3b8", fontSize: 12 }}>Invoice Date</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(data.invoiceDate)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                <span style={{ color: "#94a3b8", fontSize: 12 }}>Due Date</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(data.dueDate)}</span>
              </div>
              {isProposal && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>Valid Until</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(data.validUntil)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isProposal && data.projectTitle && (
          <div style={{ marginBottom: 32, padding: "20px 24px", backgroundColor: "#eff6ff", borderLeft: `4px solid ${accent}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 8 }}>{data.projectTitle}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.projectScope}</div>
          </div>
        )}

        <LineItemsTable data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />
        <TotalsBlock data={data} totals={totals} formatCurrency={formatCurrency} formatDate={formatDate} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 48 }}>
          <BankBlock data={data} accentColor={accent} />
          <div>
            {data.notes && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `2px solid ${accent}`, paddingBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{data.notes}</div>
              </>
            )}
            {data.terms && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Terms & Conditions</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{data.terms}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
