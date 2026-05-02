from fastapi.testclient import TestClient
from app.main import app
import uuid

def test_api():
    print("Test Senaryosu Başlatılıyor...\n" + "-"*40)
    
    with TestClient(app) as client:
        unique_id = str(uuid.uuid4())[:8]
        test_email = f"test_{unique_id}@finefinance.com"
        test_pass = "GucluSifre123"
        
        # 1. Kayıt Olma Testi
        print(f"1. Kullanıcı Kaydı Test Ediliyor ({test_email})...")
        res = client.post("/api/v1/auth/register", json={
            "email": test_email,
            "full_name": "Test Kullanıcısı",
            "password": test_pass
        })
        if res.status_code != 200:
            print(f"❌ Kayıt Başarısız: {res.status_code} - {res.text}")
            return
        print("✅ Kayıt Başarılı!")
        
        # 2. Giriş Yapma Testi
        print("\n2. Sisteme Giriş (Login) Test Ediliyor...")
        res = client.post("/api/v1/auth/login", data={
            "username": test_email,
            "password": test_pass
        })
        if res.status_code != 200:
            print(f"❌ Giriş Başarısız: {res.status_code} - {res.text}")
            return
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Giriş Başarılı, Token Alındı!")
        
        # 3. Firma Oluşturma Testi
        print("\n3. Firma Oluşturma (CRUD) Test Ediliyor...")
        res = client.post("/api/v1/firms/", headers=headers, json={
            "name": f"Test Şirketi {unique_id}",
            "tax_number": f"12345_{unique_id}",
            "field_of_activity": "Teknoloji",
            "estimated_revenue": 5000000
        })
        if res.status_code != 200:
            print(f"❌ Firma Oluşturma Başarısız: {res.status_code} - {res.text}")
            return
        firm_id = res.json()["id"]
        print(f"✅ Firma Başarıyla Oluşturuldu (ID: {firm_id})!")
        
        # 4. Premium Talep Testi
        print("\n4. Premium Satın Alma Talebi Test Ediliyor...")
        res = client.post("/api/v1/premium/request", headers=headers, json={
            "package_name": "Uzman Görüşü Paketi"
        })
        if res.status_code != 200:
            print(f"❌ Premium Talebi Başarısız: {res.status_code} - {res.text}")
            return
        print("✅ Premium Talebi Başarıyla Oluşturuldu (Admin onayına düştü)!")
        
        # 5. Premium Kısıtlama Testi (T7)
        print("\n5. Kısıtlı AI Raporu Bölümüne Erişim (403 Bekleniyor) Test Ediliyor...")
        res = client.post("/api/v1/analysis/report", headers=headers, json={
            "firm_id": firm_id,
            "financial_data": {"revenue": 5000000}
        })
        
        if res.status_code == 403:
            print("✅ T7 Güvenlik Testi Başarılı! Sistem standart kullanıcının premium özelliğe erişmesini engelledi (403 Forbidden).")
        else:
            print(f"❌ Güvenlik Zafiyeti! Sistem erişimi engellemedi veya farklı bir hata verdi: {res.status_code} - {res.text}")
            
    print("\n" + "-"*40 + "\nTüm Testler Tamamlandı!")

if __name__ == "__main__":
    test_api()
