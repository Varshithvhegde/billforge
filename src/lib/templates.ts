import type { Template } from "@/types/invoice";

export const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean white with subtle borders",
    accentColor: "#6366f1",
    preview: "minimal",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional header with navy accent",
    accentColor: "#1e3a5f",
    preview: "classic",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Dark header block, high contrast",
    accentColor: "#0f172a",
    preview: "bold",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Warm tones with gold accents",
    accentColor: "#b45309",
    preview: "elegant",
  },
];
