from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.copy_generator import generate_copy

router = APIRouter(prefix="/generate", tags=["generate"])

class CopyRequest(BaseModel):
    brief: str = Field(..., min_length=5, max_length=500)
    persona: str = Field(..., pattern="^(professional|witty|urgent|playful)$")
    platform: str = Field(..., pattern="^(linkedin|instagram|twitter)$")

class CopyResponse(BaseModel):
    copy: str
    persona: str
    platform: str
    tone: str
    refined_image_prompt: str

@router.post("/copy", response_model=CopyResponse)
def copy_endpoint(req: CopyRequest):
    try:
        result = generate_copy(
            brief=req.brief,
            persona=req.persona,
            platform=req.platform
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Generation failed")