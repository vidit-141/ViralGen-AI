"use client";

import { Persona } from "@/lib/api";

const PERSONAS: {
  value: Persona;
  label: string;
  desc: string;
  gradient: string;
  active: string;
}[] = [
  {
    value: "professional",
    label: "Professional",
    desc: "Polished & credible",
    gradient: "from-blue-600/20 to-blue-500/5",
    active: "border-blue-500 shadow-blue-500/20 shadow-lg",
  },
  {
    value: "witty",
    label: "Witty",
    desc: "Clever & memorable",
    gradient: "from-violet-600/20 to-violet-500/5",
    active: "border-violet-500 shadow-violet-500/20 shadow-lg",
  },
  {
    value: "urgent",
    label: "Urgent",
    desc: "Action-driven",
    gradient: "from-orange-600/20 to-orange-500/5",
    active: "border-orange-500 shadow-orange-500/20 shadow-lg",
  },
  {
    value: "playful",
    label: "Playful",
    desc: "Fun & relatable",
    gradient: "from-pink-600/20 to-pink-500/5",
    active: "border-pink-500 shadow-pink-500/20 shadow-lg",
  },
];

export default function PersonaSelector({
  value,
  onChange,
}: {
  value: Persona;
  onChange: (p: Persona) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PERSONAS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`text-left p-3 rounded-xl border transition-all duration-200 bg-gradient-to-br ${
            p.gradient
          } ${
            value === p.value
              ? `border-opacity-100 ${p.active}`
              : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div className="font-medium text-sm text-white">{p.label}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{p.desc}</div>
        </button>
      ))}
    </div>
  );
}