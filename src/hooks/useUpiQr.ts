"use client";
import { useState, useEffect } from "react";

const cache = new Map<string, string>();

export function useUpiQr(upiId: string, name: string, amount: number) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!upiId) { setQrDataUrl(null); return; }
    const key = `${upiId}|${name}|${amount}`;
    if (cache.has(key)) { setQrDataUrl(cache.get(key)!); return; }

    const params = new URLSearchParams({
      upi: upiId,
      name,
      amount: amount > 0 ? amount.toFixed(2) : "",
    });
    fetch(`/api/qr?${params}`)
      .then((r) => r.json())
      .then(({ qr }) => {
        if (qr) { cache.set(key, qr); setQrDataUrl(qr); }
      })
      .catch(() => null);
  }, [upiId, name, amount]);

  return qrDataUrl;
}
