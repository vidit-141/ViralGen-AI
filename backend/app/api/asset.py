from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.pipeline import run_pipeline

router = APIRouter(prefix="/generate", tags=["generate"])

class AssetRequest(BaseModel):
    brief: str = Field(..., min_length=5, max_length=500)
    persona: str = Field(..., pattern="^(professional|witty|urgent|playful)$")
    platform: str = Field(..., pattern="^(linkedin|instagram|twitter)$")

class AssetResponse(BaseModel):
    original_brief: str
    refined_image_prompt: str
    copy: str
    persona: str
    platform: str
    tone: str
    image_url: str
    filename: str
    composite_url: str
    composite_filename: str

@router.post("/asset", response_model=AssetResponse)
def asset_endpoint(req: AssetRequest):
    try:
        result = run_pipeline(
            brief=req.brief,
            persona=req.persona,
            platform=req.platform
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Generation failed")