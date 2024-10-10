from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import models, schemas, auth
from database import engine, get_db
from datetime import timedelta

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

connected_clients = []

# WebSocket para comunicação em tempo real
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
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

async def send_message_to_user(user_id: int, sender_id: int, message: str):
    for client in connected_clients:
        if client["user_id"] == user_id:
            await client["socket"].send_json({
                "sender_id": sender_id,
                "message": message
            })
            break

# Cadastro de usuário
@app.post("/register/")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = auth.get_password_hash(user.password)
    
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        public_key=user.public_key,
        encrypted_private_key=user.encrypted_private_key
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"msg": "User registered successfully"}

# Login de usuário
@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

# Envio de mensagens com WebSocket (armazenamento no SQLite)
@app.post("/messages/")
async def send_message(message: schemas.MessageCreate, db: Session = Depends(get_db), token: str = Depends(auth.decode_access_token)):
    db_user = db.query(models.User).filter(models.User.username == token['sub']).first()
    
    recipient = db.query(models.User).filter(models.User.id == message.recipient_id).first()
    
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    new_message = models.Message(
        sender_id=db_user.id,
        recipient_id=message.recipient_id,
        encrypted_message=message.encrypted_message
    )
    
    db.add(new_message)
    db.commit()

    await send_message_to_user(message.recipient_id, db_user.id, message.encrypted_message)
    
    return {"msg": "Message sent"}

# Obter mensagens recebidas
@app.get("/messages/{recipient_id}")
def get_messages(recipient_id: int, db: Session = Depends(get_db), token: str = Depends(auth.decode_access_token)):
    db_user_id = db.query(models.User).filter(models.User.username == token['sub']).first().id
    
    messages = db.query(models.Message).filter(or_
        (and_(models.Message.recipient_id == recipient_id, models.Message.sender_id == db_user_id),
        and_(models.Message.recipient_id == db_user_id, models.Message.sender_id == recipient_id))).all()
    
    return messages
