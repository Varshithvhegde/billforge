"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { GitBranch, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn, signInWithGitHub } from "@/lib/auth/actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isGitBranchPending, startGitBranchTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  }

  async function handleGitHub() {
    setError("");
    startGitBranchTransition(async () => {
      const result = await signInWithGitHub();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0c0c0e", fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="5" fill="#f97316"/>
            <path d="M6 7h6M6 11h10M6 15h8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
          </svg>
          <span className="font-semibold text-base tracking-tight" style={{ color: "#f0eeec" }}>BillForge</span>
        </Link>

        <div className="rounded-2xl p-7"
          style={{ background: "#0f0f12", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h1 className="text-lg font-semibold mb-0.5" style={{ color: "#f0eeec" }}>Welcome back</h1>
          <p className="text-[13px] mb-6" style={{ color: "#555" }}>Sign in to your account</p>

          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg text-[13px]"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* GitHub */}
          <button onClick={handleGitHub} disabled={isGitBranchPending}
            className="w-full flex items-center justify-center gap-2.5 h-9 rounded-lg text-sm font-medium transition-all mb-4 disabled:opacity-50"
            style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.04)", color: "#aaa" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#f0eeec"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}>
            {isGitBranchPending ? <Loader2 size={14} className="animate-spin" /> : <GitBranch size={14} />}
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <span className="text-[11px]" style={{ color: "#444" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "#666" }}>Email</label>
              <input name="email" type="email" required placeholder="you@example.com"
                className="w-full h-9 px-3 rounded-lg text-sm outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#f0eeec" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(249,115,22,0.4)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }} />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "#666" }}>Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full h-9 px-3 pr-9 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#f0eeec" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(249,115,22,0.4)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#555" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#555"; }}>
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isPending}
              className="w-full h-9 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
              style={{ background: "#f97316" }}>
              {isPending && <Loader2 size={13} className="animate-spin" />}
              Sign in <ArrowRight size={13} />
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] mt-5" style={{ color: "#555" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium transition-colors" style={{ color: "#f97316" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
