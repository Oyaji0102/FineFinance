from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Header
from fastapi.responses import Response
from pydantic import BaseModel
from app.services.ocr_service import extract_text_from_image
from app.services.ai_service import parse_firm_data_from_text, generate_financial_analysis
from app.services.pptx_service import create_firm_presentation
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/document/parse")
async def parse_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user),
    accept_language: str = Header(default="tr-TR") # ÇOK DİLLİ DESTEK (Header'dan dil okuma)
):
    """
    Kullanıcının yüklediği belgeyi okur, OCR'dan geçirir ve AI yardımıyla form alanlarını otomatik doldurur.
    """
    # İstemci İngilizce mi istiyor?
    is_english = accept_language.startswith("en")
    
    # Sadece görsel kabul edelim
    if not file.content_type.startswith("image/"):
        err_msg = "Please upload an image (PNG, JPG)." if is_english else "Lütfen bir görsel (PNG, JPG) yükleyin."
        raise HTTPException(status_code=400, detail=err_msg)
        
    image_bytes = await file.read()
    
    # 1. OCR İşlemi
    ocr_text = await extract_text_from_image(image_bytes)
    
    if not ocr_text.strip():
        err_msg = "Could not extract text from the image." if is_english else "Görselden metin okunamadı."
        raise HTTPException(status_code=400, detail=err_msg)
         
    # 2. AI Parse İşlemi
    parsed_data = await parse_firm_data_from_text(ocr_text)
    
    msg_success = "Document successfully parsed." if is_english else "Belge başarıyla okundu."
    
    return {
        "success": True,
        "message": msg_success,
        "data": parsed_data,
        "raw_text": ocr_text # Frontend isterse ham OCR metnini de ekranda gösterebilir
    }

class FinancialDataRequest(BaseModel):
    firm_id: int
    financial_data: dict

@router.post("/report")
async def create_financial_report(
    request: FinancialDataRequest,
    current_user = Depends(get_current_active_user),
    accept_language: str = Header(default="tr-TR")
):
    """
    T4: Girilen finansal verileri kullanarak LLM'den analiz raporu (Güçlü/Zayıf yönler) üretir.
    T7: Kullanıcı Admin değilse ve Premium aktif değilse 403 Forbidden döner.
    """
    is_english = accept_language.startswith("en")
    
    # T7: Kullanıcı kısıtı
    if not current_user.is_admin and not current_user.is_premium_active:
        err_msg = "AI Analysis and Expert Opinion require Premium subscription." if is_english else "Uzman Görüşü ve Yapay Zeka Analizi premium özelliklerdir. Lütfen paketinizi yükseltin."
        raise HTTPException(status_code=403, detail=err_msg)

    # 1. AI ile analiz üret
    analysis_report = await generate_financial_analysis(request.financial_data)
    
    msg_success = "Report generated successfully." if is_english else "Analiz raporu başarıyla oluşturuldu."
    
    return {
        "success": True,
        "message": msg_success,
        "report": analysis_report
    }

@router.post("/presentation")
async def generate_presentation(
    request: FinancialDataRequest,
    current_user = Depends(get_current_active_user)
):
    """
    T5: Firmanın mali verileri ve AI özeti kullanılarak .pptx dosyası üretilir ve indirilir.
    """
    # 1. AI ile taze bir analiz raporu çek
    analysis_report = await generate_financial_analysis(request.financial_data)
    
    # 2. Python-pptx ile PowerPoint sunumunu byte olarak oluştur
    pptx_bytes = create_firm_presentation(request.financial_data, analysis_report)
    
    # 3. İstemcinin dosyayı indirebilmesi için Header'ları ayarla
    headers = {
        'Content-Disposition': f'attachment; filename="finansal_sunum_{request.firm_id}.pptx"'
    }
    
    return Response(
        content=pptx_bytes, 
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", 
        headers=headers
    )
