from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func
from datetime import datetime, timedelta

from app.db.database import get_db
from app.models.log import SystemLog
from app.models.user import User
from app.api.deps import get_current_active_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class LogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action_type: str
    details: Optional[dict]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/logs", response_model=List[LogResponse])
async def get_logs(
    action_type: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin paneli için system loglarını getir.
    Sadece admin kullanıcıları erişebilir.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can view logs")
    
    query = select(SystemLog).order_by(desc(SystemLog.created_at))
    
    if action_type:
        query = query.filter(SystemLog.action_type == action_type)
    
    query = query.limit(limit).offset(offset)
    
    result = await db.execute(query)
    logs = result.scalars().all()
    return logs

@router.get("/logs/stats")
async def get_logs_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Log istatistikleri (bugün, bu hafta vb.)
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can view logs")
    
    # Bugün
    today = datetime.now().date()
    today_start = datetime.combine(today, datetime.min.time())
    
    # Bu hafta
    week_start = datetime.now() - timedelta(days=7)
    
    # This month
    month_start = datetime.now() - timedelta(days=30)
    
    query_today = select(func.count(SystemLog.id)).filter(SystemLog.created_at >= today_start)
    query_week = select(func.count(SystemLog.id)).filter(SystemLog.created_at >= week_start)
    query_month = select(func.count(SystemLog.id)).filter(SystemLog.created_at >= month_start)
    
    result_today = await db.execute(query_today)
    result_week = await db.execute(query_week)
    result_month = await db.execute(query_month)
    
    count_today = result_today.scalar() or 0
    count_week = result_week.scalar() or 0
    count_month = result_month.scalar() or 0
    
    # İşlem türlerine göre breakdown
    query_types = select(SystemLog.action_type, func.count(SystemLog.id)).group_by(SystemLog.action_type)
    result_types = await db.execute(query_types)
    type_stats = {row[0]: row[1] for row in result_types.all()}
    
    return {
        "today": count_today,
        "week": count_week,
        "month": count_month,
        "by_type": type_stats
    }

@router.get("/logs/{log_id}", response_model=LogResponse)
async def get_log_detail(
    log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Belirli bir logun detayını getir
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can view logs")
    
    result = await db.execute(select(SystemLog).filter(SystemLog.id == log_id))
    log = result.scalars().first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    return log
