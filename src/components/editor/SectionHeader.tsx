"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SectionHeader({ icon, title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-white/[0.03] transition-colors text-left"
      >
        <span className="text-zinc-400 w-4 h-4 flex-shrink-0">{icon}</span>
        <span className="text-sm font-medium text-zinc-300 flex-1">{title}</span>
        <span className="text-zinc-600">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}
