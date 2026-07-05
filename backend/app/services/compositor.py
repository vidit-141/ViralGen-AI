from PIL import Image, ImageDraw, ImageFont
import os
import uuid
import textwrap

FINAL_DIR = "static/final"
os.makedirs(FINAL_DIR, exist_ok=True)

PERSONA_STYLES = {
    "professional": {
        "bg_color": (15, 23, 42, 220),
        "text_color": (255, 255, 255),
        "accent_color": (59, 130, 246),
    },
    "witty": {
        "bg_color": (88, 28, 135, 210),
        "text_color": (255, 255, 255),
        "accent_color": (168, 85, 247),
    },
    "urgent": {
        "bg_color": (127, 29, 29, 225),
        "text_color": (255, 255, 255),
        "accent_color": (239, 68, 68),
    },
    "playful": {
        "bg_color": (20, 83, 45, 210),
        "text_color": (255, 255, 255),
        "accent_color": (34, 197, 94),
    }
}

def split_copy_and_hashtags(text: str) -> tuple[str, str]:
    lines = text.strip().split("\n")
    copy_lines = []
    hashtag_lines = []

    for line in lines:
        if line.strip().startswith("#"):
            hashtag_lines.append(line.strip())
        else:
            copy_lines.append(line.strip())

    copy = " ".join([l for l in copy_lines if l])
    hashtags = " ".join(hashtag_lines)
    return copy, hashtags

def wrap_text(text: str, max_chars: int = 42) -> list[str]:
    lines = []
    for paragraph in text.split("\n"):
        if paragraph.strip():
            wrapped = textwrap.wrap(paragraph.strip(), width=max_chars)
            lines.extend(wrapped)
    return lines

def composite_image(image_path: str, copy_text: str, persona: str) -> dict:
    style = PERSONA_STYLES.get(persona, PERSONA_STYLES["professional"])

    img = Image.open(image_path).convert("RGBA")
    width, height = img.size

    try:
        font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
        font_regular = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
        font_hashtag = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except:
        font_bold = ImageFont.load_default()
        font_regular = font_bold
        font_hashtag = font_bold

    copy, hashtags = split_copy_and_hashtags(copy_text)

    copy_lines = wrap_text(copy, max_chars=42)[:5]
    hashtag_wrapped = textwrap.wrap(hashtags, width=55)[:2] if hashtags else []

    padding = 24
    line_height_main = 34
    line_height_hashtag = 26

    total_lines = len(copy_lines) + (1 if hashtag_wrapped else 0) + len(hashtag_wrapped)
    accent_height = 4
    banner_height = padding + (len(copy_lines) * line_height_main) + (len(hashtag_wrapped) * line_height_hashtag) + padding + accent_height + 16

    banner_height = max(banner_height, int(height * 0.28))
    banner_y = height - banner_height

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)

    draw_overlay.rectangle(
        [(0, banner_y), (width, height)],
        fill=style["bg_color"]
    )

    draw_overlay.rectangle(
        [(0, banner_y), (width, banner_y + accent_height)],
        fill=style["accent_color"]
    )

    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    text_y = banner_y + accent_height + padding

    for i, line in enumerate(copy_lines):
        current_font = font_bold if i == 0 else font_regular
        draw.text(
            (padding, text_y),
            line,
            font=current_font,
            fill=style["text_color"]
        )
        text_y += line_height_main

    if hashtag_wrapped:
        text_y += 8
        for line in hashtag_wrapped:
            draw.text(
                (padding, text_y),
                line,
                font=font_hashtag,
                fill=(*style["accent_color"], 220)
            )
            text_y += line_height_hashtag

    final_img = img.convert("RGB")
    filename = f"final_{uuid.uuid4()}.png"
    filepath = os.path.join(FINAL_DIR, filename)
    final_img.save(filepath, "PNG", quality=95)

    return {
        "filename": filename,
        "filepath": filepath,
        "composite_url": f"/static/final/{filename}"
    }