from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.copy_generator import generate_copy
from app.utils import sanitize_brief

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/regenerate", tags=["regenerate"])

class RegenerateCopyRequest(BaseModel):
    brief: str = Field(..., min_length=5, max_length=500)
    persona: str = Field(..., pattern="^(professional|witty|urgent|playful)$")
    platform: str = Field(..., pattern="^(linkedin|instagram|twitter)$")

class RegenerateCopyResponse(BaseModel):
    copy: str
    persona: str
    platform: str
    tone: str

@router.post("/copy", response_model=RegenerateCopyResponse)
@limiter.limit("20/minute")
def regenerate_copy(request: Request, req: RegenerateCopyRequest):
    try:
        clean_brief = sanitize_brief(req.brief)
        result = generate_copy(
            brief=clean_brief,
            persona=req.persona,
            platform=req.platform
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Regeneration failed")