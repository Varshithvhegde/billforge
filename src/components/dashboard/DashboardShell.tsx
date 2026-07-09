"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Settings, LogOut, Plus, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Documents", icon: LayoutDashboard },
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
    <div className="min-h-screen bg-[#111113] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-white/[0.06] flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">BillForge</span>
          </Link>
        </div>

        {/* New button */}
        <div className="px-3 py-3 border-b border-white/[0.06]">
          <Link
            href="/builder"
            className="flex items-center gap-2 w-full h-8 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            <Plus size={13} />
            New Document
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors",
                pathname === href
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Settings + User */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-white/[0.06] pt-3">
          {SETTINGS_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors",
                pathname === href
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}

          {/* User row */}
          <div className="flex items-center gap-2.5 px-3 pt-3 mt-2 border-t border-white/[0.06]">
            <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <User size={11} className="text-indigo-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-zinc-300 font-medium truncate">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              </div>
              <div className="text-[10px] text-zinc-600 truncate">{user?.email}</div>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
