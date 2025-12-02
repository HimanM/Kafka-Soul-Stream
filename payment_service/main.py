import asyncio
import json
import os
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
CONSUME_TOPIC = os.getenv('CONSUME_TOPIC', 'orders')
PRODUCE_TOPIC = os.getenv('PRODUCE_TOPIC', 'payments')

async def process_payment(order):
    print(f"Processing payment for Order ID: {order.get('user_id')}") # Using user_id as proxy for ID for now
    # Mock payment processing logic
    await asyncio.sleep(1) # Simulate delay
    return {
        "order_id": order.get('user_id'), # Simplified
        "status": "SUCCESS",
        "amount": order.get('total_amount')
    }

async def consume():
    consumer = AIOKafkaConsumer(
        CONSUME_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="payment-group"
    )
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS
    )

    await consumer.start()
    await producer.start()
    print("Payment Service Started")

    try:
        async for msg in consumer:
            try:
                order_data = json.loads(msg.value.decode('utf-8'))
                print(f"Received Order: {order_data}")
                
                payment_result = await process_payment(order_data)
                
                payment_json = json.dumps(payment_result).encode('utf-8')
                await producer.send_and_wait(PRODUCE_TOPIC, payment_json)
                print(f"Payment Processed and Sent: {payment_result}")
                
            except Exception as e:
                print(f"Error processing message: {e}")
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == "__main__":
    asyncio.run(consume())
