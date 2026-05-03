from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MembershipBase(BaseModel):
    plan_type: str = "free"
    monthly_price: float = 0
    annual_price: float = 0
    description: Optional[str] = None

class MembershipCreate(MembershipBase):
    user_id: int

class MembershipUpdate(BaseModel):
    plan_type: Optional[str] = None
    is_active: Optional[bool] = None
    expires_at: Optional[datetime] = None

class MembershipResponse(MembershipBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
