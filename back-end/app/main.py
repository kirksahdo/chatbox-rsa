from fastapi import FastAPI, WebSocket, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, aliased
from sqlalchemy import and_, or_
from sqlalchemy.exc import IntegrityError
import models, schemas, auth
from database import engine, get_db
from datetime import timedelta
from collections import defaultdict


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients = []


# WebSocket para comunicação em tempo real
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, token=str):
    _ = auth.decode_access_token(token)
    await websocket.accept()
    print("Accepted websocket connection")
    connected_clients.append({"user_id": user_id, "socket": websocket})
    print(connected_clients)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
    except Exception as e:
        print(f"Erro: {e}")
    finally:
        connected_clients.remove({"user_id": user_id, "socket": websocket})
        print("Remove client")


async def send_message_to_user(
    user_id: int, sender_id: int, message: str, sender_message, group_id: int = None
):
    for client in connected_clients:
        if client["user_id"] == user_id:
            await client["socket"].send_json(
                {
                    "sender_id": sender_id,
                    "message": message,
                    "sender_message": sender_message,
                    "group_id": group_id,
                }
            )


# Cadastro de usuário
@app.post("/register/")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = auth.get_password_hash(user.password)

    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        public_key=user.public_key,
        encrypted_private_key=user.encrypted_private_key,
        profile_image=user.profile_image,
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="This username is already in use")

    return {"msg": "User registered successfully"}


# Login de usuário
@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.User).filter(models.User.username == user.username).first()
    )
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"id": db_user.id}, expires_delta=access_token_expires
    )

    return {
        "id": db_user.id,
        "username": db_user.username,
        "publicKey": db_user.public_key,
        "encryptedPrivateKey": db_user.encrypted_private_key,
        "profileImage": db_user.profile_image,
        "token": access_token,
    }


@app.post("/token/")
def token(user: schemas.TokenLogin, db: Session = Depends(get_db)):

    user_token = auth.decode_access_token(token=user.token)
    db_user = db.query(models.User).filter(models.User.id == user_token["id"]).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid user token")

    return {
        "id": db_user.id,
        "username": db_user.username,
        "publicKey": db_user.public_key,
        "encryptedPrivateKey": db_user.encrypted_private_key,
        "profileImage": db_user.profile_image,
        "token": user.token,
    }


# Envio de mensagens com WebSocket (armazenamento no SQLite)
@app.post("/messages/")
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

    new_message = models.Message(
        sender_id=db_user.id,
        recipient_id=message.recipient_id,
        encrypted_message=message.encrypted_message,
        sender_encrypted_message=message.sender_encrypted_message,
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
@app.get("/messages/{recipient_id}")
def get_messages(
    recipient_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    db_user_id = token["id"]

    messages = (
        db.query(models.Message)
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

    return messages


# Obter mensagens recebidas
@app.get("/chats")
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


@app.get("/users")
def get_users(
    name: str = "",
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    users = (
        db.query(models.User)
        .filter(
            and_(models.User.username.contains(name), models.User.id != token["id"])
        )
        .all()
    )

    return [schemas.UserDTO.model_validate(user) for user in users]


@app.get("/user/{id}")
def get_users(
    id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return schemas.UserDTO.model_validate(user)


@app.post("/groups/")
def create_group(
    group: schemas.CreateGroup,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):

    new_group = models.Group(name=group.name, profile_image=group.profile_image)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    for user in group.users:
        new_group_user = models.GroupUser(
            user_id=user.id, group_id=new_group.id, crypted_key=user.crypted_key
        )
        db.add(new_group_user)
    db.commit()

    return {"msg": "Created new group"}


@app.post("/groups/messages")
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


@app.get("/groups/session/{group_id}")
def get_users(
    group_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    user_id = token["id"]

    user_group = (
        db.query(models.GroupUser)
        .filter(
            and_(
                models.GroupUser.group_id == group_id,
                models.GroupUser.user_id == user_id,
            )
        )
        .first()
    )

    if not user_group:
        raise HTTPException(status_code=404, detail="User not found in group")

    return user_group.crypted_key


@app.get("/groups/{group_id}")
def get_group_by_id(
    group_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):

    user = aliased(models.User)

    # Get Group
    group = (
        db.query(models.Group)
        .filter(
            and_(
                models.Group.id == group_id,
            )
        )
        .first()
    )

    if not group:
        raise HTTPException(status_code=404, detail="User not found in group")

    # Get Users
    users = (
        db.query(models.GroupUser, user)
        .join(user, user.id == models.GroupUser.user_id)
        .filter(models.GroupUser.group_id == group.id)
        .all()
    )

    return schemas.GroupDTO(
        id=group.id,
        name=group.name,
        profile_image=group.profile_image,
        users=[schemas.UserDTO.model_validate(user[1]) for user in users],
    )
