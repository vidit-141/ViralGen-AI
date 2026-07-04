"use client";

import { useState } from "react";

interface Props {
  imageUrl: string;
  compositeUrl: string;
  apiBase: string;
}

export default function ImageOutput({ imageUrl, compositeUrl, apiBase }: Props) {
  const [view, setView] = useState<"composite" | "raw">("composite");

  const currentUrl = view === "composite"
    ? `${apiBase}${compositeUrl}`
    : `${apiBase}${imageUrl}`;

  const handleDownload = async () => {
    const res = await fetch(currentUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = view === "composite" ? "viralgen-final.png" : "viralgen-raw.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setView("composite")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            view === "composite"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          Final asset
        </button>
        <button
          onClick={() => setView("raw")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            view === "raw"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          Raw image
        </button>
      </div>

      <div className="relative group">
        <img
          src={currentUrl}
          alt="Generated asset"
          className="w-full rounded-xl object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-all"
          >
            Download
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        {view === "composite" ? "Composited with copy overlay" : "Raw generated image"}
      </p>
    </div>
  );
}