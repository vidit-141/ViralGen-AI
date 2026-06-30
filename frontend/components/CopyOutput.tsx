"use client";

import { useEffect, useState } from "react";

export default function CopyOutput({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i += 3;
      if (i > text.length) clearInterval(interval);
    }, 12);

    return () => clearInterval(interval);
  }, [text]);

  if (!text) return null;

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 whitespace-pre-wrap text-zinc-100 leading-relaxed">
      {displayed}
    </div>
  );
}