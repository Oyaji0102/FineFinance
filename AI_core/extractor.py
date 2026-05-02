import base64
import json
import os
from openai import AsyncOpenAI
from AI_core.prompts import EXTRACT_FIRM_PROMPT

# OpenAI client initialize edilir.
# Not: Sistem ortamında OPENAI_API_KEY bulunmalıdır. Hackathon ortamında .env ile yönetin.
client = AsyncOpenAI(api_key=os.getenv("GEMINI_API_KEY"), base_url="https://generativelanguage.googleapis.com/v1beta/openai/")

async def parse_firm_document(file_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    """
    Kullanıcının yüklediği belgeyi (resim) OpenAI Vision (gpt-4o) modeline gönderip 
    FirmBase şemasına (name, tax_number vs.) tam uyan JSON çıktısı alır.
    """
    try:
        if not file_bytes:
            return {}

        base64_image = base64.b64encode(file_bytes).decode('utf-8')
        
        # GPT-4o'nun JSON Mode özelliğini kullanarak kesin JSON garantisi alıyoruz
        response = await client.chat.completions.create(
            model="gemini-1.5-flash",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": EXTRACT_FIRM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Lütfen bu belgeden firma bilgilerini çıkar:"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1024,
            temperature=0.1 # Halüsinasyonu azaltmak ve deterministik sonuçlar için
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        return data

    except Exception as e:
        print(f"[AI_core.extractor] Error parsing document: {e}")
        return {}

async def parse_firm_text(ocr_text: str) -> dict:
    """
    Eğer görüntü gpt-4o'ya gönderilemeyecek kadar büyükse veya backend'de 
    Pytesseract OCR ile metin halihazırda çıkarıldıysa bu metni JSON'a dönüştürür.
    (ai_service.py'deki fonksiyonun asıl halidir)
    """
    try:
        response = await client.chat.completions.create(
            model="gemini-1.5-flash",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": EXTRACT_FIRM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"İşte OCR metni:\n{ocr_text}"
                }
            ],
            max_tokens=1024,
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        return data
        
    except Exception as e:
        print(f"[AI_core.extractor] Error parsing text: {e}")
        return {}
