"use client";
import React from "react";
import { useUpiQr } from "@/hooks/useUpiQr";

interface Props {
  upiId: string;
  name: string;
  amount: number;
  accentColor?: string;
}

export function UpiQrBlock({ upiId, name, amount, accentColor = "#6366f1" }: Props) {
  const qr = useUpiQr(upiId, name, amount);
  if (!upiId) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 16px",
      border: `1px solid ${accentColor}30`,
      borderRadius: 10,
      background: `${accentColor}08`,
      marginTop: 8,
    }}>
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="UPI QR" style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 6 }} />
      ) : (
        <div style={{ width: 72, height: 72, background: "#f1f5f9", borderRadius: 6, flexShrink: 0 }} />
      )}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          Pay via UPI
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{upiId}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
          Scan with any UPI app · {amount > 0 ? `₹${amount.toFixed(2)}` : "Any amount"}
        </div>
      </div>
    </div>
  );
}
