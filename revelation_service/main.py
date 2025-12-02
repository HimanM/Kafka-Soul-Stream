import asyncio
import json
import os
import random
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
CONSUME_TOPIC = os.getenv('CONSUME_TOPIC', 'ascensions')
PRODUCE_TOPIC = os.getenv('PRODUCE_TOPIC', 'revelations')

async def reveal_fate(ascension_data):
    print(f"Revealing Fate for: {ascension_data.get('soul_name')}")
    await asyncio.sleep(3)
    
    destination = ascension_data.get('final_destination')
    soul_name = ascension_data.get('soul_name')
    verdict = ascension_data.get('verdict', 'UNKNOWN')
    
    dramatic_text = f"{soul_name} HAS BEEN JUDGED {verdict}"

    if "Void" in destination:
        dramatic_text = f"{soul_name} IS LOST FOREVER IN THE VOID ({verdict})"
    elif "Greed" in destination:
        dramatic_text = f"{soul_name} SHALL COUNT COINS OF ASH FOR ETERNITY ({verdict})"
    elif "Flame" in destination:
        dramatic_text = f"{soul_name} BURNS WITH THE SINS OF A THOUSAND SUNS ({verdict})"
    elif "Frozen" in destination:
        dramatic_text = f"{soul_name} IS TRAPPED IN ETERNAL GLACIAL SILENCE ({verdict})"
    elif "Digital" in destination:
        dramatic_text = f"{soul_name} IS FRAGMENTED INTO INFINITE BITS OF PAIN ({verdict})"
    
    return {
        "contract_id": ascension_data.get('contract_id'),
        "soul_name": soul_name,
        "final_verdict": dramatic_text,
        "destination": destination,
        "verdict": verdict,
        "status": "REVEALED"
    }

async def consume():
    consumer = AIOKafkaConsumer(
        CONSUME_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="revelation-group"
    )
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS
    )

    await consumer.start()
    await producer.start()
    print(f"Revelation Service Started. Listening on {CONSUME_TOPIC}, Producing to {PRODUCE_TOPIC}")

    try:
        async for msg in consumer:
            print(f"REVELATION CONSUMER RECEIVED: {msg.topic}")
            try:
                ascension_data = json.loads(msg.value.decode('utf-8'))
                print(f"Received Ascension: {ascension_data}")
                
                revelation_result = await reveal_fate(ascension_data)
                
                revelation_json = json.dumps(revelation_result).encode('utf-8')
                await producer.send_and_wait(PRODUCE_TOPIC, revelation_json)
                print(f"Fate Revealed: {revelation_result}")
                
            except Exception as e:
                print(f"Error processing message: {e}")
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == "__main__":
    asyncio.run(consume())
