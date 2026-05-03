import json
import os
import asyncio
from google import genai
from google.genai import types
from AI_core.prompts import EXTRACT_FIRM_PROMPT

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Gemini File API'nin desteklediği MIME türleri
GEMINI_SUPPORTED_MIME = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "application/pdf",
    "text/plain", "text/csv",
}

async def parse_firm_document(file_path: str, mime_type: str = "image/jpeg") -> dict:
    """
    Belgeyi Gemini File API üzerinden okur. 
    Desteklenen: PNG, JPG, PDF, CSV (Excel önce CSV'ye çevrilir).
    """
    uploaded_file = None
    try:
        if not file_path or not os.path.exists(file_path):
            print(f"[extractor] Dosya bulunamadı: {file_path}")
            return {}

        # Mime type Gemini'nin desteklemediği bir şeyse varsayılan olarak text/plain kullan
        effective_mime = mime_type if mime_type in GEMINI_SUPPORTED_MIME else "text/plain"

        print(f"[extractor] Yükleniyor: {file_path} ({effective_mime})")

        # 1. Dosyayı Gemini File API'ye yükle
        uploaded_file = await asyncio.to_thread(
            client.files.upload,
            file=file_path,
            config=types.UploadFileConfig(mime_type=effective_mime)
        )

        print(f"[extractor] Yükleme tamam: {uploaded_file.name}. AI analizi başlıyor...")

        # 2. Gemini ile içerik üret (JSON zorunlu)
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-3-flash-preview",
            contents=[
                EXTRACT_FIRM_PROMPT + "\nLütfen bu belgeden finansal ve şirket bilgilerini çıkar:",
                uploaded_file
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )

        data = json.loads(response.text)
        print(f"[extractor] Başarılı. Çıkarılan alanlar: {list(data.keys())}")
        return data

    except Exception as e:
        print(f"[extractor] HATA: {e}")
        return {"error": str(e)}
    finally:
        if uploaded_file:
            try:
                await asyncio.to_thread(client.files.delete, name=uploaded_file.name)
                print(f"[extractor] Geçici Gemini dosyası silindi.")
            except:
                pass


async def parse_firm_text(ocr_text: str) -> dict:
    """Düz metin analizi."""
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-3-flash-preview",
            contents=EXTRACT_FIRM_PROMPT + f"\nİşte metin verisi:\n{ocr_text}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"[extractor] Metin analiz hatası: {e}")
        return {}
