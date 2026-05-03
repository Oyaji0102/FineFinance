import json
import os
import tempfile
import asyncio
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Header
from fastapi.responses import Response
from pydantic import BaseModel
from AI_core.extractor import parse_firm_document
from AI_core.analyzer import generate_financial_analysis, generate_consolidated_analysis, generate_pptx_summary
from app.services.pptx_service import create_firm_presentation
from app.services.scoring_service import calculate_financial_score
from app.api.deps import get_current_active_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.firm import Firm

router = APIRouter()

# Kabul edilen dosya türleri ve Gemini'ye iletilecek mime eşlemeleri
ACCEPTED_TYPES = {
    "image/jpeg":   "image/jpeg",
    "image/jpg":    "image/jpeg",
    "image/png":    "image/png",
    "image/webp":   "image/webp",
    "application/pdf": "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
    "application/vnd.ms-excel": "excel",
    "text/csv": "text/csv",
}

def _excel_to_csv(excel_path: str) -> str:
    """Excel dosyasını tüm sayfalarıyla birlikte CSV'ye dönüştürür."""
    import pandas as pd
    excel_data = pd.read_excel(excel_path, sheet_name=None)
    csv_path = excel_path + ".csv"
    with open(csv_path, "w", encoding="utf-8") as f:
        for sheet_name, df in excel_data.items():
            f.write(f"--- SAYFA: {sheet_name} ---\n")
            df.to_csv(f, index=False)
            f.write("\n")
    return csv_path


@router.post("/document/parse")
async def parse_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user),
    accept_language: str = Header(default="tr-TR")
):
    """
    Yüklenen belgeyi (PDF, Excel, Görsel) Gemini AI ile okur
    ve form alanlarını otomatik doldurur.
    """
    is_english = accept_language.startswith("en")

    # 1. Dosya türü kontrolü
    content_type = file.content_type or ""
    if content_type not in ACCEPTED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Desteklenmeyen dosya türü. PDF, Excel (.xlsx/.xls) veya Görsel (PNG/JPG) yükleyin."
            if not is_english else
            "Unsupported file type. Please upload PDF, Excel (.xlsx/.xls) or Image (PNG/JPG)."
        )

    # 2. Dosyayı geçici olarak kaydet
    suffix = os.path.splitext(file.filename or "file")[1] or ".bin"
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        content = await file.read()
        tmp_file.write(content)
        tmp_file.flush()
        tmp_file.close()
        tmp_path = tmp_file.name

        final_path = tmp_path
        final_mime = ACCEPTED_TYPES[content_type]
        csv_path = None

        # 3. Excel ise CSV'ye çevir (Gemini Excel desteklemiyor)
        if final_mime == "excel":
            try:
                csv_path = await asyncio.to_thread(_excel_to_csv, tmp_path)
                final_path = csv_path
                final_mime = "text/csv"
            except Exception as e:
                raise HTTPException(
                    status_code=422,
                    detail=f"Excel dosyası okunamadı: {e}"
                )

        # 4. Gemini ile belgeden veri çıkar
        parsed_data = await parse_firm_document(final_path, mime_type=final_mime)

    finally:
        # Geçici dosyaları temizle
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except: pass
        try:
            if csv_path and os.path.exists(csv_path):
                os.remove(csv_path)
        except: pass

    if parsed_data and "error" in parsed_data:
        raise HTTPException(
            status_code=422,
            detail=f"AI Analiz Hatası: {parsed_data['error']}"
        )

    if not parsed_data:
        raise HTTPException(
            status_code=422,
            detail="Belgeden anlamlı finansal veri okunamadı. Belge içeriğini kontrol edin."
            if not is_english else
            "Could not extract meaningful financial data from the document."
        )

    return {
        "success": True,
        "message": "Belge başarıyla okundu." if not is_english else "Document successfully parsed.",
        "data": parsed_data
    }


class FinancialDataRequest(BaseModel):
    firm_id: int = 0
    financial_data: dict


@router.post("/report")
async def create_financial_report(
    request: FinancialDataRequest,
    current_user = Depends(get_current_active_user),
    accept_language: str = Header(default="tr-TR")
):
    """Finansal verilerden AI analiz raporu üretir (Güçlü/Zayıf yönler, Riskler, Öneriler)."""
    is_english = accept_language.startswith("en")

    if not current_user.is_admin and not current_user.is_premium_active:
        raise HTTPException(
            status_code=403,
            detail="AI Analizi premium özelliğidir. Lütfen paketinizi yükseltin."
            if not is_english else
            "AI Analysis requires a Premium subscription."
        )

    analysis_report = await generate_financial_analysis(
        request.financial_data,
        is_premium=current_user.is_premium_active or current_user.is_admin
    )

    return {
        "success": True,
        "message": "Analiz raporu başarıyla oluşturuldu.",
        "report": analysis_report
    }


@router.post("/presentation")
async def generate_presentation(
    request: FinancialDataRequest,
    current_user = Depends(get_current_active_user)
):
    """Finansal verilerden .pptx sunum dosyası üretir ve indirir."""
    analysis_report = await generate_financial_analysis(
        request.financial_data,
        is_premium=current_user.is_premium_active or current_user.is_admin
    )
    pptx_summary = await generate_pptx_summary(request.financial_data)
    pptx_bytes = create_firm_presentation(request.financial_data, analysis_report, pptx_summary)

    headers = {
        "Content-Disposition": f'attachment; filename="finansal_sunum_{request.firm_id}.pptx"'
    }
    return Response(
        content=pptx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers=headers
    )


class ScoreRequest(BaseModel):
    financial_data: dict


@router.post("/score")
async def get_financial_score(
    request: ScoreRequest,
    current_user = Depends(get_current_active_user)
):
    """Finansal oranlara göre otomatik Risk ve Sağlık skoru hesaplar (1-100)."""
    result = calculate_financial_score(request.financial_data)
    return {
        "success": True,
        "message": "Finansal skor başarıyla hesaplandı.",
        "data": result
    }


class ConsolidatedRequest(BaseModel):
    firm_ids: list[int]


@router.post("/consolidated")
async def generate_consolidated_report(
    request: ConsolidatedRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Birden fazla firmanın verilerini birleştirerek konsolide analiz üretir."""
    if not current_user.is_admin and not current_user.is_premium_active:
        raise HTTPException(status_code=403, detail="Konsolide raporlama Premium özelliktir.")

    result = await db.execute(select(Firm).filter(Firm.id.in_(request.firm_ids)))
    firms = result.scalars().all()

    if not firms:
        raise HTTPException(status_code=404, detail="Firmalar bulunamadı.")

    consolidated_data = {
        "holding_name": " & ".join([f.name for f in firms]),
        "total_revenue": sum([f.estimated_revenue for f in firms if f.estimated_revenue]),
        "firm_count": len(firms),
        "activities": list(set([f.field_of_activity for f in firms if f.field_of_activity]))
    }

    consolidated_analysis = await generate_consolidated_analysis(consolidated_data)

    return {
        "success": True,
        "holding_data": consolidated_data,
        "analysis": consolidated_analysis
    }
