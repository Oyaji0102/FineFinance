from fastapi.testclient import TestClient
from app.main import app

def test_export():
    print("O6: CSV/Excel İndirme Testi Başlatılıyor...\n" + "-"*40)
    with TestClient(app) as client:
        # 1. Login ol ve token al
        client.post("/api/v1/auth/register", json={"email": "export_test@test.com", "full_name": "Export", "password": "pass"})
        res = client.post("/api/v1/auth/login", data={"username": "export_test@test.com", "password": "pass"})
        token = res.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Örnek bir firma ekle (CSV boş dönmesin diye)
        client.post("/api/v1/firms/", headers=headers, json={
            "name": "CSV Export A.Ş.",
            "tax_number": "999999",
            "field_of_activity": "İhracat",
            "estimated_revenue": 1000000
        })
        
        # 3. CSV dosyasını indirmeyi dene
        print("İndirme isteği (GET /api/v1/firms/export/csv) gönderiliyor...")
        res_export = client.get("/api/v1/firms/export/csv", headers=headers)
        
        assert res_export.status_code == 200
        assert res_export.headers.get("content-type") == "text/csv; charset=utf-8"
        
        # CSV dosyasının içeriğini ekrana bas
        csv_icerik = res_export.text
        print("\n✅ İndirilen CSV İçeriği:")
        print(csv_icerik)
        
        if "CSV Export A.Ş." in csv_icerik:
            print("✅ O6 Testi Başarılı! Firmalar sorunsuz bir şekilde Excel/CSV formatında indirilebiliyor.")
        else:
            print("❌ Test Başarısız! Beklenen firma CSV'de bulunamadı.")

if __name__ == "__main__":
    test_export()
