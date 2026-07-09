"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { FileText, GitBranch, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { signUp, signInWithGitHub } from "@/lib/auth/actions";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isGitBranchPending, startGitBranchTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) setError(result.error);
      else if (result?.success) setSuccess(result.success);
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
    <div className="min-h-screen bg-[#111113] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">BillForge</span>
        </div>

        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-zinc-500 mb-6">Free forever · No credit card needed</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" />
              {success}
            </div>
          )}

          <button
            onClick={handleGitHub}
            disabled={isGitBranchPending}
            className="w-full flex items-center justify-center gap-2.5 h-10 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-sm text-zinc-200 font-medium transition-colors mb-4 disabled:opacity-50"
          >
            {isGitBranchPending ? <Loader2 size={15} className="animate-spin" /> : <GitBranch size={15} />}
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 font-medium mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-lg bg-zinc-800/80 border border-white/[0.08] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-zinc-800/80 border border-white/[0.08] text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending || !!success}
              className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-600 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
