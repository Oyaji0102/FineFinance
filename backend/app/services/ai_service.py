import json

# T3: OCR metninden firma bilgilerini çıkarmak için Prompt
EXTRACT_PROMPT = """
Aşağıdaki metin bir OCR taramasından (vergi levhası, ticaret sicil vb.) elde edilmiştir. 
Lütfen bu metinden yola çıkarak aşağıdaki alanları bul ve SADECE JSON formatında döndür. 
Bulamadığın alanlar için null yaz.

JSON Formatı:
{
  "name": "Şirket Adı",
  "tax_number": "Vergi Numarası",
  "trade_registry_number": "Ticaret Sicil Numarası",
  "field_of_activity": "Faaliyet Alanı",
  "contact_person": "İletişim Kişisi / Yetkili",
  "address": "Adres Bilgisi"
}

OCR Metni:
"""

async def parse_firm_data_from_text(ocr_text: str) -> dict:
    """
    OCR'dan çıkan ham metni Gemini/ChatGPT LLM'e verip JSON olarak anlamlı form verisi alır.
    """
    try:
        # Gerçek entegrasyonda burada genai veya openai API çağrısı yapılacak.
        # Hackathon hızı için şimdilik Mock (Sahte) veri dönüyoruz, arkadaşınız UI'ı bağlayabilsin diye.
        
        # DEMO / MOCK Yanıt:
        return {
          "name": "Demo Teknoloji A.Ş.",
          "tax_number": "1234567890",
          "trade_registry_number": "345678",
          "field_of_activity": "Yazılım Geliştirme",
          "contact_person": "Ahmet Yılmaz",
          "address": "Bilişim Vadisi, Gebze/Kocaeli"
        }
    except Exception as e:
        print(f"AI Parse Error: {e}")
        return {}

# T4: Finansal Verilerden Analiz Raporu Üretmek için Prompt
ANALYSIS_PROMPT = """
Aşağıda bir şirkete ait finansal veriler verilmiştir. Lütfen bu verileri bir finansal danışman gözüyle analiz et.
Bana şu 4 başlık altında detaylı bir uzman raporu hazırla:
1. Güçlü Yönler (Strengths)
2. Zayıf Yönler (Weaknesses)
3. Riskler (Risks)
4. Stratejik Öneriler (Recommendations)

Şirket Verileri:
{financial_data}
"""

async def generate_financial_analysis(financial_data: dict) -> dict:
    """
    Firmanın finansal verilerini LLM'e gönderip bir analiz raporu alır.
    """
    try:
        # Gerçek entegrasyonda burada API çağrısı yapılacak.
        # Hackathon için Mock Yanıt (Premium / Uzman Görüşü Simülasyonu)
        return {
            "strengths": ["Şirketin nakit akışı oldukça güçlü.", "Düzenli bir gelir artışı trendi var."],
            "weaknesses": ["Kısa vadeli borç ödeme kapasitesi (Cari Oran) sınırda.", "Müşteri tahsilatlarında gecikmeler yaşanıyor."],
            "risks": ["Sektörel daralma ihtimali satışları etkileyebilir.", "Döviz kurundaki dalgalanmalar ithalat maliyetlerini artırıyor."],
            "recommendations": ["Nakit rezervlerini döviz korumalı mevduatlarda değerlendirmelisiniz.", "Uzun vadeli borçlanma ile kısa vadeli borçları yapılandırın."]
        }
    except Exception as e:
        print(f"Analysis Generation Error: {e}")
        return {}
