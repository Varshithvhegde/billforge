import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const upiId = searchParams.get("upi");
  const name = searchParams.get("name") || "";
  const amount = searchParams.get("amount") || "";

  if (!upiId) {
    return NextResponse.json({ error: "upi required" }, { status: 400 });
  }

  // UPI deep link spec: upi://pay?pa=...&pn=...&am=...&cu=INR
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  const dataUrl = await QRCode.toDataURL(upiUrl, {
    width: 200,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  // Return as JSON so the PDF renderer (Puppeteer) can embed it inline
  return NextResponse.json({ qr: dataUrl });
}
