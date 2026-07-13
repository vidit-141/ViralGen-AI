"use client";

import { useEffect, useState } from "react";

export default function CopyOutput({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayed("");
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i += 4;
      if (i > text.length) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!text) return null;

  return (
    <div className="animate-fade-in rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
          Generated copy
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-zinc-800"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-4 whitespace-pre-wrap text-zinc-100 leading-relaxed text-sm">
        {displayed}
      </div>
    </div>
  );
}