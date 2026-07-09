"use client";
import React, { useState } from "react";
import { ChevronDown, Plus, Trash2, Star, CreditCard } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function BankPicker() {
  const { data, savedBankAccounts, saveBankAccount, loadBankAccount, deleteBankAccount } = useInvoiceStore();
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [form, setForm] = useState({
    label: "", bankName: "", accountName: "", accountNumber: "", ifscCode: "", upiId: "", isDefault: false,
  });

  function handleSave() {
    if (!form.label) return;
    saveBankAccount(form);
    setSaveOpen(false);
    setForm({ label: "", bankName: "", accountName: "", accountNumber: "", ifscCode: "", upiId: "", isDefault: false });
  }

  function prefillFromCurrent() {
    setForm({
      label: data.bankDetails.bankName || data.bankDetails.upiId || "My Account",
      bankName: data.bankDetails.bankName,
      accountName: data.bankDetails.accountName,
      accountNumber: data.bankDetails.accountNumber,
      ifscCode: data.bankDetails.ifscCode,
      upiId: data.bankDetails.upiId,
      isDefault: false,
    });
    setSaveOpen(true);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex-1 flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs text-zinc-400 transition-colors mb-1 w-full">
          <CreditCard size={11} />
          <span className="flex-1 text-left truncate">
            {savedBankAccounts.length === 0 ? "No saved accounts" : "Load saved account..."}
          </span>
          <ChevronDown size={11} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 bg-zinc-900 border-white/[0.1]" align="start">
          {savedBankAccounts.length === 0 ? (
            <div className="px-3 py-2 text-xs text-zinc-600">No accounts saved yet</div>
          ) : (
            savedBankAccounts.map((a) => (
              <div key={a.id} className="flex items-center gap-1 group">
                <DropdownMenuItem
                  onClick={() => { loadBankAccount(a.id); setOpen(false); }}
                  className="flex-1 text-xs text-zinc-300 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {a.isDefault && <Star size={9} className="text-amber-400 flex-shrink-0" />}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{a.label}</div>
                      <div className="text-[10px] text-zinc-600 truncate">
                        {a.upiId || a.bankName || a.accountNumber}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteBankAccount(a.id); }}
                  className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
          <DropdownMenuSeparator className="bg-white/[0.06]" />
          <DropdownMenuItem onClick={prefillFromCurrent} className="text-xs text-indigo-400 cursor-pointer">
            <Plus size={11} className="mr-1.5" /> Save current details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="bg-zinc-900 border-white/[0.1] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Save Bank Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label className="text-xs text-zinc-400">Account Label <span className="text-zinc-600">(e.g. "HDFC Savings")</span></Label>
              <Input
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="HDFC Savings"
                className="mt-1 h-8 text-xs bg-zinc-800 border-white/[0.08] text-zinc-200"
              />
            </div>
            {[
              { label: "Bank Name", key: "bankName", placeholder: "HDFC Bank" },
              { label: "Account Name", key: "accountName", placeholder: "Rahul Sharma" },
              { label: "Account Number", key: "accountNumber", placeholder: "50100XXXXXXXX" },
              { label: "IFSC Code", key: "ifscCode", placeholder: "HDFC0001234" },
              { label: "UPI ID", key: "upiId", placeholder: "rahul@paytm" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <Label className="text-xs text-zinc-400">{label}</Label>
                <Input
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="mt-1 h-8 text-xs bg-zinc-800 border-white/[0.08] text-zinc-200"
                />
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <Label htmlFor="bank-default" className="text-xs text-zinc-400 cursor-pointer">Set as default</Label>
              <Switch
                id="bank-default"
                checked={form.isDefault}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isDefault: v }))}
              />
            </div>
            <Button onClick={handleSave} className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-500">
              Save Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
