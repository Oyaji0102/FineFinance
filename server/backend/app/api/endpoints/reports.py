from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db
from app.models.financial_report import FinancialReport
from app.models.firm import Firm
from app.models.user import User
from app.api.deps import get_current_active_user
from app.schemas.financial_report import FinancialReportResponse, FinancialReportCreate
from app.services.log_service import create_log
from typing import List

router = APIRouter()

@router.get("/reports/firm/{firm_id}", response_model=List[FinancialReportResponse])
async def get_firm_reports(
    firm_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Firma başına tüm finansal raporları getir
    """
    # Firma var mı kontrol et
    result = await db.execute(select(Firm).filter(Firm.id == firm_id))
    firm = result.scalars().first()
    
    if not firm:
        raise HTTPException(status_code=404, detail="Firm not found")
    
    # Raporları getir
    result = await db.execute(
        select(FinancialReport).filter(FinancialReport.firm_id == firm_id)
        .order_by(FinancialReport.created_at.desc())
    )
    reports = result.scalars().all()
    return reports

@router.post("/reports", response_model=FinancialReportResponse)
async def create_financial_report(
    report_data: FinancialReportCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Yeni finansal rapor ekle
    """
    # Firma var mı kontrol et
    result = await db.execute(select(Firm).filter(Firm.id == report_data.firm_id))
    firm = result.scalars().first()
    
    if not firm:
        raise HTTPException(status_code=404, detail="Firm not found")
    
    # Rapor oluştur
    db_report = FinancialReport(**report_data.dict())
    db.add(db_report)
    await db.commit()
    await db.refresh(db_report)
    
    # Log yaz
    await create_log(
        db, 
        "FINANCIAL_REPORT_ADDED", 
        {"firm_id": firm_id, "file_name": report_data.file_name},
        user_id=current_user.id
    )
    
    return db_report

@router.get("/reports/{report_id}", response_model=FinancialReportResponse)
async def get_report(
    report_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Belirli bir raporu getir
    """
    result = await db.execute(
        select(FinancialReport).filter(FinancialReport.id == report_id)
    )
    report = result.scalars().first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

@router.delete("/reports/{report_id}")
async def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Raporu sil
    """
    result = await db.execute(
        select(FinancialReport).filter(FinancialReport.id == report_id)
    )
    report = result.scalars().first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    await db.delete(report)
    await db.commit()
    
    # Log yaz
    await create_log(
        db,
        "FINANCIAL_REPORT_DELETED",
        {"report_id": report_id, "firm_id": report.firm_id},
        user_id=current_user.id
    )
    
    return {"success": True, "message": "Report deleted successfully"}
