from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, BLOB
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    public_key = Column(String)
    encrypted_private_key = Column(String)
    profile_image = Column(BLOB)

    sent_messages = relationship(
        "Message", foreign_keys="[Message.sender_id]", back_populates="sender"
    )
    received_messages = relationship(
        "Message", foreign_keys="[Message.recipient_id]", back_populates="recipient"
    )

    sender_group_messages = relationship(
        "GroupMessage", foreign_keys="[GroupMessage.sender_id]", back_populates="sender"
    )
    user_groups = relationship(
        "GroupUser", foreign_keys="[GroupUser.user_id]", back_populates="user"
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    encrypted_message = Column(String)
    sender_encrypted_message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    sender = relationship(
        "User", foreign_keys=[sender_id], back_populates="sent_messages"
    )
    recipient = relationship(
        "User", foreign_keys=[recipient_id], back_populates="received_messages"
    )


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    profile_image = Column(BLOB)
    timestamp = Column(DateTime, default=datetime.utcnow)

    group_messages = relationship(
        "GroupMessage", foreign_keys="[GroupMessage.group_id]", back_populates="group"
    )
    group_users = relationship(
        "GroupUser", foreign_keys="[GroupUser.group_id]", back_populates="group"
    )


class GroupMessage(Base):
    __tablename__ = "group_messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    encrypted_message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    sender = relationship(
        "User", foreign_keys=[sender_id], back_populates="sender_group_messages"
    )
    group = relationship(
        "Group", foreign_keys=[group_id], back_populates="group_messages"
    )


class GroupUser(Base):
    __tablename__ = "group_users"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    crypted_key = Column(String)

    user = relationship("User", back_populates="user_groups")
    group = relationship("Group", back_populates="group_users")
