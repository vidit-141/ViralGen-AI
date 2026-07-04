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

export async function generateAsset(
  brief: string,
  persona: Persona,
  platform: Platform
): Promise<AssetResponse> {
  const res = await fetch(`${API_BASE}/generate/asset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief, persona, platform }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Generation failed");
  }

  return res.json();
}