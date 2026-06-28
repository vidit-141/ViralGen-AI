import re

INJECTION_PATTERNS = [
    r"ignore (all |previous |above )?instructions",
    r"you are now",
    r"act as",
    r"forget (all |your |previous )?",
    r"system prompt",
    r"disregard",
    r"override",
]

def sanitize_brief(brief: str) -> str:
    cleaned = brief.strip()
    
    lower = cleaned.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            raise ValueError("Brief contains invalid content")
    
    cleaned = re.sub(r"[<>{}[\]\\]", "", cleaned)
    return cleaned