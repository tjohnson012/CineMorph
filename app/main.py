from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routers.endpoints import router
from app.config import get_settings

app = FastAPI(
    title="CineMorph",
    description="Cinematography DNA extraction and remixing API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Log configuration status on startup"""
    settings = get_settings()
    api_key_set = bool(settings.fal_api_key)
    print(f"CineMorph API starting...")
    print(f"FAL_API_KEY configured: {api_key_set}")
    if not api_key_set:
        print("WARNING: FAL_API_KEY is not set. API calls will fail.")


@app.get("/")
async def root():
    return {"status": "ok", "app": "CineMorph API", "version": "1.0.0"}


@app.get("/health")
async def health():
    settings = get_settings()
    return {
        "status": "ok",
        "fal_api_configured": bool(settings.fal_api_key)
    }
