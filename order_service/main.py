from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import asyncio
import json
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from contextlib import asynccontextmanager
import os
from typing import List
import random

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'orders')
KAFKA_PAYMENTS_TOPIC = 'payments'
KAFKA_SHIPMENTS_TOPIC = 'shipments'

# Global Producer
producer = None

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

async def consume_events():
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC, KAFKA_PAYMENTS_TOPIC, KAFKA_SHIPMENTS_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="monitor-group"
    )
    await consumer.start()
    try:
        async for msg in consumer:
            event_type = msg.topic
            data = json.loads(msg.value.decode('utf-8'))
            message = json.dumps({
                "type": event_type,
                "data": data
            })
            await manager.broadcast(message)
    finally:
        await consumer.stop()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global producer
    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)
    await producer.start()
    print("Kafka Producer started")
    
    # Start consumer task
    asyncio.create_task(consume_events())
    
    yield
    await producer.stop()
    print("Kafka Producer stopped")

app = FastAPI(lifespan=lifespan)

class Order(BaseModel):
    user_name: str
    items: list
    total_amount: float

def generate_address():
    streets = ["Maple St", "Oak Ave", "Pine Ln", "Cedar Blvd", "Elm Dr"]
    cities = ["New York", "San Francisco", "Austin", "Seattle", "Boston"]
    return f"{random.randint(100, 999)} {random.choice(streets)}, {random.choice(cities)}"

@app.post("/orders")
async def create_order(order: Order):
    if not producer:
        raise HTTPException(status_code=500, detail="Kafka producer not initialized")
    
    order_data = order.dict()
    order_data['order_id'] = str(random.randint(10000, 99999))
    order_data['status'] = 'PENDING'
    order_data['shipping_address'] = generate_address()
    
    # Serialize to JSON
    value_json = json.dumps(order_data).encode('utf-8')
    
    try:
        await producer.send_and_wait(KAFKA_TOPIC, value_json)
        return {"message": "Order created successfully", "order": order_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": "Order Service is running"}
