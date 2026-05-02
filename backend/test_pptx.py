import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.pptx_service import create_firm_presentation

# Belgedeki 4.5 maddesine tamamen uyan örnek veri seti
firm_data = {
    "name": "Global Tech Lojistik A.Ş.",
    "revenue": "45.000.000",
    "assets": "25.000.000",
    "short_term_debt": "8.000.000",
    "equity": "12.000.000",
    "ratios": {
        "current_ratio": "1.8 (Sektör ortalamasına göre Güçlü)",
        "net_profit_margin": "%15 (Pozitif)",
        "debt_to_equity": "1.2 (Yüksek Borçlanma)"
    },
    "banks": [
        "A Bankası: 1.000.000 TL Nakit Mevduat",
        "A Bankası: 5.000.000 TL Kredi Limiti (Güncel Kullanım: %20)",
        "B Bankası: 3.000.000 TL KMH (Kullanım: %0)",
        "C Bankası: Teminat Mektupları Limiti: 2.000.000 TL"
    ],
    "trends": [20, 25, 35, 45] # Geçmişten bugüne ciro (Milyon TL)
}

ai_analysis = {
    "summary": [
        "Şirket son 3 yılda istikrarlı bir büyüme trendi yakalamıştır ve ciro %100'den fazla artmıştır.",
        "Kısa vadeli likidite oranları oldukça sağlıklıdır, acil borç ödeme kapasitesi yüksektir.",
        "Mevcut banka limitlerinin büyük bir kısmı kullanılmamış olup, yeni yatırımları fonlamak için yeterli marj sunmaktadır.",
        "Karlılık oranı (%15) lojistik sektörünün ortalamasının oldukça üzerindedir."
    ]
}

pptx_bytes = create_firm_presentation(firm_data, ai_analysis)
desktop_path = os.path.expanduser("~/Desktop/Eksiksiz_Sunum.pptx")
with open(desktop_path, "wb") as f:
    f.write(pptx_bytes)

print(f"Jüri kurallarına tam uyumlu sunum başarıyla oluşturuldu: {desktop_path}")
