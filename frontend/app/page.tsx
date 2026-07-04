"use client";

import { useState } from "react";
import { generateAsset, Persona, Platform, AssetResponse } from "@/lib/api";
import PersonaSelector from "@/components/PersonaSelector";
import PlatformToggle from "@/components/PlatformToggle";
import CopyOutput from "@/components/CopyOutput";
import ImageOutput from "@/components/ImageOutput";
import ImageSkeleton from "@/components/ImageSkeleton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [brief, setBrief] = useState("");
  const [persona, setPersona] = useState<Persona>("witty");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [result, setResult] = useState<AssetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (brief.trim().length < 5) {
      setError("Brief must be at least 5 characters");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await generateAsset(brief, persona, platform);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-1">ViralGen AI</h1>
        <p className="text-zinc-400 mb-8">Turn a brief into campaign-ready content</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">What are you promoting?</label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. noise cancelling headphones for remote workers"
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 resize-none h-24 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Brand voice</label>
              <PersonaSelector value={persona} onChange={setPersona} />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Platform</label>
              <PlatformToggle value={platform} onChange={setPlatform} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate campaign asset"}
            </button>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            {result && <CopyOutput text={result.copy} />}
          </div>

          <div className="space-y-4">
            {loading && <ImageSkeleton />}

            {result && (
              <div className="space-y-4 animate-fade-in">
                <ImageOutput
                  imageUrl={result.image_url}
                  compositeUrl={result.composite_url}
                  apiBase={API_BASE}
                />
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-500">Refined image prompt</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{result.refined_image_prompt}</p>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="w-full aspect-square rounded-xl border border-zinc-800 border-dashed flex items-center justify-center">
                <p className="text-zinc-600 text-sm">Your asset will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}