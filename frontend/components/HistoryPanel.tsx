"use client";

import { useEffect, useState } from "react";
import { fetchHistory, HistoryItem } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PERSONA_BADGES: Record<string, string> = {
  professional: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  witty: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  urgent: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  playful: "bg-pink-500/15 text-pink-400 border border-pink-500/20",
};

interface Props {
  onSelect: (item: HistoryItem) => void;
  refreshTrigger: number;
}

export default function HistoryPanel({ onSelect, refreshTrigger }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchHistory(20);
        if (isCurrent) {
          setItems(data);
        }
      } catch (e) {
        console.warn("HistoryPanel load failed:", e);
        if (isCurrent) {
          setItems([]);
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };
    load();

    return () => {
      isCurrent = false;
    };
  }, [refreshTrigger]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            History
          </span>
          <span className="text-xs text-zinc-600">{items.length} assets</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {loading &&
          [...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <div className="animate-shimmer w-full h-16 rounded-lg" />
            </div>
          ))}

        {!loading && items.length === 0 && (
          <div className="py-8 text-center space-y-1">
            <p className="text-zinc-600 text-xs">No generations yet</p>
            <p className="text-zinc-700 text-xs">
              Generate your first asset
            </p>
          </div>
        )}

        {!loading &&
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left rounded-lg overflow-hidden border border-transparent hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
            >
              <div className="flex gap-2.5 p-2">
                <img
                  src={`${API_BASE}${item.composite_url}`}
                  alt={item.original_brief}
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs text-zinc-300 truncate leading-tight">
                    {item.original_brief}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        PERSONA_BADGES[item.persona] ||
                        "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {item.persona}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {item.platform}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}