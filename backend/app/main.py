import sys, os
# AI_core modülünün (proje kökünde /FineFinance) backend içinden görünmesi için
_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.api import api_router
from app.db.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Veritabanı tablolarını otomatik oluştur (Alembic kurana kadar hızlı başlangıç)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS (React/Flutter frontend'in engellenmeden API'ye istek atabilmesi için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "FineFinance API'ye Hoş Geldiniz!"}
