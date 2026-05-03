from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class FinancialReportBase(BaseModel):
    firm_id: int
    file_name: Optional[str] = None
    file_type: Optional[str] = None

class FinancialReportCreate(FinancialReportBase):
    current_assets: Optional[float] = None
    total_liabilities: Optional[float] = None
    net_income: Optional[float] = None
    estimated_revenue: Optional[float] = None
    extracted_data: Optional[Dict[str, Any]] = None
    ai_analysis: Optional[Dict[str, Any]] = None
    financial_score: Optional[float] = None

class FinancialReportResponse(FinancialReportCreate):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
