from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)

load_dotenv()

POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_DB = os.getenv("POSTGRES_DB", "postgres")
POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "pass")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "random-openai")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "random")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "random-lk-key")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "random-lk-secret")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")
RABBITMQ_EVALUATE_INTERVIEW_QUEUE = os.getenv("RABBITMQ_EVALUATE_INTERVIEW_QUEUE", "my-queue")

logger.info("Environment Variables loaded successfully")