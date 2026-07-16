from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    try:
        db_instance.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            serverSelectionTimeoutMS=5000,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        db_instance.db = db_instance.client.viralgen
        await db_instance.client.admin.command("ping")
        logger.info("MongoDB connected successfully")
    except Exception as e:
        logger.warning(f"MongoDB unavailable, history will be disabled: {e}")
        db_instance.db = None

async def close_db():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed")

def get_db():
    return db_instance.db