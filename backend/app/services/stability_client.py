import requests
import uuid
import os
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
            {"text": negative_prompt or "blurry, low quality, distorted, watermark", "weight": -1.0}
        ],
        "cfg_scale": 7,
        "height": 1024,
        "width": 1024,
        "steps": 30,
        "samples": 1
    }

    response = requests.post(url, headers=headers, json=body)

    if response.status_code != 200:
        raise Exception(f"Stability API error: {response.text}")

    data = response.json()
    image_b64 = data["artifacts"][0]["base64"]

    import base64
    filename = f"{uuid.uuid4()}.png"
    filepath = os.path.join(STATIC_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(base64.b64decode(image_b64))

    return {
        "filename": filename,
        "filepath": filepath,
        "image_url": f"/static/images/{filename}"
    }