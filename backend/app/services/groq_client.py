from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)

def chat(system_prompt: str, user_message: str, model: str = "llama-3.1-8b-instant") -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.85,
        max_tokens=512
    )
    return response.choices[0].message.content.strip()