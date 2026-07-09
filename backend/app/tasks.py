import time
import random
from app.celery_app import celery
from celery import states
from celery.exceptions import Ignore

@celery.task(bind=True, name="tasks.test_task")
def test_task(self, a: int, b: int) -> dict:
    return {"result": a + b, "task_id": self.request.id}

@celery.task(
    bind=True,
    name="tasks.generate_asset_task",
    time_limit=120,
    soft_time_limit=100
)
def generate_asset_task(self, brief: str, persona: str, platform: str) -> dict:
    try:
        # stagger concurrent tasks to avoid Groq rate limits
        jitter = random.uniform(0, 3)
        time.sleep(jitter)

        self.update_state(
            state="STARTED",
            meta={"step": "Refining prompt...", "progress": 10}
        )

        from app.services.prompt_refiner import refine_prompt
        refined = refine_prompt(brief)
        refined_prompt = refined["refined_prompt"]

        self.update_state(
            state="STARTED",
            meta={"step": "Generating copy...", "progress": 30}
        )

        from app.services.copy_generator import generate_copy
        copy_result = generate_copy(
            brief=brief,
            persona=persona,
            platform=platform
        )

        self.update_state(
            state="STARTED",
            meta={"step": "Generating image...", "progress": 55}
        )

        from app.services.stability_client import generate_image
        image_result = generate_image(prompt=refined_prompt)

        self.update_state(
            state="STARTED",
            meta={"step": "Compositing final asset...", "progress": 85}
        )

        from app.services.compositor import composite_image
        composite_result = composite_image(
            image_path=image_result["filepath"],
            copy_text=copy_result["copy"],
            persona=persona
        )

        return {
            "original_brief": brief,
            "refined_image_prompt": refined_prompt,
            "copy": copy_result["copy"],
            "persona": persona,
            "platform": platform,
            "tone": copy_result["tone"],
            "image_url": image_result["image_url"],
            "filename": image_result["filename"],
            "composite_url": composite_result["composite_url"],
            "composite_filename": composite_result["filename"]
        }

    except Exception as e:
        self.update_state(
            state=states.FAILURE,
            meta={
                "exc_type": type(e).__name__,
                "exc_message": str(e),
                "step": "Failed"
            }
        )
        raise Ignore()