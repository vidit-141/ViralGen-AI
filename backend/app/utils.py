import re

INJECTION_PATTERNS = [
    r"ignore.*(instructions|prompt|above|previous)",
    r"you are now",
    r"act as",
    r"forget.*(instructions|prompt|everything)",
    r"system prompt",
    r"disregard",
    r"override",
    r"new persona",
    r"pretend (you are|to be)",
    r"roleplay",
    r"jailbreak",
    r"dan mode",
    r"developer mode",
    r"bypass",
    r"sudo",
]

MAX_BRIEF_LENGTH = 500
MIN_BRIEF_LENGTH = 5

def sanitize_brief(brief: str) -> str:
    if not brief or not brief.strip():
        raise ValueError("Brief cannot be empty")

    cleaned = brief.strip()

    if len(cleaned) < MIN_BRIEF_LENGTH:
        raise ValueError(f"Brief must be at least {MIN_BRIEF_LENGTH} characters")

    if len(cleaned) > MAX_BRIEF_LENGTH:
        raise ValueError(f"Brief cannot exceed {MAX_BRIEF_LENGTH} characters")

    lower = cleaned.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            raise ValueError("Brief contains invalid content")

    cleaned = re.sub(r"[<>{}[\]\\]", "", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned)

    return cleaned