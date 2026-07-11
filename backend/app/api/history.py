from fastapi import APIRouter, Query
from app.services.history import get_history

router = APIRouter(prefix="/history", tags=["history"])

@router.get("/")
async def history_endpoint(
    limit: int = Query(default=20, ge=1, le=50),
    skip: int = Query(default=0, ge=0)
):
    results = await get_history(limit=limit, skip=skip)
    return {
        "items": results,
        "count": len(results),
        "limit": limit,
        "skip": skip
    }