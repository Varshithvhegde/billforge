import { NextRequest, NextResponse } from "next/server";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { buildInvoiceHtml } from "@/lib/invoice-html";
import QRCode from "qrcode";

async function generateUpiQrDataUrl(upiId: string, name: string): Promise<string> {
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&cu=INR`;
  return QRCode.toDataURL(upiUrl, {
    width: 200,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}

export async function POST(req: NextRequest) {
  const { data, templateId }: { data: InvoiceData; templateId: TemplateId } = await req.json();

  // Pre-generate QR server-side so Puppeteer can embed it inline
  let qrDataUrl: string | undefined;
  if (data.bankDetails?.upiId) {
    qrDataUrl = await generateUpiQrDataUrl(data.bankDetails.upiId, data.fromName || "");
  }

  const html = buildInvoiceHtml(data, templateId, qrDataUrl);

  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 800));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.documentType}-${data.invoiceNumber || "001"}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}
