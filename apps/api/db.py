# Database setup and session helpers for the LaunchCircle API.
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _database_url() -> str:
    # Prefer DATABASE_URL (local/dev), fall back to POSTGRES_URL used in Docker.
    return os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or "sqlite:///./dev.db"


def _create_engine(url: str):
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, connect_args=connect_args, future=True, pool_pre_ping=True)


DATABASE_URL = _database_url()
engine = _create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(seed: bool = True) -> None:
    # Create tables and optionally add seed data if the database is empty.
    from models import Base as ModelBase  # Lazy import to avoid circular deps.
    from seed import seed_database

    ModelBase.metadata.create_all(bind=engine)
    if seed:
        with SessionLocal() as session:
            seed_database(session)
