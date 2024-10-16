from pydantic import BaseModel, ConfigDict
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    public_key: str
    encrypted_private_key: str

class UserLogin(BaseModel):
    username: str
    password: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    encrypted_message: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class UserDTO(BaseModel):
    id: int
    username: str
    public_key: str

    model_config = ConfigDict(from_attributes=True)

class TokenLogin(BaseModel):
    token: str

class MessageCreate(BaseModel):
    recipient_id: int
    encrypted_message: str

class WebSocketMessage(BaseModel):
    message: str  # Mensagem do WebSocket


class MessageDTO(BaseModel):
    id: int
    recipient_id: int
    sender_id: int
    encrypted_message: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class ChatDTO(BaseModel):
    recipient_id: int
    recipient_username: str
    recipient_public_key: str
    messages: list[MessageDTO]

    model_config = ConfigDict(from_attributes=True)