from app.celery_app import celery

@celery.task(bind=True, name="tasks.test_task")
def test_task(self, a: int, b: int) -> dict:
    return {"result": a + b, "task_id": self.request.id}