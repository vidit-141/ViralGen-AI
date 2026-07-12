"use client";

import { useEffect, useState } from "react";
import { fetchHistory, HistoryItem } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PERSONA_COLORS: Record<string, string> = {
  professional: "bg-blue-500/20 text-blue-300",
  witty: "bg-purple-500/20 text-purple-300",
  urgent: "bg-red-500/20 text-red-300",
  playful: "bg-green-500/20 text-green-300",
};

interface Props {
  onSelect: (item: HistoryItem) => void;
  refreshTrigger: number;
}

export default function HistoryPanel({ onSelect, refreshTrigger }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchHistory(20);
      setItems(data);
      setLoading(false);
    };
    load();
  }, [refreshTrigger]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-300">Past generations</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{items.length} assets</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-3 p-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="w-full h-20 rounded-lg bg-zinc-800" />
                <div className="h-3 w-3/4 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="p-4 text-center">
            <p className="text-zinc-600 text-sm">No generations yet</p>
            <p className="text-zinc-700 text-xs mt-1">
              Your history will appear here
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="p-2 space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all group"
              >
                <div className="relative">
                  <img
                    src={`${API_BASE}${item.composite_url}`}
                    alt={item.original_brief}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs text-zinc-300 truncate">
                    {item.original_brief}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        PERSONA_COLORS[item.persona] || "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {item.persona}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {item.platform}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}