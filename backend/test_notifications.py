from fastapi.testclient import TestClient
from app.main import app

def test_websocket():
    print("O7: WebSocket (Anlık Bildirim) Sistemi Testi Başlatılıyor...\n" + "-"*40)
    with TestClient(app) as client:
        # FastAPI'nin kendi test istemcisindeki 'websocket_connect' aracını kullanıyoruz
        with client.websocket_connect("/api/v1/notifications/ws") as websocket:
            print("Sunucuya 'ping' mesajı gönderiliyor...")
            websocket.send_text("ping")
            
            print("Sunucunun cevabı bekleniyor...")
            data = websocket.receive_text()
            
            assert data == "pong"
            print(f"Sunucudan gelen cevap: '{data}'")
            print("✅ Test Başarılı! WebSocket tüneli açık ve çift yönlü gerçek zamanlı iletişim sağlanıyor.")

if __name__ == "__main__":
    test_websocket()
