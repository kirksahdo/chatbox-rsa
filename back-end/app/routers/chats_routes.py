from fastapi import APIRouter, Depends
import models, schemas, auth
from database import get_db
from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_
from collections import defaultdict

router = APIRouter()


# Obter mensagens recebidas
@router.get("/chats")
def get_messages(
    db: Session = Depends(get_db), token: str = Depends(auth.decode_access_token)
):
    sender_id = token["id"]

    group = aliased(models.Group)

    # Get All Groups that user is member
    groups = (
        db.query(models.GroupUser, group)
        .join(group, group.id == models.GroupUser.group_id)
        .filter(models.GroupUser.user_id == sender_id)
        .all()
    )

    user_groups_ids = [group[1].id for group in groups]

    # Get All Groups Messages from User
    # Join Aliased
    sender_user = aliased(models.User)
    recipient_user = aliased(models.User)

    user_messages_groups = (
        db.query(models.GroupMessage, sender_user.username.label("sender_username"))
        .join(sender_user, models.GroupMessage.sender_id == sender_user.id)
        .filter(models.GroupMessage.group_id.in_(user_groups_ids))
        .all()
    )

    # Dict for Groups Messages
    chats_groups_dict = defaultdict(lambda: {"messages": []})

    # Separate Group Messages by ID
    for message in user_messages_groups:
        chats_groups_dict[message[0].group_id]["messages"].append(
            schemas.MessageDTO(
                id=message[0].id,
                encrypted_message=message[0].encrypted_message,
                recipient_id=message[0].group_id,
                sender_encrypted_message=message[0].encrypted_message,
                sender_id=message[0].sender_id,
                sender_username=message[1],
                timestamp=message[0].timestamp,
                message=message[0].encrypted_message,
                status="",
            )
        )

    group_chats = [
        schemas.ChatDTO(
            recipient_id=group[1].id,
            recipient_username=group[1].name,
            recipient_public_key=group[0].crypted_key,
            recipient_profile_image=group[1].profile_image,
            messages=chats_groups_dict[group[1].id]["messages"],
            is_group=True,
        )
        for group in groups
    ]

    chats_dict = defaultdict(lambda: {"messages": []})

    # Get Single Messages
    messages = (
        db.query(
            models.Message.id,
            models.Message.timestamp,
            models.Message.sender_id,
            models.Message.recipient_id,
            models.Message.encrypted_message,
            models.Message.sender_encrypted_message,
            models.Message.status,
            sender_user.username.label("sender_username"),
        )
        .join(
            sender_user, models.Message.sender_id == sender_user.id
        )  # JOIN com remetente
        .join(
            recipient_user, models.Message.recipient_id == recipient_user.id
        )  # JOIN com destinatário
        .filter(
            or_(
                models.Message.sender_id == sender_id,
                models.Message.recipient_id == sender_id,
            )
        )
        .all()
    )

    for message in messages:
        recipient_id = (
            message.recipient_id
            if message.recipient_id != sender_id
            else message.sender_id
        )
        chats_dict[recipient_id]["messages"].append(
            schemas.MessageDTO.model_validate(message)
        )

    user_ids = list(chats_dict.keys())
    recipients = db.query(models.User).filter(models.User.id.in_(user_ids)).all()

    chats = [
        schemas.ChatDTO(
            recipient_id=user.id,
            recipient_username=user.username,
            recipient_public_key=user.public_key,
            recipient_profile_image=user.profile_image,
            messages=chats_dict[user.id]["messages"],
            is_group=False,
        )
        for user in recipients
    ]

    return chats + group_chats
