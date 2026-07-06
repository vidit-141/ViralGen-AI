from celery import Celery
from app.config import settings

celery = Celery(
    "viralgen",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks"]
)

celery.conf.update(
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    result_expires=3600,
)