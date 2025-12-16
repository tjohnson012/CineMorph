from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.endpoints import router

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


@app.get("/")
async def root():
    return {"status": "ok", "app": "CineMorph API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
