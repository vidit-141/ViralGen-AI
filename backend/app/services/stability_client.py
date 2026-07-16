import requests
import uuid
import os
import time
import logging
import urllib.parse

logger = logging.getLogger(__name__)

STATIC_DIR = "static/images"
os.makedirs(STATIC_DIR, exist_ok=True)

def generate_image(prompt: str, negative_prompt: str = "") -> dict:
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true&enhance=true"

    last_error = None
    for attempt in range(3):
        try:
            logger.info(f"Pollinations attempt {attempt + 1}/3")
            response = requests.get(url, timeout=120)
            logger.info(f"Pollinations response status: {response.status_code}")

            if response.status_code != 200:
                raise Exception(f"Pollinations error {response.status_code}: {response.text}")

            if len(response.content) < 1000:
                raise Exception("Response too small, likely not an image")

            filename = f"{uuid.uuid4()}.png"
            filepath = os.path.join(STATIC_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(response.content)

            logger.info(f"Image saved: {filepath}")

            return {
                "filename": filename,
                "filepath": filepath,
                "image_url": f"/static/images/{filename}"
            }

        except Exception as e:
            last_error = e
            logger.error(f"Attempt {attempt + 1} failed: {e}")
            if attempt < 2:
                time.sleep(3)

    raise Exception(f"Image generation failed after 3 attempts: {last_error}")