from fastapi import APIRouter
from app.api.endpoints import auth, firms

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(firms.router, prefix="/firms", tags=["firms"])
