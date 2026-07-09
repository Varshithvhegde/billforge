import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BillForge — Invoices & Proposals for Indian Freelancers",
  description: "Create professional GST-ready invoices and proposals in minutes. Free, no signup, download as PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#111113] text-white">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
