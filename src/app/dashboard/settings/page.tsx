import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { signOut } from "@/lib/auth/actions";
import { User, LogOut } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <DashboardShell user={user}>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-zinc-500 mb-8">Manage your account</p>

        {/* Profile */}
        <div className="bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
              <User size={16} className="text-indigo-300" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </div>
              <div className="text-xs text-zinc-500">{user?.email}</div>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
              <span className="text-sm text-zinc-400">Email</span>
              <span className="text-sm text-zinc-200">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
              <span className="text-sm text-zinc-400">Provider</span>
              <span className="text-sm text-zinc-200 capitalize">
                {user?.app_metadata?.provider || "email"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-sm text-zinc-400">Account created</span>
              <span className="text-sm text-zinc-200">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-zinc-900/50 border border-red-500/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-400 mb-4">Account</h2>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 h-9 px-4 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-sm font-medium rounded-lg transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
