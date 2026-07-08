"use client";

import { JobState } from "@/hooks/useJobPoller";

const STEP_LABELS: Record<string, string> = {
  "Refining prompt...": "Refining your brief",
  "Generating copy...": "Writing campaign copy",
  "Generating image...": "Generating visual",
  "Compositing final asset...": "Compositing final asset",
  "Asset ready": "Done",
  "Queued...": "Queued",
};

export default function JobProgressCard({ jobState }: { jobState: JobState }) {
  const { status, progress, message } = jobState;

  const steps = [
    { label: "Refining brief", threshold: 10 },
    { label: "Writing copy", threshold: 30 },
    { label: "Generating image", threshold: 55 },
    { label: "Compositing", threshold: 85 },
    { label: "Done", threshold: 100 },
  ];

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          {STEP_LABELS[message] || message}
        </span>
        <span className="text-sm text-zinc-400">{progress}%</span>
      </div>

      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
          }}
        />
      </div>

      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                progress >= step.threshold
                  ? "bg-violet-500"
                  : "bg-zinc-700"
              }`}
            />
            <span className="text-xs text-zinc-500 hidden sm:block">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {status === "PENDING" || status === "STARTED" ? (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs text-zinc-400">Processing in background</span>
        </div>
      ) : null}
    </div>
  );
}