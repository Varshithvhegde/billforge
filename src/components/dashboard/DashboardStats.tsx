"use client";
import React from "react";
import { FileText, Send, CheckCircle, IndianRupee } from "lucide-react";

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
    { label: "Total Documents", value: stats.total, icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "Invoices", value: stats.invoices, icon: Send, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { label: "Proposals", value: stats.proposals, icon: FileText, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
    {
      label: "Total Collected",
      value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.totalValue),
      icon: IndianRupee,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl border ${item.bg} p-4`}>
          <div className={`${item.color} mb-2`}>
            <item.icon size={16} />
          </div>
          <div className="text-xl font-bold text-white">{item.value}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
