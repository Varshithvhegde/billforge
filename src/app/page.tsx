import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f0eeec]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(12,12,14,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="5" fill="#f97316"/>
            <path d="M6 7h6M6 11h10M6 15h8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
          </svg>
          <span className="font-semibold text-[#f0eeec] tracking-tight text-sm">BillForge</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/auth/login" className="text-[13px] text-[#888] hover:text-[#f0eeec] transition-colors">Sign in</Link>
          <Link href="/builder"
            className="flex items-center gap-1.5 h-8 px-4 text-[13px] font-medium text-white rounded-md transition-all"
            style={{ background: "#f97316" }}>
            Start free <ArrowRight size={12} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium mb-8"
            style={{ border: "1px solid rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.08)", color: "#f97316" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
            Built for Indian freelancers
          </div>

          <h1 className="mb-6 leading-[1.05] tracking-tight" style={{ fontSize: "clamp(40px, 7vw, 72px)" }}>
            Stop invoicing<br />
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#f97316" }}>in Word.</em>
          </h1>

          <p className="text-[17px] leading-relaxed max-w-xl mx-auto mb-10" style={{ color: "#888" }}>
            Create GST-ready invoices and proposals in under two minutes.
            Pick a template, fill the details, download a real PDF — done.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/builder"
              className="flex items-center gap-2 h-11 px-7 text-[14px] font-semibold text-white rounded-lg transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: "#f97316", boxShadow: "0 0 32px rgba(249,115,22,0.35)" }}>
              Create your first invoice <ArrowRight size={14} />
            </Link>
            <Link href="/auth/signup"
              className="flex items-center gap-2 h-11 px-7 text-[14px] font-medium rounded-lg transition-all hover:border-white/20"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#aaa" }}>
              Sign up free
            </Link>
          </div>

          <p className="mt-5 text-[12px]" style={{ color: "#444" }}>No credit card. No Zoho. No Canva.</p>
        </div>

        {/* ── Floating invoice mockup ── */}
        <div className="relative max-w-2xl mx-auto mt-20">
          {/* Glow under card */}
          <div className="absolute inset-x-8 bottom-0 h-20 blur-3xl opacity-30 pointer-events-none"
            style={{ background: "#f97316" }} />

          <div className="relative rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#131316", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>

            {/* App chrome bar */}
            <div className="flex items-center justify-between px-4 h-10"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0e0e11" }}>
              <div className="flex items-center gap-1.5">
                {["#ff5f57","#ffbd2e","#28c840"].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#555" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v4l2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/></svg>
                INV-2026-047
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 px-2 rounded text-[10px] font-medium flex items-center" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                  Auto-saved
                </div>
                <div className="h-5 px-2 rounded text-[10px] font-semibold flex items-center text-white" style={{ background: "#f97316" }}>
                  ↓ PDF
                </div>
              </div>
            </div>

            {/* Three-panel layout preview */}
            <div className="flex" style={{ height: 340 }}>
              {/* Left editor */}
              <div className="w-56 flex-shrink-0 p-3 space-y-3" style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  { label: "From", lines: [60, 40] },
                  { label: "Bill To", lines: [70, 50, 35] },
                  { label: "Line Items", lines: [100, 80, 90] },
                ].map(({ label, lines }) => (
                  <div key={label}>
                    <div className="text-[9px] font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#444" }}>{label}</div>
                    <div className="space-y-1.5">
                      {lines.map((w, i) => (
                        <div key={i} className="h-5 rounded" style={{ width: `${w}%`, background: "rgba(255,255,255,0.06)" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Center A4 preview */}
              <div className="flex-1 flex items-center justify-center p-4" style={{ background: "#0a0a0c" }}>
                <div className="w-full max-w-[200px] rounded-lg bg-white" style={{ aspectRatio: "1/1.414", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", padding: "14px" }}>
                  {/* Mock invoice content */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ width: 56, height: 5, background: "#111", borderRadius: 2, marginBottom: 3 }} />
                      <div style={{ width: 36, height: 3, background: "#ddd", borderRadius: 2 }} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ width: 30, height: 5, background: "#f97316", borderRadius: 2, marginBottom: 3, marginLeft: "auto" }} />
                      <div style={{ width: 22, height: 3, background: "#eee", borderRadius: 2, marginLeft: "auto" }} />
                    </div>
                  </div>
                  <div style={{ height: 1, background: "#f0f0f0", marginBottom: 8 }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {[0,1].map(i => <div key={i} style={{ height: 28, background: "#f8f8f8", borderRadius: 3 }} />)}
                  </div>
                  {[100,80,90,70].map((w,i) => (
                    <div key={i} style={{ height: 4, background: i===3?"#f97316":"#f0f0f0", borderRadius: 2, marginBottom: 4, width: `${w}%` }} />
                  ))}
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: 60, height: 18, background: "#111", borderRadius: 3 }} />
                  </div>
                </div>
              </div>

              {/* Right template picker */}
              <div className="w-32 flex-shrink-0 p-3 space-y-2" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#444" }}>Templates</div>
                {[
                  { name: "Minimal", accent: "#6366f1", active: true },
                  { name: "Executive", accent: "#d4af37" },
                  { name: "Neon", accent: "#06b6d4" },
                  { name: "Terra", accent: "#c2410c" },
                ].map(({ name, accent, active }) => (
                  <div key={name} className="rounded-lg overflow-hidden"
                    style={{ border: active ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.06)", background: active ? `${accent}10` : "rgba(255,255,255,0.03)" }}>
                    <div style={{ height: 28, background: active ? `${accent}20` : "rgba(255,255,255,0.04)", borderRadius: "4px 4px 0 0" }} />
                    <div className="px-2 py-1">
                      <div className="text-[9px] font-medium" style={{ color: active ? "#f0eeec" : "#555" }}>{name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            "10 professional templates",
            "GST-ready (CGST · SGST · IGST)",
            "UPI QR on every invoice",
            "Share via WhatsApp link",
            "GSTR-1 export",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "#666" }}>
              <Check size={13} style={{ color: "#f97316", flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#f97316" }}>Everything you need</p>
          <h2 className="text-[32px] font-semibold tracking-tight" style={{ color: "#f0eeec" }}>
            Built for how Indian freelancers<br />actually work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden" }}>
          {[
            {
              title: "GST done right",
              desc: "CGST + SGST for intra-state. IGST for inter-state. Pick 5%, 12%, 18%, or 28% — breakdowns calculated automatically and printed on the invoice.",
              tag: "Compliance",
              color: "#4ade80",
            },
            {
              title: "Real PDFs, not screenshots",
              desc: "Puppeteer-rendered PDFs via headless Chrome. Selectable text, crisp at any zoom, correct A4 dimensions — ready to attach to any email.",
              tag: "Export",
              color: "#60a5fa",
            },
            {
              title: "UPI QR on every invoice",
              desc: "Your UPI ID becomes a scannable QR code embedded right on the invoice. Clients pay in seconds with GPay, PhonePe, or Paytm.",
              tag: "Payments",
              color: "#f97316",
            },
            {
              title: "Share links + WhatsApp",
              desc: "Generate a public view link. Share it over WhatsApp in one tap. Clients open it in any browser — no app download, no account needed.",
              tag: "Sharing",
              color: "#a78bfa",
            },
            {
              title: "Customer management",
              desc: "Save client profiles. Search them. Load in one click. Your details and their details prefilled every time — no retyping.",
              tag: "Workflow",
              color: "#f472b6",
            },
            {
              title: "GSTR-1 report",
              desc: "Filter by financial year, quarter, or month. Get a rate-wise GST breakdown table you can copy directly into the government portal.",
              tag: "Tax",
              color: "#34d399",
            },
          ].map(({ title, desc, tag, color }) => (
            <div key={title} className="p-7 group" style={{ background: "#0f0f12" }}>
              <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest mb-4"
                style={{ background: `${color}15`, color }}>
                {tag}
              </div>
              <h3 className="text-[16px] font-semibold mb-2" style={{ color: "#f0eeec" }}>{title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#666" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Templates showcase ── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#f97316" }}>10 templates</p>
          <h2 className="text-[32px] font-semibold tracking-tight" style={{ color: "#f0eeec" }}>
            Your invoice, your identity
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: "#666" }}>From minimal to executive. Switch templates in one click.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: "Minimal", accent: "#6366f1", topBg: "#6366f1", topH: 28 },
            { name: "Executive", accent: "#d4af37", topBg: "#0f1729", topH: 32 },
            { name: "Neon", accent: "#06b6d4", topBg: "#09090b", topH: 24, dark: true },
            { name: "Studio", accent: "#818cf8", topBg: "#1e1b4b", topH: 36, sidebar: true },
            { name: "Terra", accent: "#c2410c", topBg: "#c2410c", topH: 30 },
            { name: "Arctic", accent: "#0ea5e9", topBg: "white", topH: 4, border: true },
            { name: "Classic", accent: "#1e3a5f", topBg: "#1e3a5f", topH: 30 },
            { name: "Bold", accent: "#6366f1", topBg: "#0f172a", topH: 32, gradient: true },
            { name: "Elegant", accent: "#b45309", topBg: "white", topH: 4, border: true, goldBar: true },
            { name: "Slate", accent: "#475569", topBg: "white", topH: 2, border: true },
          ].map(({ name, accent, topBg, topH, dark, sidebar, gradient, goldBar, border }) => (
            <div key={name} className="rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#131316", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              {/* Mini preview */}
              <div style={{ height: 90, background: dark ? "#09090b" : "white", position: "relative" }}>
                {sidebar ? (
                  <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ width: 24, background: topBg, height: "100%" }} />
                    <div style={{ flex: 1, padding: 6 }}>
                      <div style={{ height: topH / 2, background: `${accent}30`, borderRadius: 2, marginBottom: 4 }} />
                      {[80,60,70].map((w,i) => <div key={i} style={{ height: 3, background: "#f0f0f0", borderRadius: 1, marginBottom: 3, width: `${w}%` }} />)}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 8 }}>
                    {goldBar ? (
                      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, #d97706, ${accent})`, marginBottom: 6, borderRadius: 1 }} />
                    ) : null}
                    <div style={{ height: topH, background: topBg, borderRadius: border ? 0 : 3, marginBottom: 6, borderTop: border ? `3px solid ${accent}` : undefined }} />
                    {[90,70,80].map((w,i) => (
                      <div key={i} style={{ height: 3, background: dark ? "rgba(255,255,255,0.1)" : "#f0f0f0", borderRadius: 1, marginBottom: 3, width: `${w}%` }} />
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                      <div style={{ width: 36, height: 5, background: gradient ? "linear-gradient(90deg,#6366f1,#ec4899)" : accent, borderRadius: 2 }} />
                    </div>
                  </div>
                )}
              </div>
              {/* Label */}
              <div className="px-3 py-2">
                <div className="text-[11px] font-semibold" style={{ color: "#f0eeec" }}>{name}</div>
                <div className="w-8 h-0.5 mt-1 rounded" style={{ background: accent }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof / numbers ── */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <div className="rounded-2xl p-10 text-center"
          style={{ border: "1px solid rgba(249,115,22,0.15)", background: "rgba(249,115,22,0.04)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "#f97316" }}>What you get</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: "10", label: "Templates" },
              { n: "2 min", label: "To your first invoice" },
              { n: "₹0", label: "Forever free" },
              { n: "100%", label: "Stays in your browser" },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-[32px] font-bold tracking-tight mb-1" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#f0eeec" }}>{n}</div>
                <div className="text-[13px]" style={{ color: "#555" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-2xl mx-auto px-6 pb-32 text-center">
        <h2 className="text-[40px] font-semibold tracking-tight leading-tight mb-4">
          Your next invoice,{" "}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#f97316" }}>done right.</em>
        </h2>
        <p className="text-[16px] mb-8" style={{ color: "#666" }}>
          Free. No watermarks. No Zoho subscription.
        </p>
        <Link href="/builder"
          className="inline-flex items-center gap-2 h-12 px-8 text-[15px] font-semibold text-white rounded-xl transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: "#f97316", boxShadow: "0 0 40px rgba(249,115,22,0.3)" }}>
          Create invoice — it&apos;s free <ArrowRight size={15} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-5xl mx-auto px-6 pb-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 32 }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="5" fill="#f97316"/>
              <path d="M6 7h6M6 11h10M6 15h8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <span className="text-[13px] font-semibold" style={{ color: "#f0eeec" }}>BillForge</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-[12px] transition-colors hover:text-[#f0eeec]" style={{ color: "#555" }}>Sign in</Link>
            <Link href="/builder" className="text-[12px] transition-colors hover:text-[#f0eeec]" style={{ color: "#555" }}>Builder</Link>
            <Link href="/dashboard/gst-report" className="text-[12px] transition-colors hover:text-[#f0eeec]" style={{ color: "#555" }}>GST Report</Link>
          </div>
          <p className="text-[11px]" style={{ color: "#333" }}>Built for Indian freelancers</p>
        </div>
      </footer>

    </div>
  );
}
