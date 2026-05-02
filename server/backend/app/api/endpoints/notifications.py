from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class NotificationManager:
    def __init__(self):
        # Gerçekte her kullanıcının ID'sine göre soket saklanır {user_id: websocket}
        # Hackathon için genel bir yayın (broadcast) havuzu kuruyoruz.
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_json({"type": "notification", "message": message})

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_json({"type": "broadcast", "message": message})

# Sistemin her yerinden (Örn: admin premium'u onaylayınca) ulaşılabilecek global yönetici
manager = NotificationManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    O7 Bonus: Anlık Bildirim (WebSocket) Altyapısı
    Kullanıcılar React/Flutter uygulamasını açtığında bu sokete bağlanır.
    Premium onaylandığında veya yapay zeka analizi bittiğinde sayfayı yenilemeden bildirim alırlar.
    """
    await manager.connect(websocket)
    try:
        while True:
            # İstemciden (Frontend) gelen mesajları dinle
            data = await websocket.receive_text()
            if data == "ping":
                # Bağlantının canlı olduğunu doğrulamak için yanıt ver
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
