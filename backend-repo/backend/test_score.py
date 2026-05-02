from fastapi.testclient import TestClient
from app.main import app

def test_scoring():
    print("O4: Finansal Skor Hesaplama Testi Başlatılıyor...\n" + "-"*40)
    with TestClient(app) as client:
        # 1. Login ol ve token al
        client.post("/api/v1/auth/register", json={"email": "score_hoca@test.com", "full_name": "Hoca", "password": "pass"})
        res = client.post("/api/v1/auth/login", data={"username": "score_hoca@test.com", "password": "pass"})
        token = res.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Çok Kötü Durumdaki Bir Firmanın Verilerini Gönder
        bad_firm_data = {
            "ratios": {
                "current_ratio": 0.8, # 1.0 altı (Çok Kötü) -> -25 Puan
                "net_profit_margin": -5.0, # Zararda -> -30 Puan
                "debt_to_equity": 2.5 # Çok borçlu -> -25 Puan
            }
        }
        
        print("Test 1: İflasın Eşiğindeki Firma (Çok Düşük Skor Bekleniyor)")
        res_score = client.post("/api/v1/analysis/score", headers=headers, json={"financial_data": bad_firm_data})
        data = res_score.json()
        
        print("Dönen Sonuç:", data["data"])
        assert data["success"] == True
        assert data["data"]["score"] == 20 # 100 - 25 - 30 - 25 = 20 kalmalı
        assert data["data"]["risk_level"] == "Yüksek Risk (Kritik/Tehlikeli)"
        print("✅ Test 1 Başarılı! Sistem iflas riski olan firmayı yakaladı ve 20 puan verdi.")
        
        # 3. Mükemmel Durumdaki Bir Firmanın Verilerini Gönder
        good_firm_data = {
            "ratios": {
                "current_ratio": 2.0, # Çok iyi
                "net_profit_margin": 15.0, # Çok iyi
                "debt_to_equity": 0.5 # Borcu yok denecek kadar az
            }
        }
        
        print("\nTest 2: Mükemmel Sağlıklı Firma (100 Puan Bekleniyor)")
        res_score2 = client.post("/api/v1/analysis/score", headers=headers, json={"financial_data": good_firm_data})
        data2 = res_score2.json()
        
        print("Dönen Sonuç:", data2["data"])
        assert data2["data"]["score"] == 100
        assert data2["data"]["risk_level"] == "Düşük Risk (Çok Sağlıklı)"
        print("✅ Test 2 Başarılı! Sistem sağlıklı firmaya tam puan verdi.")

if __name__ == "__main__":
    test_scoring()
