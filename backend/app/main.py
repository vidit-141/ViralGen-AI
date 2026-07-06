from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os

from app.api.health import router as health_router
from app.api.generate import router as generate_router
from app.api.refine import router as refine_router
from app.api.image import router as image_router
from app.api.asset import router as asset_router
from app.api.tasks import router as tasks_router

app = FastAPI(title="ViralGen AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/images", exist_ok=True)
os.makedirs("static/final", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


app.include_router(health_router)
app.include_router(generate_router)
app.include_router(refine_router)
app.include_router(image_router)
app.include_router(asset_router)
app.include_router(tasks_router)
