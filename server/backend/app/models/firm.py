from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Firm(Base):
    __tablename__ = "firms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    tax_number = Column(String, unique=True, index=True)
    trade_registry_number = Column(String)
    foundation_date = Column(DateTime)
    field_of_activity = Column(String)
    contact_person = Column(String)
    address = Column(String)
    estimated_revenue = Column(Float)
    
    # Yönetici (Admin) bu firmayı onayladı mı? (T2)
    is_approved = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # İleride eklenecek:
    # financial_reports = relationship("FinancialReport", back_populates="firm")
