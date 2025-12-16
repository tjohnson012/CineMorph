from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    fal_api_key: str
    fal_base_url: str = "https://fal.run/fal-ai/fibo"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
