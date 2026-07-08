"use client";

import { useState } from "react";
import { generateAssetAsync, Persona, Platform } from "@/lib/api";
import { useJobPoller } from "@/hooks/useJobPoller";
import PersonaSelector from "@/components/PersonaSelector";
import PlatformToggle from "@/components/PlatformToggle";
import CopyOutput from "@/components/CopyOutput";
import ImageOutput from "@/components/ImageOutput";
import JobProgressCard from "@/components/JobProgressCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [brief, setBrief] = useState("");
  const [persona, setPersona] = useState<Persona>("witty");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [error, setError] = useState("");

  const { jobState, startPolling, reset } = useJobPoller();

  const isGenerating =
    jobState.status === "PENDING" || jobState.status === "STARTED";
  const isDone = jobState.status === "SUCCESS";
  const hasFailed = jobState.status === "FAILURE";

  const handleGenerate = async () => {
    if (brief.trim().length < 5) {
      setError("Brief must be at least 5 characters");
      return;
    }
    setError("");
    reset();

    try {
      const job = await generateAssetAsync(brief, persona, platform);
      startPolling(job.job_id);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-1">ViralGen AI</h1>
        <p className="text-zinc-400 mb-8">
          Turn a brief into campaign-ready content
        </p>

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

            {isDone && jobState.result && (
              <CopyOutput text={jobState.result.copy} />
            )}
          </div>

          <div className="space-y-4">
            {isGenerating && (
              <JobProgressCard jobState={jobState} />
            )}

            {isDone && jobState.result && (
              <div className="space-y-4">
                <ImageOutput
                  imageUrl={jobState.result.image_url}
                  compositeUrl={jobState.result.composite_url}
                  apiBase={API_BASE}
                />
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-500">Refined image prompt</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {jobState.result.refined_image_prompt}
                  </p>
                </div>
              </div>
            )}

            {jobState.status === "idle" && (
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
  );
}