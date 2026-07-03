from PIL import Image, ImageDraw, ImageFont
import os
import uuid
import textwrap

FINAL_DIR = "static/final"
os.makedirs(FINAL_DIR, exist_ok=True)

PERSONA_STYLES = {
    "professional": {
        "bg_color": (15, 23, 42, 210),
        "text_color": (255, 255, 255),
        "accent_color": (59, 130, 246),
        "position": "bottom"
    },
    "witty": {
        "bg_color": (88, 28, 135, 200),
        "text_color": (255, 255, 255),
        "accent_color": (168, 85, 247),
        "position": "bottom"
    },
    "urgent": {
        "bg_color": (127, 29, 29, 220),
        "text_color": (255, 255, 255),
        "accent_color": (239, 68, 68),
        "position": "bottom"
    },
    "playful": {
        "bg_color": (20, 83, 45, 200),
        "text_color": (255, 255, 255),
        "accent_color": (34, 197, 94),
        "position": "bottom"
    }
}

def wrap_text(text: str, max_chars: int = 45) -> list[str]:
    lines = []
    for paragraph in text.split("\n"):
        if paragraph.strip():
            wrapped = textwrap.wrap(paragraph.strip(), width=max_chars)
            lines.extend(wrapped[:3])
            if len(lines) >= 4:
                break
    return lines[:4]

def composite_image(image_path: str, copy_text: str, persona: str) -> dict:
    style = PERSONA_STYLES.get(persona, PERSONA_STYLES["professional"])

    img = Image.open(image_path).convert("RGBA")
    width, height = img.size

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    banner_height = int(height * 0.32)
    banner_y = height - banner_height

    draw.rectangle(
        [(0, banner_y), (width, height)],
        fill=style["bg_color"]
    )

    accent_height = 4
    draw.rectangle(
        [(0, banner_y), (width, banner_y + accent_height)],
        fill=style["accent_color"]
    )

    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    except:
        font = ImageFont.load_default()
        small_font = font

    lines = wrap_text(copy_text)
    padding = 24
    line_height = 36
    text_y = banner_y + accent_height + padding

    for i, line in enumerate(lines):
        current_font = font if i == 0 else small_font
        draw.text(
            (padding, text_y + i * line_height),
            line,
            font=current_font,
            fill=style["text_color"]
        )

    final_img = img.convert("RGB")
    filename = f"final_{uuid.uuid4()}.png"
    filepath = os.path.join(FINAL_DIR, filename)
    final_img.save(filepath, "PNG", quality=95)

    return {
        "filename": filename,
        "filepath": filepath,
        "composite_url": f"/static/final/{filename}"
    }