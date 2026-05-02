from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class SystemLog(Base):
    __tablename__ = "system_logs"

    # T10 (Veritabanı optimizasyonu): Loglarda hızlı arama yapabilmek için index=True kullanıyoruz.
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True) # Hangi kullanıcı? (Ziyaretçiyse null)
    action_type = Column(String, index=True) # Olay tipi: LOGIN, CRUD_FIRM, AI_CALL, OCR_CALL, ERROR
    details = Column(JSON) # Detaylı veri: Örn: "AI Yanıt Süresi: 1.2sn", "Hata detayı:..."
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
