"use client";

import { useState } from "react";
import { generateAssetAsync, Persona, Platform, HistoryItem } from "@/lib/api";
import { useJobPoller } from "@/hooks/useJobPoller";
import PersonaSelector from "@/components/PersonaSelector";
import PlatformToggle from "@/components/PlatformToggle";
import CopyOutput from "@/components/CopyOutput";
import ImageOutput from "@/components/ImageOutput";
import JobProgressCard from "@/components/JobProgressCard";
import HistoryPanel from "@/components/HistoryPanel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [brief, setBrief] = useState("");
  const [persona, setPersona] = useState<Persona>("witty");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const { jobState, startPolling, reset } = useJobPoller(() => {
    setRefreshTrigger((prev) => prev + 1);
  });

  const isGenerating =
    jobState.status === "PENDING" || jobState.status === "STARTED";
  const isDone = jobState.status === "SUCCESS";
  const hasFailed = jobState.status === "FAILURE";

  const activeResult = isDone && jobState.result ? jobState.result : null;

  const handleGenerate = async () => {
    if (brief.trim().length < 5) {
      setError("Brief must be at least 5 characters");
      return;
    }
    setError("");
    setSelectedHistory(null);
    reset();

    try {
      const job = await generateAssetAsync(brief, persona, platform);
      startPolling(job.job_id);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setSelectedHistory(item);
    reset();
    setError("");
  };

  const displayResult = selectedHistory
    ? {
        copy: selectedHistory.copy,
        image_url: selectedHistory.image_url,
        composite_url: selectedHistory.composite_url,
        refined_image_prompt: "",
      }
    : activeResult;

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 border-r border-zinc-800 flex-shrink-0 h-screen sticky top-0 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-lg font-semibold">ViralGen AI</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Campaign content generator
          </p>
        </div>
        <HistoryPanel
          onSelect={handleHistorySelect}
          refreshTrigger={refreshTrigger}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  What are you promoting?
                </label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="e.g. noise cancelling headphones for remote workers"
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 resize-none h-24 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Brand voice
                </label>
                <PersonaSelector value={persona} onChange={setPersona} />
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Platform
                </label>
                <PlatformToggle value={platform} onChange={setPlatform} />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate campaign asset"}
              </button>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              {hasFailed && (
                <div className="text-red-400 text-sm">
                  {jobState.error || "Generation failed. Please try again."}
                </div>
              )}

              {displayResult && <CopyOutput text={displayResult.copy} />}
            </div>

            <div className="space-y-4">
              {isGenerating && <JobProgressCard jobState={jobState} />}

              {displayResult && (
                <div className="space-y-4">
                  <ImageOutput
                    imageUrl={displayResult.image_url}
                    compositeUrl={displayResult.composite_url}
                    apiBase={API_BASE}
                  />
                  {displayResult.refined_image_prompt && (
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <p className="text-xs text-zinc-500">
                        Refined image prompt
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {displayResult.refined_image_prompt}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!isGenerating && !displayResult && (
                <div className="w-full aspect-square rounded-xl border border-zinc-800 border-dashed flex items-center justify-center">
                  <p className="text-zinc-600 text-sm">
                    Your asset will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}