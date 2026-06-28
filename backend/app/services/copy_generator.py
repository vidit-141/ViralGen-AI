from app.services.groq_client import chat
from app.personas import PERSONAS, PLATFORMS
from app.utils import sanitize_brief

def generate_copy(brief: str, persona: str, platform: str) -> dict:
    persona_config = PERSONAS.get(persona)
    platform_config = PLATFORMS.get(platform)

    if not persona_config:
        raise ValueError(f"Unknown persona: {persona}")
    if not platform_config:
        raise ValueError(f"Unknown platform: {platform}")

    clean_brief = sanitize_brief(brief)

    system_prompt = (
        f"{persona_config['system_prompt']}\n\n"
        f"Platform instructions: {platform_config['instruction']}\n\n"
        f"Important: Respond with only the final copy. No explanations, no labels, no preamble."
    )

    user_message = f"Write marketing copy for the following:\n\n{clean_brief}"

    copy = chat(system_prompt=system_prompt, user_message=user_message)

    return {
        "copy": copy,
        "persona": persona,
        "platform": platform,
        "tone": persona_config["tone_hint"]
    }