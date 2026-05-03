from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta

from app.db.database import get_db
from app.models.membership import Membership
from app.models.user import User
from app.api.deps import get_current_active_user
from app.schemas.membership import MembershipResponse, MembershipCreate, MembershipUpdate
from app.services.log_service import create_log
from typing import List

router = APIRouter()

# Üyelik planları
MEMBERSHIP_PLANS = {
    "free": {
        "name": "Free",
        "monthly_price": 0,
        "annual_price": 0,
        "description": "Temel özellikler - Sınırsız firma profili taraması",
        "features": ["Firma analizi", "PDF rapor oluştur", "Temel AI analiz"]
    },
    "basic": {
        "name": "Basic",
        "monthly_price": 99,
        "annual_price": 990,
        "description": "Gelişmiş özellikler - Akıllı AI analiz ve raporlama",
        "features": ["Tüm Free özellikler", "Gelişmiş AI Analiz", "Otomatik OCR", "Sunum (PPT) oluştur", "Öncelikli destek"]
    },
    "premium": {
        "name": "Premium",
        "monthly_price": 299,
        "annual_price": 2990,
        "description": "Kurumsal çözüm - Sınırsız erişim ve API",
        "features": ["Tüm Basic özellikler", "API Erişimi", "Özel hesap yöneticisi", "Kurumsal raporlama", "Veri dışa aktarma"]
    }
}

@router.get("/plans")
async def get_membership_plans():
    """
    Tüm üyelik planlarını getir
    """
    return {
        "plans": MEMBERSHIP_PLANS,
        "currency": "TRY"
    }

@router.get("/membership", response_model=MembershipResponse)
async def get_user_membership(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mevcut kullanıcının üyelik bilgisini getir
    """
    result = await db.execute(
        select(Membership).filter(Membership.user_id == current_user.id)
        .order_by(Membership.created_at.desc())
    )
    membership = result.scalars().first()
    
    if not membership:
        # Üyelik yoksa free varsayılan oluştur
        new_membership = Membership(
            user_id=current_user.id,
            plan_type="free",
            monthly_price=0,
            annual_price=0,
            description="Free plan"
        )
        db.add(new_membership)
        await db.commit()
        await db.refresh(new_membership)
        return new_membership
    
    return membership

@router.post("/membership/upgrade", response_model=MembershipResponse)
async def upgrade_membership(
    plan_type: str,
    billing_period: str = "monthly",  # monthly or annual
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Üyelik seviyesini yükselt
    """
    if plan_type not in MEMBERSHIP_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan type")
    
    plan = MEMBERSHIP_PLANS[plan_type]
    
    # Eski üyeliği güncelle veya yeni oluştur
    result = await db.execute(
        select(Membership).filter(Membership.user_id == current_user.id)
        .order_by(Membership.created_at.desc())
    )
    membership = result.scalars().first()
    
    if membership:
        membership.plan_type = plan_type
        membership.monthly_price = plan["monthly_price"]
        membership.annual_price = plan["annual_price"]
        membership.is_active = True
        
        # Expiry tarihini belirle
        if billing_period == "monthly":
            membership.expires_at = datetime.now() + timedelta(days=30)
        else:
            membership.expires_at = datetime.now() + timedelta(days=365)
    else:
        membership = Membership(
            user_id=current_user.id,
            plan_type=plan_type,
            monthly_price=plan["monthly_price"],
            annual_price=plan["annual_price"],
            is_active=True,
            expires_at=datetime.now() + (timedelta(days=30) if billing_period == "monthly" else timedelta(days=365))
        )
        db.add(membership)
    
    await db.commit()
    await db.refresh(membership)
    
    # Log yaz
    await create_log(
        db,
        "MEMBERSHIP_UPGRADED",
        {"plan_type": plan_type, "billing_period": billing_period, "price": plan[f"{billing_period}_price"]},
        user_id=current_user.id
    )
    
    return membership

@router.post("/membership/downgrade", response_model=MembershipResponse)
async def downgrade_membership(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Üyeliği free plana indirge
    """
    result = await db.execute(
        select(Membership).filter(Membership.user_id == current_user.id)
        .order_by(Membership.created_at.desc())
    )
    membership = result.scalars().first()
    
    if membership:
        membership.plan_type = "free"
        membership.is_active = True
        membership.expires_at = None
    else:
        membership = Membership(
            user_id=current_user.id,
            plan_type="free",
            is_active=True
        )
        db.add(membership)
    
    await db.commit()
    await db.refresh(membership)
    
    # Log yaz
    await create_log(
        db,
        "MEMBERSHIP_DOWNGRADED",
        {"plan_type": "free"},
        user_id=current_user.id
    )
    
    return membership

@router.get("/memberships", response_model=List[MembershipResponse])
async def get_all_memberships(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Tüm üyelikleri getir (Admin only)
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can view all memberships")
    
    result = await db.execute(select(Membership))
    memberships = result.scalars().all()
    return memberships
