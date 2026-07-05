import requests
import uuid
import os
import time
import base64
from app.config import settings

STATIC_DIR = "static/images"
os.makedirs(STATIC_DIR, exist_ok=True)

def generate_image(prompt: str, negative_prompt: str = "") -> dict:
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

    headers = {
        "Authorization": f"Bearer {settings.stability_api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    body = {
    "text_prompts": [
        {"text": prompt, "weight": 1.0},
        {
            "text": negative_prompt or (
                "blurry, low quality, distorted, watermark, text, logo, brand name, "
                "letters, words, signs, labels, stickers, typography, "
                "oversaturated, ugly, deformed, bad anatomy, cropped, "
                "worst quality, jpeg artifacts, duplicate, extra limbs, "
                "poorly drawn, mutation, out of frame"
            ),
            "weight": -1.0
        }
    ],
    "cfg_scale": 7,
    "height": 1024,
    "width": 1024,
    "steps": 30,
    "samples": 1
    }

    last_error = None
    for attempt in range(settings.stability_max_retries):
        try:
            response = requests.post(url, headers=headers, json=body, timeout=60)

            if response.status_code == 429:
                wait = settings.stability_retry_delay * (attempt + 1)
                time.sleep(wait)
                continue

            if response.status_code != 200:
                raise Exception(f"Stability API error {response.status_code}: {response.text}")

            data = response.json()
            image_b64 = data["artifacts"][0]["base64"]

            filename = f"{uuid.uuid4()}.png"
            filepath = os.path.join(STATIC_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(base64.b64decode(image_b64))

            return {
                "filename": filename,
                "filepath": filepath,
                "image_url": f"/static/images/{filename}"
            }

        except Exception as e:
            last_error = e
            if attempt < settings.stability_max_retries - 1:
                time.sleep(settings.stability_retry_delay)

    raise Exception(f"Image generation failed after {settings.stability_max_retries} attempts: {last_error}")