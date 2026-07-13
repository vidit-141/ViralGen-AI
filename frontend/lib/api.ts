const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Persona = "professional" | "witty" | "urgent" | "playful";
export type Platform = "linkedin" | "instagram" | "twitter";

export interface AssetResponse {
  original_brief: string;
  refined_image_prompt: string;
  copy: string;
  persona: string;
  platform: string;
  tone: string;
  image_url: string;
  filename: string;
  composite_url: string;
  composite_filename: string;
  saved_to_db?: boolean;
}

export interface AsyncJobResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface HistoryItem {
  id: string;
  original_brief: string;
  copy: string;
  persona: string;
  platform: string;
  composite_url: string;
  image_url: string;
  created_at: string;
}

export async function generateAssetAsync(
  brief: string,
  persona: Persona,
  platform: Platform
): Promise<AsyncJobResponse> {
  const res = await fetch(`${API_BASE}/generate/asset/async`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief, persona, platform }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to start generation");
  }

  return res.json();
}

export async function fetchHistory(limit = 20): Promise<HistoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/history/?limit=${limit}`);
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // SAFE FIX: Handles both { items: [...] } AND direct array responses [...]
    if (Array.isArray(data)) {
      return data;
    }
    
    return data.items || [];
  } catch (e) {
    console.warn("History fetch failed:", e);
    return [];
  }
}