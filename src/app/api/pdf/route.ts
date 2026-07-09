import { NextRequest, NextResponse } from "next/server";
import type { InvoiceData, TemplateId } from "@/types/invoice";
import { buildInvoiceHtml } from "@/lib/invoice-html";

export async function POST(req: NextRequest) {
  const { data, templateId }: { data: InvoiceData; templateId: TemplateId } = await req.json();

  const html = buildInvoiceHtml(data, templateId);

  // Puppeteer is a Node.js-only module — dynamic import keeps it out of the
  // edge runtime and avoids bundling it into the client.
  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "load" });
    // Extra wait for web fonts to finish rendering
    await new Promise((r) => setTimeout(r, 800));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const pdfBuffer = Buffer.from(pdf);

    return new NextResponse(pdfBuffer, {
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
