from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import user_routes, messages_routes, chats_routes, groups_routes


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

app.include_router(user_routes.router, prefix="", tags=["users"])
app.include_router(messages_routes.router, prefix="", tags=["messages"])
app.include_router(groups_routes.router, prefix="", tags=["groups"])
app.include_router(chats_routes.router, prefix="", tags=["chats"])
