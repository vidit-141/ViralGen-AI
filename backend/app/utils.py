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
]

def sanitize_brief(brief: str) -> str:
    cleaned = brief.strip()

    lower = cleaned.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            raise ValueError("Brief contains invalid content")

    cleaned = re.sub(r"[<>{}[\]\\]", "", cleaned)
    return cleaned