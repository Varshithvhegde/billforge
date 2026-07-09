"use client";
import React, { useState } from "react";
import {
  User, Users, FileText, Hash, Building2, CreditCard,
  StickyNote, Plus, Sparkles, PenLine, Percent,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useInvoiceStore } from "@/store/invoice-store";
import { SectionHeader } from "./SectionHeader";
import { Field, SelectField } from "./Field";
import { LineItemsEditor } from "./LineItemsEditor";
import { CustomFieldsEditor } from "./CustomFieldsEditor";
import { ProfilePicker } from "./ProfilePicker";
import { CustomerPicker } from "./CustomerPicker";
import { SignatureEditor } from "./SignatureEditor";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EditorPanel() {
  const { data, update } = useInvoiceStore();

  const gstRates = [
    { value: "0", label: "0% — Exempt" },
    { value: "5", label: "5%" },
    { value: "12", label: "12%" },
    { value: "18", label: "18% (Standard)" },
    { value: "28", label: "28% (Luxury)" },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="pb-8">
        {/* Document type toggle */}
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <div className="flex rounded-lg overflow-hidden border border-white/[0.08] p-0.5 gap-0.5 bg-zinc-900/50">
            {(["invoice", "proposal"] as const).map((type) => (
              <button
                key={type}
                onClick={() => update({ documentType: type })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                  data.documentType === type
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* From */}
        <SectionHeader icon={<User size={14} />} title="From (You)">
          <ProfilePicker />
          <Field label="Full Name / Business" value={data.fromName} onChange={(v) => update({ fromName: v })} placeholder="Rahul Sharma" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Email" value={data.fromEmail} onChange={(v) => update({ fromEmail: v })} placeholder="you@email.com" type="email" />
            <Field label="Phone" value={data.fromPhone} onChange={(v) => update({ fromPhone: v })} placeholder="+91 98765 43210" />
          </div>
          <Field label="Address" value={data.fromAddress} onChange={(v) => update({ fromAddress: v })} placeholder="Bengaluru, Karnataka" multiline rows={2} />
          <Field label="GSTIN (optional)" value={data.fromGSTIN} onChange={(v) => update({ fromGSTIN: v })} placeholder="29AABCT1332L1ZT" />
        </SectionHeader>

        {/* To */}
        <SectionHeader icon={<Users size={14} />} title="Bill To (Client)">
          <CustomerPicker />
          <Field label="Client Name / Business" value={data.toName} onChange={(v) => update({ toName: v })} placeholder="Acme Pvt Ltd" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Email" value={data.toEmail} onChange={(v) => update({ toEmail: v })} placeholder="accounts@acme.com" type="email" />
            <Field label="Phone" value={data.toPhone} onChange={(v) => update({ toPhone: v })} placeholder="+91 91234 56789" />
          </div>
          <Field label="Address" value={data.toAddress} onChange={(v) => update({ toAddress: v })} placeholder="Mumbai, Maharashtra" multiline rows={2} />
          <Field label="GSTIN (optional)" value={data.toGSTIN} onChange={(v) => update({ toGSTIN: v })} placeholder="27AAACR5055K1Z5" />
        </SectionHeader>

        {/* Invoice details */}
        <SectionHeader icon={<FileText size={14} />} title="Document Details">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Invoice No." value={data.invoiceNumber} onChange={(v) => update({ invoiceNumber: v })} placeholder="INV-2024-001" />
            <SelectField
              label="Currency"
              value={data.currency}
              onChange={(v) => update({ currency: v })}
              options={[
                { value: "INR", label: "INR ₹" },
                { value: "USD", label: "USD $" },
                { value: "EUR", label: "EUR €" },
                { value: "GBP", label: "GBP £" },
                { value: "AED", label: "AED د.إ" },
                { value: "SGD", label: "SGD S$" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Invoice Date" value={data.invoiceDate} onChange={(v) => update({ invoiceDate: v })} type="date" />
            <Field label="Due Date" value={data.dueDate} onChange={(v) => update({ dueDate: v })} type="date" />
          </div>
          {data.documentType === "proposal" && (
            <>
              <Field label="Valid Until" value={data.validUntil} onChange={(v) => update({ validUntil: v })} type="date" />
              <Field label="Project Title" value={data.projectTitle} onChange={(v) => update({ projectTitle: v })} placeholder="Website Redesign" />
              <Field label="Project Scope" value={data.projectScope} onChange={(v) => update({ projectScope: v })} placeholder="Describe deliverables..." multiline rows={4} />
            </>
          )}
        </SectionHeader>

        {/* Line Items */}
        <SectionHeader icon={<Hash size={14} />} title="Line Items">
          <LineItemsEditor />
        </SectionHeader>

        {/* GST */}
        <SectionHeader icon={<Building2 size={14} />} title="GST / Tax">
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="gst-toggle" className="text-xs text-zinc-400 cursor-pointer">
              Enable GST
            </Label>
            <Switch
              id="gst-toggle"
              checked={data.enableGST}
              onCheckedChange={(v) => update({ enableGST: v })}
            />
          </div>
          {data.enableGST && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              <SelectField
                label="GST Rate"
                value={data.gstRate.toString()}
                onChange={(v) => update({ gstRate: parseInt(v) })}
                options={gstRates}
              />
              <SelectField
                label="GST Type"
                value={data.gstType}
                onChange={(v) => update({ gstType: v as "CGST+SGST" | "IGST" })}
                options={[
                  { value: "CGST+SGST", label: "CGST + SGST" },
                  { value: "IGST", label: "IGST (Interstate)" },
                ]}
              />
            </div>
          )}
        </SectionHeader>

        {/* Discount */}
        <SectionHeader icon={<Percent size={14} />} title="Discount" defaultOpen={false}>
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="discount-toggle" className="text-xs text-zinc-400 cursor-pointer">
              Apply Discount
            </Label>
            <Switch
              id="discount-toggle"
              checked={data.enableDiscount}
              onCheckedChange={(v) => update({ enableDiscount: v })}
            />
          </div>
          {data.enableDiscount && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              <SelectField
                label="Type"
                value={data.discountType}
                onChange={(v) => update({ discountType: v as "percent" | "fixed" })}
                options={[
                  { value: "percent", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount" },
                ]}
              />
              <Field
                label={data.discountType === "percent" ? "Discount %" : "Amount"}
                value={data.discountValue.toString()}
                onChange={(v) => update({ discountValue: parseFloat(v) || 0 })}
                type="number"
                placeholder={data.discountType === "percent" ? "10" : "500"}
              />
            </div>
          )}
        </SectionHeader>

        {/* Custom Fields */}
        <SectionHeader icon={<Sparkles size={14} />} title="Custom Fields" defaultOpen={false}>
          <CustomFieldsEditor />
        </SectionHeader>

        {/* Bank Details */}
        <SectionHeader icon={<CreditCard size={14} />} title="Bank / UPI Details" defaultOpen={false}>
          <Field label="Bank Name" value={data.bankDetails.bankName} onChange={(v) => update({ bankDetails: { ...data.bankDetails, bankName: v } })} placeholder="HDFC Bank" />
          <Field label="Account Name" value={data.bankDetails.accountName} onChange={(v) => update({ bankDetails: { ...data.bankDetails, accountName: v } })} placeholder="Rahul Sharma" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Account No." value={data.bankDetails.accountNumber} onChange={(v) => update({ bankDetails: { ...data.bankDetails, accountNumber: v } })} placeholder="50100XXXXXXXX" />
            <Field label="IFSC Code" value={data.bankDetails.ifscCode} onChange={(v) => update({ bankDetails: { ...data.bankDetails, ifscCode: v } })} placeholder="HDFC0001234" />
          </div>
          <Field label="UPI ID" value={data.bankDetails.upiId} onChange={(v) => update({ bankDetails: { ...data.bankDetails, upiId: v } })} placeholder="rahul@paytm" />
        </SectionHeader>

        {/* Signature */}
        <SectionHeader icon={<PenLine size={14} />} title="Signature" defaultOpen={false}>
          <SignatureEditor />
        </SectionHeader>

        {/* Notes */}
        <SectionHeader icon={<StickyNote size={14} />} title="Notes & Terms" defaultOpen={false}>
          <Field label="Notes" value={data.notes} onChange={(v) => update({ notes: v })} multiline rows={3} placeholder="Thank you for your business!" />
          <Field label="Terms & Conditions" value={data.terms} onChange={(v) => update({ terms: v })} multiline rows={3} placeholder="Payment due within 15 days..." />
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] mt-1">
            <div>
              <Label htmlFor="branding-toggle" className="text-xs text-zinc-400 cursor-pointer">
                Show &ldquo;Generated by BillForge&rdquo;
              </Label>
              <p className="text-[10px] text-zinc-600 mt-0.5">Footer branding on invoice</p>
            </div>
            <Switch
              id="branding-toggle"
              checked={data.showBranding ?? true}
              onCheckedChange={(v) => update({ showBranding: v })}
            />
          </div>
        </SectionHeader>
      </div>
    </ScrollArea>
  );
}
