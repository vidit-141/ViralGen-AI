from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.prompt_refiner import refine_prompt
from app.utils import sanitize_brief

router = APIRouter(prefix="/refine", tags=["refine"])

class RefineRequest(BaseModel):
    brief: str = Field(..., min_length=5, max_length=500)

class RefineResponse(BaseModel):
    original_brief: str
    refined_prompt: str

@router.post("/prompt", response_model=RefineResponse)
def refine_endpoint(req: RefineRequest):
    try:
        clean_brief = sanitize_brief(req.brief)
        result = refine_prompt(clean_brief)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Refinement failed")