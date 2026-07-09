"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export function Field({ label, value, onChange, placeholder, type = "text", multiline, rows = 3, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-zinc-500 font-medium">{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-sm placeholder:text-zinc-600 focus:border-indigo-500/50 resize-none"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-zinc-900 border-white/[0.08] text-zinc-200 text-sm h-8 placeholder:text-zinc-600 focus:border-indigo-500/50"
        />
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-zinc-500 font-medium">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-2 rounded-md bg-zinc-900 border border-white/[0.08] text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
