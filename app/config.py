from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    fal_api_key: str = ""
    fal_base_url: str = "https://fal.run/fal-ai/fibo"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    # Try to get from environment directly as fallback
    settings = Settings()
    if not settings.fal_api_key:
        settings = Settings(fal_api_key=os.environ.get("FAL_API_KEY", ""))
    return settings
