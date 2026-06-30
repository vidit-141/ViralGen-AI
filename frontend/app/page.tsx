"use client";

import { useState } from "react";
import { generateCopy, Persona, Platform, CopyResponse } from "@/lib/api";
import PersonaSelector from "@/components/PersonaSelector";
import PlatformToggle from "@/components/PlatformToggle";
import CopyOutput from "@/components/CopyOutput";

export default function Home() {
  const [brief, setBrief] = useState("");
  const [persona, setPersona] = useState<Persona>("witty");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [result, setResult] = useState<CopyResponse | null>(null);
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
      const res = await generateCopy(brief, persona, platform);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">ViralGen AI</h1>
      <p className="text-zinc-400 mb-8">Turn a brief into campaign-ready copy</p>

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
          className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-all disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate copy"}
        </button>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        {result && <CopyOutput text={result.copy} />}
      </div>
    </main>
  );
}