import json
import logging
from .config import settings

logger = logging.getLogger("producer")

try:
    from kafka import KafkaProducer
    has_kafka = True
except Exception:
    has_kafka = False

class EventProducer:
    def __init__(self):
        self.topic = settings.KAFKA_TOPIC
        if has_kafka:
            try:
                self.producer = KafkaProducer(
                    bootstrap_servers=[settings.KAFKA_BOOTSTRAP],
                    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                    retries=5
                )
                self.kafka_available = True
                logger.info("KafkaProducer initialized")
            except Exception as e:
                logger.warning("Kafka not available: %s", e)
                self.producer = None
                self.kafka_available = False
        else:
            self.producer = None
            self.kafka_available = False

    def send(self, payload: dict):
        """Send event to Kafka if available, otherwise fallback to a local file."""
        if self.kafka_available and self.producer:
            try:
                self.producer.send(self.topic, payload)
                self.producer.flush()
                return True
            except Exception as e:
                logger.error("Kafka send failed, fallback to file: %s", e)
                self.kafka_available = False

        # fallback if Kafka not available
        try:
            with open(settings.FALLBACK_EVENTS_FILE, "a", encoding="utf-8") as fh:
                fh.write(json.dumps(payload) + "\n")
            return True
        except Exception as e:
            logger.error("Fallback write failed: %s", e)
            return False

producer = EventProducer()
