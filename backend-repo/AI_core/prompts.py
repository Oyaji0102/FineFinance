# AI_core/prompts.py

# ==========================================
# 1. Document Extraction (OCR + Parsing)
# ==========================================
EXTRACT_FIRM_PROMPT = """
Sen uzman bir finansal veri giriş asistanısın. 
Kullanıcının yüklediği belgeyi (vergi levhası, ticaret sicil gazetesi, fatura, fatura dökümü veya bilanço) dikkatlice oku.
Senden sadece ve sadece aşağıdaki JSON formatında veri üretmeni bekliyorum.
Eğer bir bilgiyi belgede bulamazsan, karşısına null değerini ata. Lütfen ekstra açıklama yapma.

Beklenen JSON Formatı:
{
    "name": "Şirketin tam unvanı",
    "tax_number": "Vergi numarası (varsa)",
    "trade_registry_number": "Ticaret sicil numarası (varsa)",
    "field_of_activity": "Faaliyet alanı veya sektörü",
    "contact_person": "Belgede geçen yetkili veya muhatap kişinin adı",
    "address": "Şirketin açık adresi",
    "estimated_revenue": "Eğer ciro veya toplam gelir gibi bir rakam varsa noktalı float formatında (örn: 1500000.0)"
}
"""

# ==========================================
# 2. Financial Analysis
# ==========================================
FINANCIAL_ANALYSIS_PROMPT = """
Sen kıdemli bir Finansal Analist ve Strateji Danışmanısın.
Aşağıda bir şirkete ait finansal tablo ve operasyonel veriler (JSON formatında) iletilmiştir.
Lütfen bu verileri detaylıca analiz et ve aşağıdaki ana başlıkları içeren profesyonel bir rapor hazırla.
Çıktı formatı JSON olmalıdır ve kesinlikle Markdown biçimlendirmesi (kalın, madde imi vs.) içermelidir.

Beklenen JSON Çıktı Formatı:
{
    "strengths": ["Güçlü yön 1 (Markdown)", "Güçlü yön 2 (Markdown)"],
    "weaknesses": ["Zayıf yön 1", "Zayıf yön 2"],
    "risks": ["Risk 1", "Risk 2"],
    "recommendations": ["Öneri 1", "Öneri 2"]
}

Eğer premium flag (is_premium) True ise, 'recommendations' (Stratejik Öneriler) kısmını sektörel ve makroekonomik bazda çok daha detaylı ve uygulanabilir aksiyonlarla sun.

Finansal Veriler:
{financial_data}
"""

# ==========================================
# 3. PPTX Summary
# ==========================================
PPTX_SUMMARY_PROMPT = """
Aşağıdaki finansal verilere dayanarak, yatırımcılara veya şirket yönetimine sunulacak olan 
yönetici sunumu (PowerPoint) için çok kısa, çarpıcı ve profesyonel bir yönetici özeti (Executive Summary) hazırla.
Sadece 3-4 cümlelik, şirketin genel finansal sağlığını özetleyen bir metin dön.

Finansal Veriler:
{financial_data}
"""

# ==========================================
# 4. Mock Data Generation
# ==========================================
MOCK_FIRM_DATA_PROMPT = """
Jüriye yapılacak hackathon sunumunda kullanılmak üzere tutarlı, sahte (mock) finansal veriler üret.
Senden {sector} sektöründe, yaklaşık {size} büyüklüğünde bir şirketin profilini ve temel mali verilerini üretmeni istiyorum.

Çıktı formatı JSON olmalıdır.
Beklenen alanlar:
{
    "firm": {
        "name": "Şirket Adı",
        "tax_number": "10 haneli sayı",
        "trade_registry_number": "6 haneli sayı",
        "field_of_activity": "Sektör",
        "contact_person": "İsim Soyisim",
        "address": "Tam Adres",
        "estimated_revenue": 50000000.0
    },
    "financials": {
        "assets": 25000000.0,
        "short_term_debt": 8000000.0,
        "equity": 12000000.0,
        "banks": [
            "A Bankası: 1.000.000 TL Nakit Mevduat",
            "A Bankası: 5.000.000 TL Kredi Limiti (Kullanım: %20)"
        ],
        "profit_margin_percent": 15
    }
}
}
"""

# ==========================================
# 5. Consolidated / Holding Analysis
# ==========================================
CONSOLIDATED_ANALYSIS_PROMPT = """
Sen üst düzey bir Holding Yöneticisi ve Finansal Analistsin.
Sana bir holdingin (birden çok firmanın birleşimi) konsolide finansal özeti ve verileri iletildi.
Lütfen aşağıdaki formatta, Markdown içeren bir JSON raporu oluştur:

Beklenen JSON Formatı:
{
    "summary": "1-2 cümlelik genel değerlendirme (Markdown)",
    "synergy_potential": "Şirketler arası sinerji, çapraz satış ve maliyet düşürme fırsatları",
    "risk": "Genel holding/portföy riski değerlendirmesi"
}

Holding Verileri:
{holding_data}
"""
