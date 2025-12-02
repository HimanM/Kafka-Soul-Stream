import asyncio
import json
import os
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
CONSUME_TOPIC = os.getenv('CONSUME_TOPIC', 'payments')
PRODUCE_TOPIC = os.getenv('PRODUCE_TOPIC', 'shipments')

async def ship_order(payment):
    print(f"Shipping Order for Payment: {payment}")
    # Mock shipping logic
    await asyncio.sleep(1)
    return {
        "order_id": payment.get('order_id'),
        "status": "SHIPPED",
        "tracking_number": "TRACK-12345"
    }

async def consume():
    consumer = AIOKafkaConsumer(
        CONSUME_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="shipping-group"
    )
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS
    )

    await consumer.start()
    await producer.start()
    print("Shipping Service Started")

    try:
        async for msg in consumer:
            try:
                payment_data = json.loads(msg.value.decode('utf-8'))
                print(f"Received Payment Info: {payment_data}")
                
                if payment_data.get('status') == 'SUCCESS':
                    shipping_result = await ship_order(payment_data)
                    
                    # Produce shipping event
                    shipping_json = json.dumps(shipping_result).encode('utf-8')
                    await producer.send_and_wait(PRODUCE_TOPIC, shipping_json)
                    print(f"Shipping Processed and Sent: {shipping_result}")
                else:
                    print("Payment failed, skipping shipping.")
                
            except Exception as e:
                print(f"Error processing message: {e}")
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == "__main__":
    asyncio.run(consume())
