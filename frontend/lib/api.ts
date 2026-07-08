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
}

export interface AsyncJobResponse {
  job_id: string;
  status: string;
  message: string;
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