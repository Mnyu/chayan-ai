import pika
import logging
from config import config

logger = logging.getLogger(__name__)

def create_connection():
  try:
    credentials =pika.PlainCredentials(config.RABBITMQ_USER, config.RABBITMQ_PASSWORD)
    connection_params = pika.ConnectionParameters(host=config.RABBITMQ_HOST, port=config.RABBITMQ_PORT, credentials=credentials)
    connection = pika.BlockingConnection(connection_params)
    logger.info("RabbitMQ connection established")
    return connection
  except Exception as e:
    logger.error(f"RabbitMQ connection failed: {e}")

def declare_queue(channel, queueName):
  try:
    channel.queue_declare(queue=queueName, durable=True)
    logger.info(f"Queue {queueName} declared")
  except Exception as e:
    logger.error(f"RabbitMQ connection failed: {e}")