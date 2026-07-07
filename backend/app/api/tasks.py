from fastapi import APIRouter
from app.celery_app import celery
from app.tasks import test_task
from celery.result import AsyncResult

router = APIRouter(prefix="/task", tags=["tasks"])

@router.post("/test")
def trigger_test_task():
    task = test_task.delay(5, 7)
    return {
        "job_id": task.id,
        "message": "Task submitted, poll /task/{job_id}/status for result"
    }

@router.get("/{task_id}/status")
def get_task_status(task_id: str):
    result: AsyncResult = celery.AsyncResult(task_id)

    response = {
        "task_id": task_id,
        "status": result.state,
    }

    if result.state == "PENDING":
        response["message"] = "Task is waiting to be processed"
        response["progress"] = 0

    elif result.state == "STARTED":
        meta = result.info or {}
        response["message"] = meta.get("step", "Processing...")
        response["progress"] = meta.get("progress", 0)

    elif result.state == "SUCCESS":
        response["message"] = "Asset ready"
        response["progress"] = 100
        response["result"] = result.get()

    elif result.state == "FAILURE":
        response["message"] = "Generation failed"
        response["progress"] = 0
        response["error"] = str(result.info)

    return response