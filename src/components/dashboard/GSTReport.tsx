"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/calculations";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GSTDocumentRow {
  id: string;
  invoiceNumber: string | null;
  invoiceDate: string;
  clientName: string;
  status: "draft" | "sent" | "paid";
  taxableAmount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  gstAmount: number;
  total: number;
}

interface Props {
  rows: GSTDocumentRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentFY(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-based
  // April (4) starts new FY
  const fyStart = month >= 4 ? year : year - 1;
  return `${fyStart}-${String(fyStart + 1).slice(-2)}`;
}

function getFYOptions(rows: GSTDocumentRow[]): string[] {
  const set = new Set<string>();
  for (const r of rows) {
    if (!r.invoiceDate) continue;
    const d = new Date(r.invoiceDate);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const start = m >= 4 ? y : y - 1;
    set.add(`${start}-${String(start + 1).slice(-2)}`);
  }
  // Always include current FY
  set.add(getCurrentFY());
  return Array.from(set).sort().reverse();
}

function fyDateRange(fy: string): { from: Date; to: Date } {
  const startYear = parseInt(fy.split("-")[0], 10);
  return {
    from: new Date(startYear, 3, 1),         // April 1
    to: new Date(startYear + 1, 2, 31, 23, 59, 59), // March 31
  };
}

function getQuarter(date: Date): number {
  const m = date.getMonth() + 1;
  if (m >= 4 && m <= 6) return 1;
  if (m >= 7 && m <= 9) return 2;
  if (m >= 10 && m <= 12) return 3;
  return 4; // Jan-Mar
}

const QUARTER_LABELS: Record<number, string> = {
  1: "Q1 (Apr-Jun)",
  2: "Q2 (Jul-Sep)",
  3: "Q3 (Oct-Dec)",
  4: "Q4 (Jan-Mar)",
};

const MONTHS = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March",
];

// Return fiscal-year-ordered month index (0 = April, 11 = March)
function fiscalMonthIndex(d: Date): number {
  const m = d.getMonth(); // 0=Jan … 11=Dec
  return m >= 3 ? m - 3 : m + 9;
}

function rowsToCSV(rows: GSTDocumentRow[]): string {
  const header = "Invoice No.,Date,Client,Taxable Value,GST Rate,CGST,SGST,IGST,Total\n";
  const lines = rows.map((r) =>
    [
      r.invoiceNumber ?? "",
      r.invoiceDate ? formatDate(r.invoiceDate) : "",
      `"${r.clientName.replace(/"/g, '""')}"`,
      r.taxableAmount.toFixed(2),
      `${r.gstRate}%`,
      r.cgst.toFixed(2),
      r.sgst.toFixed(2),
      r.igst.toFixed(2),
      r.total.toFixed(2),
    ].join(",")
  );
  return header + lines.join("\n");
}

