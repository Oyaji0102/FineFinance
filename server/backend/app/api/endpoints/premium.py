from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.database import get_db
from app.models.premium_request import PremiumRequest
from app.models.user import User
from app.schemas.premium_request import PremiumRequestCreate, PremiumRequestResponse
from app.api.deps import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.post("/request", response_model=PremiumRequestResponse)
async def request_premium_package(
    req: PremiumRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    T6: Kullanıcının Premium özellik talebi oluşturması.
    """
    if current_user.is_premium_active:
        raise HTTPException(status_code=400, detail="Zaten aktif bir premium paketiniz bulunuyor.")
        
    db_request = PremiumRequest(user_id=current_user.id, package_name=req.package_name)
    db.add(db_request)
    await db.commit()
    await db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=List[PremiumRequestResponse])
async def list_premium_requests(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    T6: Adminin bekleyen satın alma taleplerini listelemesi. (Bildirim ekranı için)
    """
    result = await db.execute(select(PremiumRequest).filter(PremiumRequest.status == "pending"))
    requests = result.scalars().all()
    return requests

@router.put("/approve/{request_id}", response_model=PremiumRequestResponse)
async def approve_premium_request(
    request_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    T6: Adminin satın alma talebini onaylayıp kullanıcının yetkilerini açması.
    """
    result = await db.execute(select(PremiumRequest).filter(PremiumRequest.id == request_id))
    db_request = result.scalars().first()
    
    if not db_request:
        raise HTTPException(status_code=404, detail="Talep bulunamadı.")
        
    if db_request.status != "pending":
        raise HTTPException(status_code=400, detail="Bu talep halihazırda onaylanmış veya reddedilmiş.")
        
    # Talebi onaylandı olarak işaretle
    db_request.status = "approved"
    db.add(db_request)
    
    # Talebi gönderen kullanıcının premium flag'ini True yap
    user_result = await db.execute(select(User).filter(User.id == db_request.user_id))
    user = user_result.scalars().first()
    if user:
        user.is_premium_active = True
        db.add(user)
        
    await db.commit()
    await db.refresh(db_request)
    return db_request
