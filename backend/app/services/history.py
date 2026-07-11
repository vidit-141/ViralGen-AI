from datetime import datetime
from app.database import get_db
import logging

logger = logging.getLogger(__name__)

async def save_generation(result: dict) -> str:
    try:
        db = get_db()
        if db is None:
            logger.warning("MongoDB not connected, skipping history save")
            return None

        document = {
            "original_brief": result.get("original_brief"),
            "refined_image_prompt": result.get("refined_image_prompt"),
            "copy": result.get("copy"),
            "persona": result.get("persona"),
            "platform": result.get("platform"),
            "tone": result.get("tone"),
            "image_url": result.get("image_url"),
            "composite_url": result.get("composite_url"),
            "created_at": datetime.utcnow()
        }

        inserted = await db.generations.insert_one(document)
        logger.info(f"Generation saved to MongoDB: {inserted.inserted_id}")
        return str(inserted.inserted_id)

    except Exception as e:
        logger.error(f"Failed to save generation: {e}")
        return None

async def get_history(limit: int = 20, skip: int = 0) -> list:
    try:
        db = get_db()
        if db is None:
            return []

        cursor = db.generations.find(
            {},
            {"_id": 1, "original_brief": 1, "copy": 1, "persona": 1,
             "platform": 1, "composite_url": 1, "image_url": 1, "created_at": 1}
        ).sort("created_at", -1).skip(skip).limit(limit)

        results = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            doc["created_at"] = doc["created_at"].isoformat()
            results.append(doc)

        return results

    except Exception as e:
        logger.error(f"Failed to fetch history: {e}")
        return []