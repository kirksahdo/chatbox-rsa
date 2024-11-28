from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, auth
from sqlalchemy.exc import IntegrityError
from datetime import timedelta
from database import get_db
from sqlalchemy import and_

router = APIRouter()


# Cadastro de usuário
@router.post("/register/")
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
@router.post("/login/")
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


@router.post("/token/")
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


@router.get("/users")
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


@router.get("/user/{id}")
def get_users(
    id: int,
    db: Session = Depends(get_db),
    token: str = Depends(auth.decode_access_token),
):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return schemas.UserDTO.model_validate(user)
