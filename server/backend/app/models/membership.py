from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    
    # Üyelik türü
    plan_type = Column(String, default="free")  # free, basic, premium
    
    # Pricing bilgisi
    monthly_price = Column(Float, default=0)
    annual_price = Column(Float, default=0)
    
    # Üyelik durumu
    is_active = Column(Boolean, default=True)
    
    # Tarihler
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Açıklama
    description = Column(String, nullable=True)
