from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class PremiumRequest(Base):
    __tablename__ = "premium_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    package_name = Column(String, nullable=False) # e.g. "Uzman Görüşü", "Premium Bundle"
    status = Column(String, default="pending") # Durumlar: pending, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
