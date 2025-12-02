from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import asyncio
import json
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from contextlib import asynccontextmanager
import os
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'contracts')
KAFKA_JUDGMENTS_TOPIC = 'judgments'
KAFKA_ASCENSIONS_TOPIC = 'ascensions'
KAFKA_REVELATIONS_TOPIC = 'revelations'

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
        KAFKA_TOPIC, KAFKA_JUDGMENTS_TOPIC, KAFKA_ASCENSIONS_TOPIC, KAFKA_REVELATIONS_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="soul-monitor-group"
    )
    await consumer.start()
    print(f"Contract Consumer started on topics: {KAFKA_TOPIC}, {KAFKA_JUDGMENTS_TOPIC}, {KAFKA_ASCENSIONS_TOPIC}, {KAFKA_REVELATIONS_TOPIC}")
    try:
        async for msg in consumer:
            print(f"CONSUMER RECEIVED: {msg.topic} - {msg.value}")
            event_type = msg.topic
            data = json.loads(msg.value.decode('utf-8'))
            message = json.dumps({
                "type": event_type,
                "data": data
            })
            await manager.broadcast(message)
            print(f"BROADCASTED: {message}")
    except Exception as e:
        print(f"CONSUMER ERROR: {e}")
    finally:
        await consumer.stop()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global producer
    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)
    await producer.start()
    print("Contract Producer started")
    
    # Start consumer task
    asyncio.create_task(consume_events())
    
    yield
    await producer.stop()
    print("Contract Producer stopped")

# FastAPI Setup and CORS Configuration
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoulContract(BaseModel):
    soul_name: str
    sin_level: int = 0

@app.post("/contracts")
async def sign_contract(contract: SoulContract):
    if not producer:
        raise HTTPException(status_code=500, detail="Kafka producer not initialized")
    
    contract_data = contract.dict()
    contract_data['contract_id'] = f"666-{random.randint(1000, 9999)}"
    contract_data['status'] = 'SIGNED'
    
    # Serialize to JSON
    value_json = json.dumps(contract_data).encode('utf-8')
    
    try:
        await producer.send_and_wait(KAFKA_TOPIC, value_json)
        return {"message": "Soul Contract Signed", "contract": contract_data}
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
    return {"message": "Contract Service is running"}
