from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FirmBase(BaseModel):
    name: str
    tax_number: Optional[str] = None
    trade_registry_number: Optional[str] = None
    field_of_activity: Optional[str] = None
    contact_person: Optional[str] = None
    address: Optional[str] = None
    estimated_revenue: Optional[float] = None

class FirmCreate(FirmBase):
    foundation_date: Optional[datetime] = None

class FirmUpdate(FirmBase):
    foundation_date: Optional[datetime] = None
    is_approved: Optional[bool] = None

class FirmResponse(FirmBase):
    id: int
    is_approved: bool
    foundation_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
