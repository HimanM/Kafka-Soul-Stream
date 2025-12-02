import asyncio
import json
import os
import random
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
CONSUME_TOPIC = os.getenv('CONSUME_TOPIC', 'judgments')
PRODUCE_TOPIC = os.getenv('PRODUCE_TOPIC', 'ascensions')

async def place_soul(judgment):
    print(f"Placing Soul: {judgment.get('soul_name')}")
    await asyncio.sleep(2)
    
    destinations = ["The Void", "Circle of Greed", "Eternal Flame", "Frozen Lake", "Digital Purgatory"]
    destination = random.choice(destinations)
    
    return {
        "contract_id": judgment.get('contract_id'),
        "soul_name": judgment.get('soul_name'),
        "verdict": judgment.get('verdict'),
        "final_destination": destination,
        "status": "SEALED"
    }

async def consume():
    consumer = AIOKafkaConsumer(
        CONSUME_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="limbo-group"
    )
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS
    )

    await consumer.start()
    await producer.start()
    print(f"Limbo Service Started. Listening on {CONSUME_TOPIC}, Producing to {PRODUCE_TOPIC}")

    try:
        async for msg in consumer:
            print(f"LIMBO CONSUMER RECEIVED: {msg.topic}")
            try:
                judgment_data = json.loads(msg.value.decode('utf-8'))
                print(f"Received Judgment: {judgment_data}")
                
                # Only process if not PURE (just kidding, we take all souls)
                placement_result = await place_soul(judgment_data)
                
                # Produce ascension event
                placement_json = json.dumps(placement_result).encode('utf-8')
                await producer.send_and_wait(PRODUCE_TOPIC, placement_json)
                print(f"Soul Placed: {placement_result}")
                
            except Exception as e:
                print(f"Error processing message: {e}")
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == "__main__":
    asyncio.run(consume())
