from fastapi import APIRouter
from app.api.endpoints import auth, firms, analysis, premium, notifications, logs, reports, membership

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(firms.router, prefix="/firms", tags=["firms"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(premium.router, prefix="/premium", tags=["premium"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(logs.router, prefix="/system", tags=["system"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(membership.router, prefix="/membership", tags=["membership"])
