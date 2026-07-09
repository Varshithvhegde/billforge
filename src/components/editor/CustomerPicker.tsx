"use client";
import React, { useState } from "react";
import { Users, ChevronDown, Plus, Trash2, Edit2, Search } from "lucide-react";
import { useInvoiceStore } from "@/store/invoice-store";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { Button } from "@/components/ui/button";

export function CustomerPicker() {
  const { data, savedCustomers, saveCustomer, loadCustomer, deleteCustomer, updateCustomer } = useInvoiceStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saveOpen, setSaveOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", gstin: "" });

  const filtered = savedCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave() {
    if (!form.name) return;
    if (editId) {
      updateCustomer(editId, form);
      setEditId(null);
    } else {
      saveCustomer(form);
    }
    setSaveOpen(false);
    setForm({ name: "", email: "", phone: "", address: "", gstin: "" });
  }

  function openEdit(id: string) {
    const c = savedCustomers.find((c) => c.id === id);
    if (!c) return;
    setEditId(id);
    setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, gstin: c.gstin });
    setSaveOpen(true);
    setOpen(false);
  }

  function prefillFromCurrent() {
    setEditId(null);
    setForm({ name: data.toName, email: data.toEmail, phone: data.toPhone, address: data.toAddress, gstin: data.toGSTIN });
    setSaveOpen(true);
  }

  return (
    <>
      <div className="flex gap-1.5 mb-1">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <button className="flex-1 flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs text-zinc-400 transition-colors">
              <Users size={11} />
              <span className="flex-1 text-left truncate">
                {savedCustomers.length === 0 ? "No saved customers" : "Load customer..."}
              </span>
              <ChevronDown size={11} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-zinc-900 border-white/[0.1] p-1" align="start">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1 border-b border-white/[0.06]">
              <Search size={11} className="text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="flex-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-xs text-zinc-600">
                  {savedCustomers.length === 0 ? "No customers saved yet" : "No results"}
                </div>
              ) : (
                filtered.map((c) => (
                  <div key={c.id} className="flex items-center gap-1 rounded-md hover:bg-white/[0.04] group">
                    <button
                      onClick={() => { loadCustomer(c.id); setOpen(false); }}
                      className="flex-1 text-left px-2 py-1.5 min-w-0"
                    >
                      <div className="text-xs font-medium text-zinc-300 truncate">{c.name}</div>
                      <div className="text-[10px] text-zinc-600 truncate">{c.email}</div>
                    </button>
                    <button onClick={() => openEdit(c.id)} className="p-1.5 text-zinc-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Edit2 size={11} />
                    </button>
                    <button onClick={() => deleteCustomer(c.id)} className="p-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-white/[0.06] mt-1 pt-1">
              <button
                onClick={prefillFromCurrent}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-indigo-400 hover:bg-white/[0.04] rounded-md transition-colors"
              >
                <Plus size={11} /> Save current as customer
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={saveOpen} onOpenChange={(v) => { setSaveOpen(v); if (!v) setEditId(null); }}>
        <DialogContent className="bg-zinc-900 border-white/[0.1] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">{editId ? "Edit Customer" : "Save Customer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {[
              { label: "Name", key: "name", placeholder: "Acme Pvt Ltd" },
              { label: "Email", key: "email", placeholder: "accounts@acme.com" },
              { label: "Phone", key: "phone", placeholder: "+91 91234 56789" },
              { label: "Address", key: "address", placeholder: "Mumbai, Maharashtra" },
              { label: "GSTIN", key: "gstin", placeholder: "27AAACR5055K1Z5" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <Label className="text-xs text-zinc-400">{label}</Label>
                <Input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="mt-1 h-8 text-xs bg-zinc-800 border-white/[0.08] text-zinc-200"
                />
              </div>
            ))}
            <Button onClick={handleSave} className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-500">
              {editId ? "Update Customer" : "Save Customer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
