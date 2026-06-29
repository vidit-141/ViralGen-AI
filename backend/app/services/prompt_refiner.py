from app.services.groq_client import chat

REFINER_SYSTEM_PROMPT = """You are an expert AI image prompt engineer.
Your job is to take a vague product brief and rewrite it into a detailed, 
photorealistic image generation prompt.

Rules:
- Always describe the subject clearly and specifically
- Include lighting style (cinematic, soft, dramatic, natural)
- Include camera angle (eye level, overhead, close-up, wide shot)
- Include mood and atmosphere
- Include background/setting
- End with quality boosters: 8k, highly detailed, professional photography
- Output ONLY the image prompt, nothing else. No explanations, no labels.

Examples:
Brief: "red shoes"
Output: "Photorealistic close-up of sleek red running shoes on wet asphalt, 
cinematic lighting, shallow depth of field, dark moody background, 
professional product photography, 8k, highly detailed"

Brief: "coffee brand"
Output: "Steaming cup of black coffee on a rustic wooden table, warm morning 
light streaming through window, cozy cafe atmosphere, overhead shot, 
rich browns and creams, professional food photography, 8k, highly detailed"
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