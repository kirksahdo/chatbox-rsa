from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str
    public_key: str
    encrypted_private_key: str
    profile_image: bytes


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
    profile_image: bytes
    model_config = ConfigDict(from_attributes=True)


class TokenLogin(BaseModel):
    token: str


class MessageCreate(BaseModel):
    recipient_id: int
    encrypted_message: str
    sender_encrypted_message: str


class WebSocketMessage(BaseModel):
    message: str  # Mensagem do WebSocket


class MessageDTO(BaseModel):
    id: int
    sender_id: int
    sender_username: str
    encrypted_message: str
    recipient_id: Optional[int] = None
    sender_encrypted_message: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatDTO(BaseModel):
    recipient_id: int
    recipient_username: str
    recipient_public_key: str
    recipient_profile_image: bytes
    messages: list[MessageDTO]
    is_group: bool
    model_config = ConfigDict(from_attributes=True)


class UserGroup(BaseModel):
    id: int
    crypted_key: str


class CreateGroup(BaseModel):
    name: str
    users: list[UserGroup]
    profile_image: bytes


class GroupMessageCreate(BaseModel):
    group_id: int
    encrypted_message: str


class GroupDTO(BaseModel):
    id: int
    name: str
    profile_image: bytes
    users: list[UserDTO]

    model_config = ConfigDict(from_attributes=True)
