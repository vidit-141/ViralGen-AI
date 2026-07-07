from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.tasks import generate_asset_task

router = APIRouter(prefix="/generate", tags=["generate"])

class AsyncAssetRequest(BaseModel):
    brief: str = Field(..., min_length=5, max_length=500)
    persona: str = Field(..., pattern="^(professional|witty|urgent|playful)$")
    platform: str = Field(..., pattern="^(linkedin|instagram|twitter)$")

class AsyncAssetResponse(BaseModel):
    job_id: str
    status: str
    message: str

@router.post("/asset/async", response_model=AsyncAssetResponse)
def async_asset_endpoint(req: AsyncAssetRequest):
    try:
        task = generate_asset_task.delay(
            brief=req.brief,
            persona=req.persona,
            platform=req.platform
        )
        return {
            "job_id": task.id,
            "status": "PENDING",
            "message": "Asset generation started. Poll /task/{job_id}/status for updates."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))