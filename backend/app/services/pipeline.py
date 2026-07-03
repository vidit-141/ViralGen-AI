from app.services.prompt_refiner import refine_prompt
from app.services.stability_client import generate_image
from app.services.copy_generator import generate_copy
from app.services.compositor import composite_image
from app.utils import sanitize_brief

def run_pipeline(brief: str, persona: str, platform: str) -> dict:
    clean_brief = sanitize_brief(brief)

    refined = refine_prompt(clean_brief)
    refined_prompt = refined["refined_prompt"]

    copy_result = generate_copy(
        brief=clean_brief,
        persona=persona,
        platform=platform
    )

    image_result = generate_image(prompt=refined_prompt)

    composite_result = composite_image(
        image_path=image_result["filepath"],
        copy_text=copy_result["copy"],
        persona=persona
    )

    return {
        "original_brief": clean_brief,
        "refined_image_prompt": refined_prompt,
        "copy": copy_result["copy"],
        "persona": persona,
        "platform": platform,
        "tone": copy_result["tone"],
        "image_url": image_result["image_url"],
        "filename": image_result["filename"],
        "composite_url": composite_result["composite_url"],
        "composite_filename": composite_result["filename"]
    }