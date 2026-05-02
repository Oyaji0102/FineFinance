from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PremiumRequestCreate(BaseModel):
    package_name: str

class PremiumRequestResponse(BaseModel):
    id: int
    user_id: int
    package_name: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
