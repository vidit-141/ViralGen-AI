from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    groq_api_key: str = ""
    stability_api_key: str = ""
    mongodb_uri: str = ""
    redis_url: str = "redis://redis:6379/0"
    stability_max_retries: int = 3
    stability_retry_delay: float = 2.0

    class Config:
        env_file = ".env"

settings = Settings()