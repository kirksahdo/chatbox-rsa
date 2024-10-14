from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    public_key: str
    encrypted_private_key: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenLogin(BaseModel):
    token: str

class MessageCreate(BaseModel):
    recipient_id: int
    encrypted_message: str

class WebSocketMessage(BaseModel):
    message: str  # Mensagem do WebSocket

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    encrypted_message: str
    timestamp: datetime

    class Config:
        orm_mode = True
