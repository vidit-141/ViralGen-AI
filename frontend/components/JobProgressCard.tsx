"use client";

import { JobState } from "@/hooks/useJobPoller";

const STEPS = [
  { label: "Refining", threshold: 10 },
  { label: "Copywriting", threshold: 30 },
  { label: "Generating", threshold: 55 },
  { label: "Compositing", threshold: 85 },
  { label: "Done", threshold: 100 },
];

const STEP_MESSAGES: Record<string, string> = {
  "Refining prompt...": "Refining your brief into an image prompt",
  "Generating copy...": "Writing campaign copy",
  "Generating image...": "Generating visual with Stable Diffusion",
  "Compositing final asset...": "Compositing copy onto image",
  "Asset ready": "Your asset is ready",
  "Queued...": "Waiting for worker...",
};

export default function JobProgressCard({ jobState }: { jobState: JobState }) {
  const { progress, message } = jobState;

  return (
    <div className="animate-fade-in animate-pulse-glow p-5 rounded-xl bg-zinc-900 border border-violet-500/30 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse flex-shrink-0" />
        <span className="text-sm text-zinc-300">
          {STEP_MESSAGES[message] || message || "Processing..."}
        </span>
        <span className="ml-auto text-sm font-medium text-violet-400">
          {progress}%
        </span>
      </div>

      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, #7c3aed, #8b5cf6, #06b6d4)",
          }}
        />
      </div>

      <div className="flex justify-between">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                progress >= step.threshold
                  ? "bg-violet-500 scale-125"
                  : "bg-zinc-700"
              }`}
            />
            <span
              className={`text-xs transition-colors ${
                progress >= step.threshold
                  ? "text-zinc-400"
                  : "text-zinc-700"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}