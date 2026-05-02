def calculate_financial_score(financial_data: dict) -> dict:
    """
    O4: Girilen finansal verilere göre (likidite, karlılık, kaldıraç) 
    0 ile 100 arasında bir risk/sağlık skoru hesaplar.
    """
    score = 100
    deductions = []

    ratios = financial_data.get("ratios", {})
    
    # 1. Likidite (Cari Oran) - İdeal > 1.5
    try:
        current_ratio = float(ratios.get("current_ratio", 1.5))
        if current_ratio < 1.0:
            score -= 25
            deductions.append("Cari oran 1.0'ın altında, ciddi kısa vadeli likidite (nakit) riski.")
        elif current_ratio < 1.5:
            score -= 10
            deductions.append("Cari oran 1.5'in altında, kısa vadeli yükümlülüklerde dikkatli olunmalı.")
    except (ValueError, TypeError):
        pass

    # 2. Karlılık (Net Kar Marjı Yüzdesi) - İdeal > 10
    try:
        net_profit_margin = float(ratios.get("net_profit_margin", 10.0))
        if net_profit_margin < 0:
            score -= 30
            deductions.append("Şirket zarar ediyor (Negatif net kar marjı). Puan büyük ölçüde kırıldı.")
        elif net_profit_margin < 10.0:
            score -= 10
            deductions.append("Net kar marjı sektör ortalamasının altında olabilir (< %10).")
    except (ValueError, TypeError):
        pass

    # 3. Kaldıraç (Borç / Özkaynak) - İdeal < 1.0
    try:
        debt_to_equity = float(ratios.get("debt_to_equity", 1.0))
        if debt_to_equity > 2.0:
            score -= 25
            deductions.append("Borç/Özkaynak oranı 2.0'ın üzerinde, yüksek finansal risk (Aşırı borçlanma).")
        elif debt_to_equity > 1.5:
            score -= 10
            deductions.append("Borç/Özkaynak oranı sınırda (>1.5), borçlanma politikası gözden geçirilmeli.")
    except (ValueError, TypeError):
        pass

    # Sınırlandırma (Puan 0'ın altına düşemez, 100'ün üstüne çıkamaz)
    score = max(0, min(100, score))

    # Risk Seviyesi Belirleme
    if score >= 80:
        risk_level = "Düşük Risk (Çok Sağlıklı)"
    elif score >= 50:
        risk_level = "Orta Risk (Gelişime Açık)"
    else:
        risk_level = "Yüksek Risk (Kritik/Tehlikeli)"

    return {
        "score": score,
        "max_score": 100,
        "risk_level": risk_level,
        "deductions": deductions # Hangi maddelerden puan kırıldığının açıklaması
    }
