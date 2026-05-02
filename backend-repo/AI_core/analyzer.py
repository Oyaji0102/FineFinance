import json
import os
from openai import AsyncOpenAI
from AI_core.prompts import FINANCIAL_ANALYSIS_PROMPT, PPTX_SUMMARY_PROMPT, CONSOLIDATED_ANALYSIS_PROMPT

# OpenAI client initialize
client = AsyncOpenAI(api_key=os.getenv("GEMINI_API_KEY"), base_url="https://generativelanguage.googleapis.com/v1beta/openai/")

async def generate_financial_analysis(financial_data: dict, is_premium: bool = False) -> dict:
    """
    Backend'deki ham finansal verileri alıp, GPT-4o aracılığıyla
    güçlü yönler, zayıf yönler, riskler ve öneriler içeren 
    (Premium vs Standart) bir analiz JSON sözlüğüne dönüştürür.
    
    Çıktı formatı:
    {
      "strengths": [...],
      "weaknesses": [...],
      "risks": [...],
      "recommendations": [...]
    }
    """
    try:
        data_str = json.dumps(financial_data, indent=2, ensure_ascii=False)
        
        prompt = FINANCIAL_ANALYSIS_PROMPT.replace("{financial_data}", data_str)
        
        if is_premium:
            prompt += "\n\nDİKKAT: is_premium durumu Aktif. 'recommendations' (Uzman Görüşü) kısmını maksimum derinlikte ve profesyonel düzeyde, yatırım tavsiyeleri niteliğinde oluştur."
        else:
            prompt += "\n\nDİKKAT: is_premium durumu Pasif. 'recommendations' kısmında sadece standart temel öneriler ver. Derin analizden kaçın."

        response = await client.chat.completions.create(
            model="gemini-2.5-flash",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"): content = content[4:]
        return json.loads(content.strip())

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
    Sunum dosyasının yönetici özeti slaytı için çarpıcı ve 3-4 cümlelik kısa metin üretir.
    Backend'in pptx_service.py'sinde kullanılacak.
    """
    try:
        data_str = json.dumps(financial_data, indent=2, ensure_ascii=False)
        prompt = PPTX_SUMMARY_PROMPT.replace("{financial_data}", data_str)
        
        response = await client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=250,
            temperature=0.4
        )
        
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"[AI_core.analyzer] PPTX özet üretim hatası: {e}")
        return "Yapay Zeka destekli finansal özet şu an oluşturulamadı."

async def generate_consolidated_analysis(holding_data: dict) -> dict:
    """
    Birden fazla firmanın verilerinin birleştirilmesi sonucu oluşan 
    konsolide holding yapısını AI'ye analiz ettirip stratejik bir yorum alır.
    """
    try:
        data_str = json.dumps(holding_data, indent=2, ensure_ascii=False)
        prompt = CONSOLIDATED_ANALYSIS_PROMPT.replace("{holding_data}", data_str)
        
        response = await client.chat.completions.create(
            model="gemini-2.5-flash",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.4
        )
        
        content = response.choices[0].message.content
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"): content = content[4:]
        return json.loads(content.strip())

    except Exception as e:
        print(f"[AI_core.analyzer] Konsolide analiz hatası: {e}")
        return {
            "summary": "AI Konsolide Rapor oluşturulurken bir hata oluştu.",
            "synergy_potential": "Veri okunamadı.",
            "risk": "Veri okunamadı."
        }
