"use client";
import React, { useState } from "react";
import { User, ChevronDown, Plus, Trash2, Check, Star } from "lucide-react";
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

export function ProfilePicker() {
  const { data, savedProfiles, saveProfile, loadProfile, deleteProfile } = useInvoiceStore();
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", gstin: "", isDefault: false });

  function handleSave() {
    if (!form.name) return;
    saveProfile(form);
    setSaveOpen(false);
    setForm({ name: "", email: "", phone: "", address: "", gstin: "", isDefault: false });
  }

  function prefillFromCurrent() {
    setForm({
      name: data.fromName,
      email: data.fromEmail,
      phone: data.fromPhone,
      address: data.fromAddress,
      gstin: data.fromGSTIN,
      isDefault: false,
    });
    setSaveOpen(true);
  }

  return (
    <>
      <div className="flex gap-1.5 mb-1">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <button className="flex-1 flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs text-zinc-400 transition-colors">
              <User size={11} />
              <span className="flex-1 text-left truncate">
                {savedProfiles.length === 0 ? "No saved profiles" : "Load profile..."}
              </span>
              <ChevronDown size={11} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-900 border-white/[0.1]" align="start">
            {savedProfiles.length === 0 ? (
              <div className="px-3 py-2 text-xs text-zinc-600">No profiles saved yet</div>
            ) : (
              savedProfiles.map((p) => (
                <div key={p.id} className="flex items-center gap-1">
                  <DropdownMenuItem
                    onClick={() => { loadProfile(p.id); setOpen(false); }}
                    className="flex-1 text-xs text-zinc-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {p.isDefault && <Star size={10} className="text-amber-400 flex-shrink-0" />}
                      <span className="truncate">{p.name}</span>
                    </div>
                  </DropdownMenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProfile(p.id); }}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem onClick={prefillFromCurrent} className="text-xs text-indigo-400 cursor-pointer">
              <Plus size={11} className="mr-1.5" /> Save current as profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="bg-zinc-900 border-white/[0.1] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Save Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {[
              { label: "Name", key: "name", placeholder: "Rahul Sharma" },
              { label: "Email", key: "email", placeholder: "rahul@example.com" },
              { label: "Phone", key: "phone", placeholder: "+91 98765 43210" },
              { label: "Address", key: "address", placeholder: "Bengaluru, Karnataka" },
              { label: "GSTIN", key: "gstin", placeholder: "29AABCT1332L1ZT" },
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
            <div className="flex items-center justify-between">
              <Label htmlFor="default-profile" className="text-xs text-zinc-400">Set as default</Label>
              <Switch
                id="default-profile"
                checked={form.isDefault}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isDefault: v }))}
              />
            </div>
            <Button onClick={handleSave} className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-500">
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
