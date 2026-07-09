"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, Plus, User, BarChart3 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Documents", icon: LayoutDashboard },
  { href: "/dashboard/gst-report", label: "GST Report", icon: BarChart3 },
];

const SETTINGS_NAV = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface Props {
  user: SupabaseUser | null;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ background: "#0c0c0e", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Logo */}
        <div className="h-14 flex items-center px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="5" fill="#f97316"/>
              <path d="M6 7h6M6 11h10M6 15h8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-sm tracking-tight" style={{ color: "#f0eeec" }}>BillForge</span>
          </Link>
        </div>

        {/* New button */}
        <div className="px-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Link
            href="/builder"
            className="flex items-center justify-center gap-1.5 w-full h-8 rounded-md text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ background: "#f97316" }}
          >
            <Plus size={13} />
            New Document
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 h-8 rounded-md text-xs font-medium transition-all",
                )}
                style={{
                  background: active ? "rgba(249,115,22,0.1)" : "transparent",
                  color: active ? "#f97316" : "#666",
                  border: active ? "1px solid rgba(249,115,22,0.15)" : "1px solid transparent",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#f0eeec"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#666"; }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-3 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {SETTINGS_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 h-8 rounded-md text-xs font-medium transition-all"
                style={{ color: active ? "#f0eeec" : "#555" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#f0eeec"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#555"; }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}

          {/* User row */}
          <div className="flex items-center gap-2.5 px-3 pt-3 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)" }}>
              <User size={11} style={{ color: "#f97316" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate" style={{ color: "#f0eeec" }}>
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              </div>
              <div className="text-[10px] truncate" style={{ color: "#444" }}>{user?.email}</div>
            </div>
            <form action={signOut}>
              <button type="submit" title="Sign out"
                className="transition-colors"
                style={{ color: "#444" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f0eeec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#444"; }}>
                <LogOut size={13} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
