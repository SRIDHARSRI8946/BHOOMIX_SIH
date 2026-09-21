import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import DATABASE_URL, BASE_DIR

logger = logging.getLogger("bhoomix.database")

Base = declarative_base()
engine = None
SessionLocal = None

def init_db():
    global engine, SessionLocal
    selected_url = DATABASE_URL
    is_mysql = selected_url.startswith("mysql")

    if is_mysql:
        try:
            # First try connecting to verify MySQL server is responsive
            test_engine = create_engine(selected_url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Connected successfully to MySQL database.")
            engine = test_engine
        except Exception as err:
            logger.warning(
                f"Could not connect to MySQL ({err}). Falling back to local SQLite database for uninterrupted operation."
            )
            sqlite_path = BASE_DIR / "bhoomix.db"
            selected_url = f"sqlite:///{sqlite_path}"
            engine = create_engine(selected_url, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(selected_url, connect_args={"check_same_thread": False} if "sqlite" in selected_url else {})

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine

def get_db():
    global SessionLocal
    if SessionLocal is None:
        init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
