import logging
import pika
from model.evaluate_interview_msg import EvaluateInterviewMsg
from q import q
from config import config

logger = logging.getLogger(__name__)

def send_evaluate_interview_msg(message: EvaluateInterviewMsg):
  connection = q.create_connection()
  channel = connection.channel()
  queue_name = config.RABBITMQ_EVALUATE_INTERVIEW_QUEUE
  q.declare_queue(channel, queue_name)

  json_msg = message.json()
 
  properties = pika.BasicProperties(delivery_mode=pika.DeliveryMode.Persistent)

  channel.basic_publish(exchange="", routing_key=queue_name, body=json_msg, properties=properties)

  logger.info(f"Message sent to queue {queue_name} = {json_msg}")
  connection.close()