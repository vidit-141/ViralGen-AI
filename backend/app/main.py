from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.database import connect_db, close_db

import os
import time
import logging

from app.api.health import router as health_router
from app.api.generate import router as generate_router
from app.api.refine import router as refine_router
from app.api.image import router as image_router
from app.api.asset import router as asset_router
from app.api.tasks import router as tasks_router
from app.api.async_asset import router as async_asset_router
from app.api.history import router as history_router
from app.api.regenerate import router as regenerate_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="ViralGen AI")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=404,
        content={"detail": f"Route {request.url.path} not found"}
    )

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = (time.time() - start) * 1000
    logger.info(
        f"{request.method} {request.url.path} "
        f"— {response.status_code} "
        f"— {duration:.0f}ms"
    )
    return response

os.makedirs("static/images", exist_ok=True)
os.makedirs("static/final", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(health_router)
app.include_router(generate_router)
app.include_router(image_router)
app.include_router(refine_router)
app.include_router(asset_router)
app.include_router(tasks_router)
app.include_router(async_asset_router)
app.include_router(history_router)  
app.include_router(regenerate_router)