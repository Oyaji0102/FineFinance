from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import io
import csv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.database import get_db
from app.models.firm import Firm
from app.models.user import User
from app.schemas.firm import FirmCreate, FirmUpdate, FirmResponse
from app.api.deps import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.post("/", response_model=FirmResponse)
async def create_firm(
    firm_in: FirmCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Firma oluşturma sadece admin kullanıcılar tarafından yapılabilir.
    db_firm = Firm(**firm_in.model_dump())
    db.add(db_firm)
    await db.commit()
    await db.refresh(db_firm)
    return db_firm

@router.get("/", response_model=List[FirmResponse])
async def read_firms(
    skip: int = 0, limit: int = 100, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Admin ise tümünü görebilir. Normal kullanıcı ise sadece onaylıları/kendi firmasını görebilir.
    # Hackathon MVP'si için basit bir listeleme, detaylandırılabilir.
    query = select(Firm)
    if not current_user.is_admin:
         query = query.filter(Firm.is_approved == True)
         
    result = await db.execute(query.offset(skip).limit(limit))
    firms = result.scalars().all()
    return firms

@router.get("/{firm_id}", response_model=FirmResponse)
async def read_firm(
    firm_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(Firm).filter(Firm.id == firm_id))
    firm = result.scalars().first()
    if not firm:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")
    return firm

# Sadece ADMIN güncelleyebilir / onaylayabilir
@router.put("/{firm_id}", response_model=FirmResponse)
async def update_firm(
    firm_id: int, 
    firm_in: FirmUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user) 
):
    result = await db.execute(select(Firm).filter(Firm.id == firm_id))
    db_firm = result.scalars().first()
    if not db_firm:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")
    
    update_data = firm_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_firm, key, value)
        
    db.add(db_firm)
    await db.commit()
    await db.refresh(db_firm)
    return db_firm

# Sadece ADMIN silebilir
@router.delete("/{firm_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_firm(
    firm_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    result = await db.execute(select(Firm).filter(Firm.id == firm_id))
    db_firm = result.scalars().first()
    if not db_firm:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")
    
    await db.delete(db_firm)
    await db.commit()
    return None

@router.post("/{firm_id}/approve", response_model=FirmResponse)
async def approve_firm(
    firm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    result = await db.execute(select(Firm).filter(Firm.id == firm_id))
    db_firm = result.scalars().first()
    if not db_firm:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")
    db_firm.is_approved = True
    db.add(db_firm)
    await db.commit()
    await db.refresh(db_firm)
    return db_firm

@router.post("/{firm_id}/reject", response_model=FirmResponse)
async def reject_firm(
    firm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    result = await db.execute(select(Firm).filter(Firm.id == firm_id))
    db_firm = result.scalars().first()
    if not db_firm:
        raise HTTPException(status_code=404, detail="Firma bulunamadı")
    db_firm.is_approved = False
    db.add(db_firm)
    await db.commit()
    await db.refresh(db_firm)
    return db_firm

@router.get("/export/csv")
async def export_firms_csv(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    O6 Bonus: Veritabanındaki tüm firmaları CSV formatında dışa aktarır (Excel destekli).
    """
    result = await db.execute(select(Firm))
    firms = result.scalars().all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Firma ID", "Firma Adi", "Vergi Numarasi", "Faaliyet Alani", "Tahmini Ciro (TL)", "Durum"])
    
    for firm in firms:
        writer.writerow([
            firm.id,
            firm.name,
            firm.tax_number,
            firm.field_of_activity if firm.field_of_activity else "Belirtilmedi",
            firm.estimated_revenue if firm.estimated_revenue else "0",
            "Onaylandi" if firm.is_approved else "Beklemede"
        ])
        
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="FineFinance_Firma_Raporu.csv"'
    }
    
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers=headers)
