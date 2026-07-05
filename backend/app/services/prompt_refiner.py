from app.services.groq_client import chat

REFINER_SYSTEM_PROMPT = """You are an expert AI image prompt engineer specializing in product photography and marketing visuals.

Your job is to take a vague product brief and rewrite it into a detailed, photorealistic image generation prompt optimized for Stable Diffusion XL.

Rules:
- Always name the specific product clearly
- Include lighting (cinematic, soft natural, dramatic studio, golden hour)
- Include camera details (85mm lens, shallow depth of field, close-up, product shot)
- Include setting/background that matches the product's target audience
- Include mood and color palette
- End with: professional product photography, highly detailed, 8k resolution
- Output ONLY the image prompt. No explanations, no labels, no preamble.
- Keep it under 200 words.

Examples:
Brief: "gym earbuds"
Output: "Sleek black wireless earbuds resting on a white gym towel next to a water bottle, dramatic studio lighting, close-up product shot, 85mm lens shallow depth of field, dark gym background with subtle bokeh, energetic athletic mood, deep blacks and vibrant accents, professional product photography, highly detailed, 8k resolution"

Brief: "coffee brand"
Output: "Steaming artisan coffee cup on a rustic wooden table in a cozy cafe, warm golden morning light streaming through window, overhead flat lay shot, rich browns and cream tones, minimalist aesthetic, professional food photography, highly detailed, 8k resolution"

Brief: "skincare for women"
Output: "Elegant white skincare bottles arranged on a marble surface with fresh flowers, soft diffused natural lighting, close-up beauty shot, clean minimal aesthetic, pastel pink and white color palette, luxury feel, professional beauty product photography, highly detailed, 8k resolution"
"""

def refine_prompt(brief: str) -> dict:
    refined = chat(
        system_prompt=REFINER_SYSTEM_PROMPT,
        user_message=f"Brief: {brief}",
        model="llama-3.1-8b-instant"
    )

    return {
        "original_brief": brief,
        "refined_prompt": refined.strip()
    }