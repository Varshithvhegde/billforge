import type { Template } from "@/types/invoice";

export const TEMPLATES: Template[] = [
  { id: "minimal", name: "Minimal", description: "Clean white, indigo accents", accentColor: "#6366f1", preview: "minimal" },
  { id: "classic", name: "Classic", description: "Navy header, traditional layout", accentColor: "#1e3a5f", preview: "classic" },
  { id: "bold", name: "Bold", description: "Dark header + gradient stripe", accentColor: "#0f172a", preview: "bold" },
  { id: "elegant", name: "Elegant", description: "Serif fonts, gold accents", accentColor: "#b45309", preview: "elegant" },
  { id: "studio", name: "Studio", description: "Two-column, purple sidebar", accentColor: "#1e1b4b", preview: "studio" },
  { id: "slate", name: "Slate", description: "Monochromatic, corporate clean", accentColor: "#475569", preview: "slate" },
  { id: "neon", name: "Neon", description: "Dark bg, cyan + magenta glow", accentColor: "#06b6d4", preview: "neon" },
  { id: "terra", name: "Terra", description: "Terracotta, earthy warm tones", accentColor: "#c2410c", preview: "terra" },
  { id: "arctic", name: "Arctic", description: "Ice blue, ultra spacious", accentColor: "#0ea5e9", preview: "arctic" },
  { id: "executive", name: "Executive", description: "Navy & gold, premium serif", accentColor: "#d4af37", preview: "executive" },
];
