from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# engine'i oluştur. echo=True geliştirme aşamasında SQL sorgularını terminalde gösterir.
engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

# Dependency (API endpoint'lerinde veritabanı bağlantısı almak için)
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
