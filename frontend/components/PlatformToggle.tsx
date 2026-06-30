"use client";

import { Platform } from "@/lib/api";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
];

export default function PlatformToggle({
  value,
  onChange,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <div className="flex gap-2">
      {PLATFORMS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            value === p.value
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}