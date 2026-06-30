"use client";

import { Persona } from "@/lib/api";

const PERSONAS: { value: Persona; label: string; desc: string; accent: string }[] = [
  { value: "professional", label: "Professional", desc: "Polished & credible", accent: "border-blue-500 bg-blue-500/10" },
  { value: "witty", label: "Witty", desc: "Clever & memorable", accent: "border-purple-500 bg-purple-500/10" },
  { value: "urgent", label: "Urgent", desc: "Action-driven", accent: "border-orange-500 bg-orange-500/10" },
  { value: "playful", label: "Playful", desc: "Fun & relatable", accent: "border-pink-500 bg-pink-500/10" },
];

export default function PersonaSelector({
  value,
  onChange,
}: {
  value: Persona;
  onChange: (p: Persona) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PERSONAS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            value === p.value ? p.accent : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div className="font-medium text-white">{p.label}</div>
          <div className="text-sm text-zinc-400">{p.desc}</div>
        </button>
      ))}
    </div>
  );
}
