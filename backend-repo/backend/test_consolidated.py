from fastapi.testclient import TestClient
from app.main import app

def test_consolidated():
    print("O1: Holding Konsolide Rapor Testi Başlatılıyor...\n" + "-"*40)
    with TestClient(app) as client:
        # Kayıt ol ve token al
        client.post("/api/v1/auth/register", json={"email": "holding@test.com", "full_name": "Holding", "password": "pass"})
        res_login = client.post("/api/v1/auth/login", data={"username": "holding@test.com", "password": "pass"})
        token = res_login.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # 1, 2 ve 3 ID'li firmaları birleştirmeyi dene
        print("Talebi Gönderiyoruz: 3 farklı firmayı birleştir...")
        res = client.post("/api/v1/analysis/consolidated", headers=headers, json={"firm_ids": [1, 2, 3]})
        
        # Kullanıcı premium olmadığı için sistemin bunu engellemesini (403) bekliyoruz
        if res.status_code == 403:
            print("✅ Test Başarılı! Sistem standart kullanıcının Konsolide Rapor (Premium) almasını engelledi (403 Forbidden).")
        else:
            print(f"❌ Test Başarısız! Beklenen 403 gelmedi, gelen yanıt: {res.status_code} - {res.text}")

if __name__ == "__main__":
    test_consolidated()