function summaryCSV(
  rateGroups: { rate: number; count: number; taxable: number; cgst: number; sgst: number; igst: number; tax: number }[]
): string {
  const header = "GST Rate,No. of Invoices,Taxable Value,CGST,SGST,IGST,Total Tax\n";
  const lines = rateGroups.map((g) =>
    [
      `${g.rate}%`,
      g.count,
      g.taxable.toFixed(2),
      g.cgst.toFixed(2),
      g.sgst.toFixed(2),
      g.igst.toFixed(2),
      g.tax.toFixed(2),
    ].join(",")
  );
  return header + lines.join("\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({
  getText,
  label = "Copy CSV",
  className,
}: {
  getText: () => string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium transition-colors",
        copied
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06]",
        className
      )}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function DownloadButton({
  getText,
  filename,
}: {
  getText: () => string;
  filename: string;
}) {
  const handleDownload = () => {
    const blob = new Blob([getText()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
    >
      <Download size={12} />
      Download CSV
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GSTReport({ rows }: Props) {
  const fyOptions = useMemo(() => getFYOptions(rows), [rows]);
  const defaultFY = getCurrentFY();

  const [fy, setFY] = useState<string>(fyOptions.includes(defaultFY) ? defaultFY : (fyOptions[0] ?? defaultFY));
  const [quarter, setQuarter] = useState<number | "all">("all");
  const [month, setMonth] = useState<number | "all">("all"); // 0-11 fiscal index
  const [status, setStatus] = useState<"all" | "draft" | "sent" | "paid">("all");
  const [sortAsc, setSortAsc] = useState(false);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const { from, to } = fyDateRange(fy);

    return rows.filter((r) => {
      if (!r.invoiceDate) return false;
      const d = new Date(r.invoiceDate);
      if (d < from || d > to) return false;

      if (quarter !== "all" && getQuarter(d) !== quarter) return false;
      if (month !== "all" && fiscalMonthIndex(d) !== month) return false;
      if (status !== "all" && r.status !== status) return false;

      return true;
    });
  }, [rows, fy, quarter, month, status]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = new Date(a.invoiceDate).getTime();
      const db = new Date(b.invoiceDate).getTime();
      return sortAsc ? da - db : db - da;
    });
  }, [filtered, sortAsc]);

  // ── Summary cards ─────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, r) => ({
        taxable: acc.taxable + r.taxableAmount,
        cgst: acc.cgst + r.cgst,
        sgst: acc.sgst + r.sgst,
        igst: acc.igst + r.igst,
        gst: acc.gst + r.gstAmount,
        total: acc.total + r.total,
      }),
      { taxable: 0, cgst: 0, sgst: 0, igst: 0, gst: 0, total: 0 }
    );
  }, [filtered]);

  // ── Rate groups (GSTR-1 table) ────────────────────────────────────────────
  const rateGroups = useMemo(() => {
    const map = new Map<number, { count: number; taxable: number; cgst: number; sgst: number; igst: number; tax: number }>();
    for (const r of filtered) {
      const existing = map.get(r.gstRate) ?? { count: 0, taxable: 0, cgst: 0, sgst: 0, igst: 0, tax: 0 };
      map.set(r.gstRate, {
        count: existing.count + 1,
        taxable: existing.taxable + r.taxableAmount,
        cgst: existing.cgst + r.cgst,
        sgst: existing.sgst + r.sgst,
        igst: existing.igst + r.igst,
        tax: existing.tax + r.gstAmount,
      });
    }
    return Array.from(map.entries())
      .map(([rate, v]) => ({ rate, ...v }))
      .sort((a, b) => a.rate - b.rate);
  }, [filtered]);

  // ── Months available for filter ───────────────────────────────────────────
  const availableMonths = useMemo(() => {
    if (quarter === "all") return MONTHS.map((m, i) => ({ label: m, index: i }));
    // Q1=Apr-Jun(0-2), Q2=Jul-Sep(3-5), Q3=Oct-Dec(6-8), Q4=Jan-Mar(9-11)
    const qRanges: Record<number, [number, number]> = { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11] };
    const [start, end] = qRanges[quarter as number];
    return MONTHS.slice(start, end + 1).map((m, i) => ({ label: m, index: start + i }));
  }, [quarter]);

  const fmt = (n: number) => formatCurrency(n);

  const selectCls =
    "h-8 px-3 rounded-lg bg-zinc-900 border border-white/[0.06] text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer";

  return (
    <div className="space-y-6">
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={fy}
          onChange={(e) => {
            setFY(e.target.value);
            setQuarter("all");
            setMonth("all");
          }}
          className={selectCls}
        >
          {fyOptions.map((f) => (
            <option key={f} value={f}>
              FY {f}
            </option>
          ))}
        </select>

        <select
          value={quarter}
          onChange={(e) => {
            const v = e.target.value;
            setQuarter(v === "all" ? "all" : Number(v));
            setMonth("all");
          }}
          className={selectCls}
        >
          <option value="all">All Quarters</option>
          {[1, 2, 3, 4].map((q) => (
            <option key={q} value={q}>
              {QUARTER_LABELS[q]}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => {
            const v = e.target.value;
            setMonth(v === "all" ? "all" : Number(v));
          }}
          className={selectCls}
        >
          <option value="all">All Months</option>
          {availableMonths.map(({ label, index }) => (
            <option key={index} value={index}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className={selectCls}
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="sent">Sent</option>
          <option value="draft">Draft</option>
        </select>

        <span className="text-xs text-zinc-600 ml-auto">
          {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Taxable Value", value: fmt(summary.taxable), color: "indigo" },
          { label: "Total CGST", value: fmt(summary.cgst), color: "violet" },
          { label: "Total SGST", value: fmt(summary.sgst), color: "sky" },
          { label: "Total IGST", value: fmt(summary.igst), color: "amber" },
          { label: "Total GST", value: fmt(summary.gst), color: "rose" },
          { label: "Invoice Value", value: fmt(summary.total), color: "emerald" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={cn(
              "rounded-xl border p-4",
              color === "indigo" && "bg-indigo-500/10 border-indigo-500/20",
              color === "violet" && "bg-violet-500/10 border-violet-500/20",
              color === "sky" && "bg-sky-500/10 border-sky-500/20",
              color === "amber" && "bg-amber-500/10 border-amber-500/20",
              color === "rose" && "bg-rose-500/10 border-rose-500/20",
              color === "emerald" && "bg-emerald-500/10 border-emerald-500/20"
            )}
          >
            <div className="text-[11px] text-zinc-500 mb-1 font-medium">{label}</div>
            <div
              className={cn(
                "text-sm font-bold",
                color === "indigo" && "text-indigo-400",
                color === "violet" && "text-violet-400",
                color === "sky" && "text-sky-400",
                color === "amber" && "text-amber-400",
                color === "rose" && "text-rose-400",
                color === "emerald" && "text-emerald-400"
              )}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ── GSTR-1 Style Table ── */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-zinc-900/50">
          <div>
            <h2 className="text-sm font-semibold text-white">B2C Summary (Rate-wise)</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">GSTR-1 style breakup by GST rate</p>
          </div>
          <CopyButton getText={() => summaryCSV(rateGroups)} label="Copy CSV" />
        </div>

        {rateGroups.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-600">
            No GST invoices in this period
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["GST Rate", "No. of Invoices", "Taxable Value", "CGST", "SGST", "IGST", "Total Tax"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rateGroups.map((g, i) => (
                  <tr
                    key={g.rate}
                    className={cn(
                      "border-b border-white/[0.04]",
                      i % 2 === 1 && "bg-zinc-900/30"
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium text-zinc-200">{g.rate}%</td>
                    <td className="px-4 py-2.5 text-zinc-400">{g.count}</td>
                    <td className="px-4 py-2.5 text-zinc-300">{fmt(g.taxable)}</td>
                    <td className="px-4 py-2.5 text-violet-400">{g.cgst > 0 ? fmt(g.cgst) : "—"}</td>
                    <td className="px-4 py-2.5 text-sky-400">{g.sgst > 0 ? fmt(g.sgst) : "—"}</td>
                    <td className="px-4 py-2.5 text-amber-400">{g.igst > 0 ? fmt(g.igst) : "—"}</td>
                    <td className="px-4 py-2.5 text-rose-400">{fmt(g.tax)}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="border-t border-white/[0.06] bg-zinc-900/60">
                  <td className="px-4 py-2.5 font-bold text-white">Total</td>
                  <td className="px-4 py-2.5 font-bold text-white">
                    {rateGroups.reduce((s, g) => s + g.count, 0)}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-white">{fmt(summary.taxable)}</td>
                  <td className="px-4 py-2.5 font-bold text-violet-300">{summary.cgst > 0 ? fmt(summary.cgst) : "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-sky-300">{summary.sgst > 0 ? fmt(summary.sgst) : "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-amber-300">{summary.igst > 0 ? fmt(summary.igst) : "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-rose-300">{fmt(summary.gst)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Invoice detail table ── */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-zinc-900/50">
          <div>
            <h2 className="text-sm font-semibold text-white">Invoice Details</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">All GST-enabled invoices in this period</p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton getText={() => rowsToCSV(sorted)} label="Copy CSV" />
            <DownloadButton
              getText={() => rowsToCSV(sorted)}
              filename={`gst-report-fy${fy}.csv`}
            />
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-600">
            No invoices match the current filters
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">Invoice No.</th>
                  <th
                    className="px-4 py-2.5 text-left font-semibold text-zinc-500 cursor-pointer select-none hover:text-zinc-300 transition-colors"
                    onClick={() => setSortAsc((v) => !v)}
                  >
                    Date {sortAsc ? "↑" : "↓"}
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">Client</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">Taxable Value</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">Rate</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">CGST</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">SGST</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">IGST</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">Total</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors",
                      i % 2 === 1 && "bg-zinc-900/30"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/builder?id=${r.id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        {r.invoiceNumber || "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400">
                      {r.invoiceDate ? formatDate(r.invoiceDate) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-300 max-w-[140px] truncate">{r.clientName || "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-300">{fmt(r.taxableAmount)}</td>
                    <td className="px-4 py-2.5 text-zinc-400">{r.gstRate}%</td>
                    <td className="px-4 py-2.5 text-violet-400">{r.cgst > 0 ? fmt(r.cgst) : "—"}</td>
                    <td className="px-4 py-2.5 text-sky-400">{r.sgst > 0 ? fmt(r.sgst) : "—"}</td>
                    <td className="px-4 py-2.5 text-amber-400">{r.igst > 0 ? fmt(r.igst) : "—"}</td>
                    <td className="px-4 py-2.5 font-medium text-zinc-200">{fmt(r.total)}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide",
                          r.status === "paid" && "bg-emerald-500/15 text-emerald-400",
                          r.status === "sent" && "bg-sky-500/15 text-sky-400",
                          r.status === "draft" && "bg-zinc-700/50 text-zinc-500"
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
