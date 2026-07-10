from groq import Groq
from app.config import settings
import time

client = Groq(api_key=settings.groq_api_key)

def chat(system_prompt: str, user_message: str, model: str = "llama-3.1-8b-instant") -> str:
    max_retries = 5
    last_error = None

    for attempt in range(max_retries):
        try:
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

        except Exception as e:
            last_error = e
            error_str = str(e).lower()
            if "429" in error_str or "rate limit" in error_str:
                wait = (attempt + 1) * 5
                time.sleep(wait)
                continue
            raise e

    raise Exception(f"Groq API failed after {max_retries} attempts: {last_error}")