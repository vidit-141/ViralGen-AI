from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.stability_client import generate_image
from app.services.prompt_refiner import refine_prompt
from app.utils import sanitize_brief

router = APIRouter(prefix="/generate", tags=["generate"])

class ImageRequest(BaseModel):
    brief: str = Field(..., min_length=5, max_length=500)
    negative_prompt: str = Field(default="")

class ImageResponse(BaseModel):
    original_brief: str
    refined_prompt: str
    image_url: str
    filename: str

@router.post("/image", response_model=ImageResponse)
def image_endpoint(req: ImageRequest):
    try:
        clean_brief = sanitize_brief(req.brief)
        refined = refine_prompt(clean_brief)
        result = generate_image(
            prompt=refined["refined_prompt"],
            negative_prompt=req.negative_prompt
        )
        return {
            "original_brief": clean_brief,
            "refined_prompt": refined["refined_prompt"],
            "image_url": result["image_url"],
            "filename": result["filename"]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Generation failed")