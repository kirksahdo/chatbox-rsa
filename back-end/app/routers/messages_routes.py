from fastapi import APIRouter, Depends, WebSocket, HTTPException
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from sqlalchemy.orm import Session, aliased
from sqlalchemy import and_, or_

router = APIRouter()

connected_clients = []


async def send_status_to_users(user_id: int, status: str):
    for client in connected_clients:
        if client["user_id"] != user_id:
            await client["socket"].send_json(
                {"type": "status", "user_id": user_id, "status": status}
            )


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, token=str):
    _ = auth.decode_access_token(token)
    await websocket.accept()
    print("Accepted websocket connection")
    connected_clients.append({"user_id": user_id, "socket": websocket})
    await send_status_to_users(user_id, "online")
    print(connected_clients)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
    except Exception as e:
        print(f"Erro: {e}")
    finally:
        connected_clients.remove({"user_id": user_id, "socket": websocket})
        await send_status_to_users(user_id, "offline")
        print("Remove client")


async def send_message_to_user(
    user_id: int, sender_id: int, message: str, sender_message, group_id: int = None
):
    for client in connected_clients:
        if client["user_id"] == user_id:
            await client["socket"].send_json(
                {
                    "type": "message",
                    "sender_id": sender_id,
                    "message": message,
                    "sender_message": sender_message,
                    "group_id": group_id,
                }
            )


# Get Connected Clients


@router.get("/connected_clients/")
def get_connected_clients(token: str = Depends(auth.decode_access_token)):
    return [
        client["user_id"]
        for client in connected_clients
        if client["user_id"] != token["id"]
    ]


# Envio de mensagens com WebSocket (armazenamento no SQLite)
@router.post("/messages/")
async def send_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    db_user = db.query(models.User).filter(models.User.id == token["id"]).first()

    recipient = (
        db.query(models.User).filter(models.User.id == message.recipient_id).first()
    )

    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    client_is_connected = (
        len(
            [
                client["user_id"]
                for client in connected_clients
                if client["user_id"] == message.recipient_id
            ]
        )
        > 0
    )

    new_message = models.Message(
        sender_id=db_user.id,
        recipient_id=message.recipient_id,
        encrypted_message=message.encrypted_message,
        sender_encrypted_message=message.sender_encrypted_message,
        status="received" if client_is_connected else "sent",
    )

    db.add(new_message)
    db.commit()

    await send_message_to_user(
        message.recipient_id,
        db_user.id,
        message.encrypted_message,
        message.sender_encrypted_message,
    )

    return {"msg": "Message sent"}


# Obter mensagens recebidas
@router.get("/messages/{recipient_id}")
def get_messages(
    recipient_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    db_user_id = token["id"]

    sender_user = aliased(models.User)

    messages = (
        db.query(models.Message, sender_user.username.label("sender_username"))
        .join(sender_user, models.Message.sender_id == sender_user.id)
        .filter(
            or_(
                and_(
                    models.Message.recipient_id == recipient_id,
                    models.Message.sender_id == db_user_id,
                ),
                and_(
                    models.Message.recipient_id == db_user_id,
                    models.Message.sender_id == recipient_id,
                ),
            )
        )
        .all()
    )

    formatted_messages = [
        {
            "id": message[0].id,
            "encrypted_message": message[0].encrypted_message,
            "recipient_id": message[0].recipient_id,
            "sender_encrypted_message": message[0].sender_encrypted_message,
            "sender_id": message[0].sender_id,
            "sender_username": message[1],
            "timestamp": message[0].timestamp,
            "message": message[0].encrypted_message,
            "status": message[0].status,
        }
        for message in messages
    ]

    return formatted_messages


@router.post("/groups/messages")
async def send_group_message(
    message: schemas.GroupMessageCreate,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    db_user = db.query(models.User).filter(models.User.id == token["id"]).first()

    group = db.query(models.Group).filter(models.Group.id == message.group_id).first()
    group_users = (
        db.query(models.GroupUser)
        .filter(models.GroupUser.group_id == message.group_id)
        .all()
    )

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    new_group_message = models.GroupMessage(
        sender_id=db_user.id,
        group_id=group.id,
        encrypted_message=message.encrypted_message,
    )

    db.add(new_group_message)
    db.commit()

    for user in group_users:
        if user.user_id == db_user.id:
            continue

        await send_message_to_user(
            user.user_id,
            db_user.id,
            message.encrypted_message,
            message.encrypted_message,
            group.id,
        )

    return {"msg": "Message sent"}


@router.post("/messages/status")
async def update_messages_status(
    db: Session = Depends(get_db), token: str = Depends(auth.decode_access_token)
):

    user_id = token["id"]

    messages = (
        db.query(models.Message)
        .filter(
            and_(
                models.Message.recipient_id == user_id, models.Message.status == "sent"
            )
        )
        .all()
    )

    senders_ids = set()

    for message in messages:
        senders_ids.add(message.sender_id)
        message.status = "received"

    db.commit()

    print(senders_ids)

    for client in connected_clients:
        if senders_ids.__contains__(client["user_id"]):
            print(client["user_id"])
            await client["socket"].send_json(
                {"type": "message_status_update", "sender_id": user_id}
            )

    return {"msg": "Status updated successfully"}


@router.post("/messages/status/{sender_id}")
async def update_chat_messages_status(
    sender_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):

    user_id = token["id"]

    messages = (
        db.query(models.Message)
        .filter(
            and_(
                models.Message.recipient_id == user_id,
                models.Message.sender_id == sender_id,
                models.Message.status != "read",
            )
        )
        .all()
    )

    for message in messages:
        message.status = "read"

    db.commit()

    for client in connected_clients:
        if client["user_id"] == sender_id:
            await client["socket"].send_json(
                {"type": "message_status_update", "sender_id": user_id}
            )

    return {"msg": "Status updated successfully"}


@router.delete("/groups/user/{group_id}")
def delete_user_from_group(
    group_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    user_id = token["id"]

    db.query(models.GroupUser).filter(
        and_(models.GroupUser.group_id == group_id, models.GroupUser.user_id == user_id)
    ).delete()

    db.commit()

    return {"msg": "User deleted from group"}
