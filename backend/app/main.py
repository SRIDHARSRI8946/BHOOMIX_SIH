import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import FRONTEND_ORIGIN
from . import database
from .seed import seed_database
from .routers import auth, citizen, officer, existing_records, pdf, audit

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("bhoomix.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and seed data
    logger.info("Initializing BhoomiX database...")
    engine = database.init_db()
    database.Base.metadata.create_all(bind=engine)
    with database.SessionLocal() as session:
        seed_database(session)
    logger.info("BhoomiX Backend Services initialized successfully.")
    yield
    logger.info("Shutting down BhoomiX Backend...")

app = FastAPI(
    title="BHOOMIX API",
    description="AI-Powered Historical Land Record Digitization and Revenue Verification System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration - Support ports 3000, 3001, 3002, 5173, etc.
origins = [
    FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(citizen.router, prefix="/api")
app.include_router(officer.router, prefix="/api")
app.include_router(existing_records.router, prefix="/api")
app.include_router(pdf.router, prefix="/api")
app.include_router(audit.router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "BHOOMIX",
        "description": "AI-Powered Historical Land Record Digitization and Revenue Verification System",
        "status": "online",
        "disclaimer": "PROTOTYPE SYSTEM – DEMO DATA ONLY"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "bhoomix-core"}
