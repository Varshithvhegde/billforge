import Link from "next/link";
import { ArrowRight, Zap, FileText, IndianRupee, Download, Sparkles, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111113] text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Nav */}
      <nav className="border-b border-white/[0.06] h-14 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">BillForge</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500">Free · No signup needed</span>
          <Link
            href="/builder"
            className="flex items-center gap-1.5 h-8 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Open Builder <ArrowRight size={12} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
          <Sparkles size={11} />
          Made for Indian Freelancers
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Invoices &amp; Proposals<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            in under 2 minutes.
          </span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          No Word. No Canva. No Zoho. Just fill in the details, pick a template,
          and download your PDF — with GST support built in.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/builder"
            className="flex items-center gap-2 h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
          >
            Create Invoice <ArrowRight size={16} />
          </Link>
          <Link
            href="/builder"
            className="flex items-center gap-2 h-12 px-8 border border-white/[0.1] hover:border-white/20 text-zinc-300 font-semibold rounded-xl transition-all"
          >
            Create Proposal
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <IndianRupee size={20} />,
              title: "GST Ready",
              desc: "CGST + SGST or IGST — pick your rate (5%, 12%, 18%, 28%) and it calculates automatically.",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              icon: <Download size={20} />,
              title: "One-click PDF",
              desc: "Hit Download and get a pixel-perfect A4 PDF. No watermarks, no login, no nonsense.",
              color: "text-indigo-400",
              bg: "bg-indigo-500/10 border-indigo-500/20",
            },
            {
              icon: <Zap size={20} />,
              title: "4 Pro Templates",
              desc: "Minimal, Classic, Bold, and Elegant — choose what fits your brand.",
              color: "text-violet-400",
              bg: "bg-violet-500/10 border-violet-500/20",
            },
            {
              icon: <Shield size={20} />,
              title: "100% Offline",
              desc: "Your data never leaves your browser. Saved automatically in local storage.",
              color: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20",
            },
            {
              icon: <FileText size={20} />,
              title: "Invoice + Proposal",
              desc: "Switch between invoice and proposal mode. Proposals include project scope and validity.",
              color: "text-pink-400",
              bg: "bg-pink-500/10 border-pink-500/20",
            },
            {
              icon: <Sparkles size={20} />,
              title: "Bank + UPI Details",
              desc: "Add your HDFC/ICICI bank details or UPI ID directly on the invoice.",
              color: "text-cyan-400",
              bg: "bg-cyan-500/10 border-cyan-500/20",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border ${f.bg} p-6`}
            >
              <div className={`${f.color} mb-4`}>{f.icon}</div>
              <div className="font-semibold text-white mb-2">{f.title}</div>
              <div className="text-sm text-zinc-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to send your first invoice?</h2>
        <p className="text-zinc-500 text-sm mb-6">Free forever. No account required.</p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Open Builder <ArrowRight size={14} />
        </Link>
        <p className="text-xs text-zinc-700 mt-8">Built for Indian freelancers</p>
      </section>
    </div>
  );
}
