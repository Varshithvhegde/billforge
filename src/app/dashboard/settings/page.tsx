import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { signOut } from "@/lib/auth/actions";
import { User, LogOut, Shield } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <DashboardShell user={user}>
      <div className="max-w-lg">
        <h1 className="text-xl font-semibold tracking-tight mb-0.5" style={{ color: "#f0eeec" }}>Settings</h1>
        <p className="text-[13px] mb-8" style={{ color: "#555" }}>Manage your account</p>

        {/* Profile card */}
        <div className="rounded-xl p-5 mb-4" style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)" }}>
              <User size={16} style={{ color: "#f97316" }} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#f0eeec" }}>
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "#555" }}>{user?.email}</div>
            </div>
          </div>

          <div className="space-y-0">
            {[
              { label: "Email", value: user?.email },
              { label: "Provider", value: user?.app_metadata?.provider || "email" },
              { label: "Member since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
            ].map(({ label, value }, i, arr) => (
              <div key={label}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span className="text-[13px]" style={{ color: "#555" }}>{label}</span>
                <span className="text-[13px] capitalize" style={{ color: "#aaa" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="rounded-xl p-5" style={{ background: "#0f0f12", border: "1px solid rgba(248,113,113,0.1)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={13} style={{ color: "#f87171" }} />
            <span className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "#f87171" }}>Account</span>
          </div>
          <form action={signOut}>
            <button type="submit"
              className="flex items-center gap-2 h-8 px-4 text-sm font-medium rounded-md transition-all"
              style={{ border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", background: "rgba(248,113,113,0.05)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.05)"; }}>
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
