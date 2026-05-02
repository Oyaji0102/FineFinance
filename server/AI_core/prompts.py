# AI_core/prompts.py

# ==========================================
# 1. Document Extraction (OCR + Parsing)
# ==========================================
EXTRACT_FIRM_PROMPT = """
Sen uzman bir finansal veri giriş asistanı ve veri analistisin. 
Kullanıcının yüklediği belgeyi (vergi levhası, ticaret sicil gazetesi, mizan excel/pdf, findeks raporu, banka formatı veya bilanço) dikkatlice incele.
Senden sadece ve sadece aşağıdaki JSON formatında veri üretmeni bekliyorum.
Belgede bulamadığın bilgiler için lütfen null değerini ata. Ekstra açıklama yapma.

Beklenen JSON Formatı:
{
    "name": "Şirketin veya kişinin tam unvanı/adı",
    "tax_number": "Vergi numarası (varsa)",
    "field_of_activity": "Faaliyet alanı veya sektörü (varsa)",
    "estimated_revenue": "Toplam gelir, net satışlar veya ciro (float)",
    "current_assets": "Dönen Varlıklar toplamı (float)",
    "fixed_assets": "Duran Varlıklar / Maddi Duran Varlıklar toplamı (float)",
    "total_assets": "Toplam Aktifler / Varlıklar toplamı (float)",
    "total_liabilities": "Kısa ve Uzun Vadeli Yabancı Kaynaklar / Toplam Borçlar toplamı (float)",
    "short_term_liabilities": "Kısa Vadeli Borçlar (float)",
    "long_term_liabilities": "Uzun Vadeli Borçlar (float)",
    "equity": "Özkaynak / Sermaye toplamı (float)",
    "net_income": "Dönem Net Karı veya Zararı (float)",
    "gross_profit": "Brüt Kar (float)",
    "operating_expenses": "Faaliyet Giderleri toplamı (float)",
    "findeks_score": "Findeks Kredi Notu (0-1900 arası integer, varsa)",
    "findeks_report_date": "Findeks rapor tarihi (string, varsa)",
    "total_credit_limit": "Toplam Banka Kredi Limiti (float)",
    "total_credit_risk": "Toplam Kredi Riski / Mevcut Kredi Borcu (float)",
    "risk_utilization_ratio": "Kullanım Oranı = Kredi Riski / Kredi Limiti (float, %0-100 arasında)",
    "overdue_balance": "Gecikmiş Kredi Bakiyesi (float)",
    "npl_count": "Takipteki kredi sayısı (integer)",
    "bank_deposits": "Mevduat / Bankalardaki Nakit Varlıklar (float)",
    "bank_details": [
        {
            "bank_name": "Banka adı",
            "credit_type": "Kredi türü (nakit, gayrinakdi, leasing vb.)",
            "limit": "Limit tutarı (float)",
            "risk": "Risk / Kullanılan tutar (float)"
        }
    ]
}
Önemli: Findeks raporu yüklenmisse findeks_score alanını çok dikkatli oku. Puan genellikle '1234' gibi 4 haneli bir sayı olarak geçer ve 'Risk Notu', 'Findeks Skoru' ya da 'Kredi Notu' başlığı altında bulunur.
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
