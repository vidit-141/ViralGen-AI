"use client";

import { useState } from "react";

interface Props {
  imageUrl: string;
  compositeUrl: string;
  apiBase: string;
}

export default function ImageOutput({ imageUrl, compositeUrl, apiBase }: Props) {
  const [view, setView] = useState<"composite" | "raw">("composite");
  const [downloading, setDownloading] = useState(false);

  const currentUrl =
    view === "composite"
      ? `${apiBase}${compositeUrl}`
      : `${apiBase}${imageUrl}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(currentUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        view === "composite" ? "viralgen-final.png" : "viralgen-raw.png";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
          <button
            onClick={() => setView("composite")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              view === "composite"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Final asset
          </button>
          <button
            onClick={() => setView("raw")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              view === "raw"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Raw image
          </button>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-50"
        >
          {downloading ? "Saving..." : "Download"}
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-zinc-800">
        <img
          src={currentUrl}
          alt="Generated asset"
          className="w-full object-cover transition-opacity duration-500"
        />
      </div>

      <p className="text-xs text-zinc-600">
        {view === "composite"
          ? "Composited with copy overlay"
          : "Raw generated image"}
      </p>
    </div>
  );
}