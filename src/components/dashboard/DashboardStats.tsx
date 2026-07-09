"use client";
import React from "react";
import { FileText, Send, Lightbulb, IndianRupee } from "lucide-react";

interface Props {
  stats: {
    total: number;
    invoices: number;
    proposals: number;
    paid: number;
    totalValue: number;
  };
}

export function DashboardStats({ stats }: Props) {
  if (stats.total === 0) return null;

  const items = [
    {
      label: "Total Documents",
      value: stats.total,
      icon: FileText,
      accent: "#a78bfa",
    },
    {
      label: "Invoices",
      value: stats.invoices,
      icon: Send,
      accent: "#60a5fa",
    },
    {
      label: "Proposals",
      value: stats.proposals,
      icon: Lightbulb,
      accent: "#f97316",
    },
    {
      label: "Total Collected",
      value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.totalValue),
      icon: IndianRupee,
      accent: "#4ade80",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {items.map(({ label, value, icon: Icon, accent }) => (
        <div key={label} className="rounded-xl p-4"
          style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "#555" }}>{label}</span>
            <div className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: `${accent}15` }}>
              <Icon size={13} style={{ color: accent }} />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: "#f0eeec", fontFamily: "'Instrument Serif', serif" }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
