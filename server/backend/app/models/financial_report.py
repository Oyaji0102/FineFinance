from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class FinancialReport(Base):
    __tablename__ = "financial_reports"

    id = Column(Integer, primary_key=True, index=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), index=True, nullable=False)
    
    # Dosya bilgisi
    file_name = Column(String)
    file_type = Column(String)  # pdf, excel, image
    
    # Açıklanan veriler
    current_assets = Column(Float, nullable=True)
    total_liabilities = Column(Float, nullable=True)
    net_income = Column(Float, nullable=True)
    estimated_revenue = Column(Float, nullable=True)
    
    # Tam çıkarılan veri (JSON)
    extracted_data = Column(JSON, nullable=True)
    
    # AI analiz sonuçları
    ai_analysis = Column(JSON, nullable=True)
    financial_score = Column(Float, nullable=True)
    
    # Tarih
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
