from sqlalchemy.ext.asyncio import AsyncSession
from app.models.log import SystemLog

async def create_log(db: AsyncSession, action_type: str, details: dict, user_id: int = None):
    """
    T9: Sistemdeki tüm hareketleri (AI çağrıları, hatalar, login) asenkron olarak veritabanına yazar.
    """
    try:
        log_entry = SystemLog(
            user_id=user_id,
            action_type=action_type,
            details=details
        )
        db.add(log_entry)
        await db.commit()
    except Exception as e:
        # Güvenlik önlemi: Log kaydında hata olursa sistemi çökertme, sadece arka planda print et
        print(f"Log Kaydetme Hatası: {e}")
