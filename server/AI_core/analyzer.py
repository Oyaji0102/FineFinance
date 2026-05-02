import json
import os
import asyncio
from google import genai
from google.genai import types
from AI_core.prompts import FINANCIAL_ANALYSIS_PROMPT, PPTX_SUMMARY_PROMPT, CONSOLIDATED_ANALYSIS_PROMPT

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_financial_analysis(financial_data: dict, is_premium: bool = False) -> dict:
    """
    Ham finansal verileri alıp Gemini aracılığıyla
    güçlü yönler, zayıf yönler, riskler ve öneriler içeren
    (Premium vs Standart) bir analiz JSON sözlüğüne dönüştürür.
    """
    try:
        data_str = json.dumps(financial_data, indent=2, ensure_ascii=False)
        prompt = FINANCIAL_ANALYSIS_PROMPT.replace("{financial_data}", data_str)
        
        if is_premium:
            prompt += "\n\nDİKKAT: is_premium Aktif. 'recommendations' kısmını maksimum derinlikte ve yatırım tavsiyeleri niteliğinde oluştur."
        else:
            prompt += "\n\nDİKKAT: is_premium Pasif. 'recommendations' kısmında sadece standart temel öneriler ver."

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3,
                max_output_tokens=1500
            )
        )
        
        return json.loads(response.text)

    except Exception as e:
        print(f"[AI_core.analyzer] Analiz üretim hatası: {e}")
        return {
            "strengths": [],
            "weaknesses": [],
            "risks": [],
            "recommendations": ["Analiz oluşturulurken sistem bazlı bir hata meydana geldi."]
        }

async def generate_pptx_summary(financial_data: dict) -> str:
    """
    Sunum dosyasının yönetici özeti slaytı için kısa metin üretir.
    """
    try:
        data_str = json.dumps(financial_data, indent=2, ensure_ascii=False)
        prompt = PPTX_SUMMARY_PROMPT.replace("{financial_data}", data_str)
        
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.4,
                max_output_tokens=250
            )
        )
        
        return response.text.strip()

    except Exception as e:
        print(f"[AI_core.analyzer] PPTX özet üretim hatası: {e}")
        return "Yapay Zeka destekli finansal özet şu an oluşturulamadı."

async def generate_consolidated_analysis(holding_data: dict) -> dict:
    """
    Birden fazla firmanın verilerini birleştirerek konsolide analiz üretir.
    """
    try:
        data_str = json.dumps(holding_data, indent=2, ensure_ascii=False)
        prompt = CONSOLIDATED_ANALYSIS_PROMPT.replace("{holding_data}", data_str)
        
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
                max_output_tokens=800
            )
        )
        
        return json.loads(response.text)

    except Exception as e:
        print(f"[AI_core.analyzer] Konsolide analiz hatası: {e}")
        return {
            "summary": "AI Konsolide Rapor oluşturulurken bir hata oluştu.",
            "synergy_potential": "Veri okunamadı.",
            "risk": "Veri okunamadı."
        }
