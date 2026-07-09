import type { InvoiceData } from "@/types/invoice";

export interface TemplateProps {
  data: InvoiceData;
  totals: {
    subtotal: number;
    gstAmount: number;
    total: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (dateStr: string) => string;
}

export function LineItemsTable({ data, totals, formatCurrency }: TemplateProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>#</th>
          <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>Description</th>
          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>Qty</th>
          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>Rate</th>
          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>Amount</th>
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
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #0f172a", marginTop: 4, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
          <span>Total</span>
          <span>{formatCurrency(totals.total, data.currency)}</span>
        </div>
      </div>
    </div>
  );
}
