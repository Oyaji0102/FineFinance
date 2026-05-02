from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FineFinance API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkey_degistirilmeli_hackathon" # T1: JWT için
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 gün
    GEMINI_API_KEY: str = ""
    
    # DB (MVP hızlandırması için SQLite ile başlıyoruz)
    SQLALCHEMY_DATABASE_URI: str = "sqlite+aiosqlite:///./finefinance.db"

    class Config:
        env_file = ".env"
        extra = "ignore"  # .env'deki bilinmeyen alanları görmezden gel

settings = Settings()
