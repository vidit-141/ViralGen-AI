from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "viralgen-api",
        "stability_configured": bool(settings.stability_api_key),
        "groq_configured": bool(settings.groq_api_key),
        "mongodb_configured": bool(settings.mongodb_uri)
    }