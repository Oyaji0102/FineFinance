import json
import os
import asyncio
from openai import AsyncOpenAI
from AI_core.prompts import MOCK_FIRM_DATA_PROMPT

client = AsyncOpenAI(api_key=os.getenv("GEMINI_API_KEY"), base_url="https://generativelanguage.googleapis.com/v1beta/openai/")

async def generate_mock_firm(sector: str, size: str) -> dict:
    """
    Jüri sunumunda (Hackathon Demo) kullanılmak üzere tutarlı sahte firma ve finansal tablo üretir.
    Örnek kullanım: await generate_mock_firm("Otomotiv Yedek Parça", "Orta Ölçekli")
    """
    try:
        prompt = MOCK_FIRM_DATA_PROMPT.replace("{sector}", sector).replace("{size}", size)
        
        response = await client.chat.completions.create(
            model="gemini-1.5-flash",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7 # Biraz daha yaratıcı (farklı şirketler çıkması için)
        )
        
        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        print(f"[AI_core.mock_generator] Mock data üretim hatası: {e}")
        return {}

if __name__ == "__main__":
    # Konsoldan direkt test etmek için
    async def run_test():
        print("Sahte firma verisi üretiliyor (Yazılım, Büyük Ölçekli)...")
        data = await generate_mock_firm("Yazılım Geliştirme", "Büyük Ölçekli")
        print("\n--- SONUÇ ---\n")
        print(json.dumps(data, indent=2, ensure_ascii=False))

    asyncio.run(run_test())
