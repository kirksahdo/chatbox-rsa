from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from sqlalchemy.orm import Session, aliased
from sqlalchemy import and_, or_

router = APIRouter()


@router.post("/groups/")
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


@router.get("/groups/session/{group_id}")
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


@router.get("/groups/{group_id}")
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