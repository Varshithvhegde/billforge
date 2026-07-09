import type { InvoiceData } from "@/types/invoice";

export interface TemplateProps {
  data: InvoiceData;
  totals: {
    subtotal: number;
    discountAmount: number;
    taxableAmount: number;
    gstAmount: number;
    total: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (dateStr: string) => string;
}

export function LineItemsTable({ data, formatCurrency }: TemplateProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569", fontSize: 12 }}>#</th>
          <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569", fontSize: 12 }}>Description</th>
          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569", fontSize: 12 }}>Qty</th>
          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569", fontSize: 12 }}>Rate</th>
          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569", fontSize: 12 }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.lineItems.map((item, i) => (
          <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "#f8fafc" }}>
            <td style={{ padding: "10px 6px", borderBottom: "1px solid #f1f5f9", color: "#94a3b8", fontSize: 12 }}>{i + 1}</td>
            <td style={{ padding: "10px 6px", borderBottom: "1px solid #f1f5f9", color: "#1e293b" }}>{item.description || "—"}</td>
            <td style={{ padding: "10px 6px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#475569" }}>{item.quantity}</td>
            <td style={{ padding: "10px 6px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#475569" }}>{formatCurrency(item.rate, data.currency)}</td>
            <td style={{ padding: "10px 6px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#1e293b", fontWeight: 500 }}>{formatCurrency(item.amount, data.currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TotalsBlock({ data, totals, formatCurrency }: TemplateProps) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
      <div style={{ minWidth: 280 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#475569" }}>
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal, data.currency)}</span>
        </div>
        {data.enableDiscount && totals.discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#059669" }}>
            <span>Discount {data.discountType === "percent" ? `(${data.discountValue}%)` : ""}</span>
            <span>−{formatCurrency(totals.discountAmount, data.currency)}</span>
          </div>
        )}
        {data.enableGST && (
          <>
            {data.gstType === "CGST+SGST" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#475569" }}>
                  <span>CGST ({data.gstRate / 2}%)</span>
                  <span>{formatCurrency(totals.cgst, data.currency)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#475569" }}>
                  <span>SGST ({data.gstRate / 2}%)</span>
                  <span>{formatCurrency(totals.sgst, data.currency)}</span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#475569" }}>
                <span>IGST ({data.gstRate}%)</span>
                <span>{formatCurrency(totals.igst, data.currency)}</span>
              </div>
            )}
          </>
        )}
        {data.customFields?.map((cf) => cf.label && cf.value ? (
          <div key={cf.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#475569" }}>
            <span>{cf.label}</span><span>{cf.value}</span>
          </div>
        ) : null)}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #0f172a", marginTop: 4, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
          <span>Total</span>
          <span>{formatCurrency(totals.total, data.currency)}</span>
        </div>
        {(data.signatureName || data.signatureImage) && (
          <div style={{ marginTop: 32, paddingTop: 8, borderTop: "1px solid #e2e8f0", textAlign: "right" }}>
            {data.signatureImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.signatureImage}
                alt="Signature"
                style={{ maxHeight: 48, maxWidth: 160, objectFit: "contain", marginLeft: "auto", display: "block", marginBottom: 4 }}
              />
            )}
            {!data.signatureImage && (
              <div style={{ borderBottom: "1px solid #94a3b8", width: 120, marginLeft: "auto", marginBottom: 4 }} />
            )}
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Authorised Signatory</div>
            {data.signatureName && <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{data.signatureName}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
