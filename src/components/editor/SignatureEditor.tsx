"use client";
import React, { useRef } from "react";
import { Upload, X, PenLine } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import { Field } from "./Field";

export function SignatureEditor() {
  const { data, update } = useInvoiceStore();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 500 * 1024) {
      alert("Image must be under 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ signatureImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <Field
        label="Signatory Name"
        value={data.signatureName}
        onChange={(v) => update({ signatureName: v })}
        placeholder="Rahul Sharma"
      />

      <div className="space-y-1.5">
        <label className="text-xs text-zinc-500 font-medium">Signature Image (optional)</label>

        {data.signatureImage ? (
          <div className="relative group">
            <div className="rounded-lg border border-white/[0.08] bg-white p-2 flex items-center justify-center" style={{ minHeight: 72 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.signatureImage}
                alt="Signature"
                className="max-h-16 object-contain"
              />
            </div>
            <button
              onClick={() => update({ signatureImage: undefined })}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-zinc-800 border border-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={10} />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Replace image
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 h-16 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/40 transition-all text-zinc-500 hover:text-zinc-300"
          >
            <Upload size={14} />
            <span className="text-[11px]">Upload signature (PNG/JPG, max 500KB)</span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/svg+xml"
          onChange={handleFile}
          className="hidden"
        />
        <p className="text-[10px] text-zinc-600 leading-snug">
          Use a transparent PNG for best results. Printed below the signatory name.
        </p>
      </div>
    </div>
  );
}
