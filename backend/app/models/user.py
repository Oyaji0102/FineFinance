from sqlalchemy import Column, Integer, String, Boolean
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    
    # Rol bazlı erişim için (T1)
    is_admin = Column(Boolean, default=False)
    
    # Premium özellik yetkileri (T6, T7)
    is_premium_active = Column(Boolean, default=False)
    
    is_active = Column(Boolean, default=True)
