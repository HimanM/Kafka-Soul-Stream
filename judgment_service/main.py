import asyncio
import json
import os
import random
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
CONSUME_TOPIC = os.getenv('CONSUME_TOPIC', 'contracts')
PRODUCE_TOPIC = os.getenv('PRODUCE_TOPIC', 'judgments')

async def judge_soul(contract):
    print(f"Judging Soul: {contract.get('soul_name')}")
    await asyncio.sleep(2) # Dramatic pause
    
    verdicts = ["GUILTY", "PURE", "CORRUPTED", "LOST", "DAMNED"]
    verdict = random.choice(verdicts)
    
    return {
        "contract_id": contract.get('contract_id'),
        "soul_name": contract.get('soul_name'),
        "verdict": verdict,
        "soul_value": random.randint(1, 1000)
    }

async def consume():
    consumer = AIOKafkaConsumer(
        CONSUME_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="judgment-group"
    )
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS
    )

    await consumer.start()
    await producer.start()
    print(f"Judgment Service Started. Listening on {CONSUME_TOPIC}, Producing to {PRODUCE_TOPIC}")

    try:
        async for msg in consumer:
            print(f"JUDGMENT CONSUMER RECEIVED: {msg.topic}")
            try:
                contract_data = json.loads(msg.value.decode('utf-8'))
                print(f"Received Contract: {contract_data}")
                
                judgment_result = await judge_soul(contract_data)
                
                judgment_json = json.dumps(judgment_result).encode('utf-8')
                await producer.send_and_wait(PRODUCE_TOPIC, judgment_json)
                print(f"Judgment Rendered: {judgment_result}")
                
            except Exception as e:
                print(f"Error processing message: {e}")
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == "__main__":
    asyncio.run(consume())
