import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from .config import FRONTEND_ORIGIN, CLIENT_DIST_DIR
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

# CORS Configuration - Support localhost, FRONTEND_ORIGIN, and cloud deployments
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
    "http://localhost:5000",
    "http://127.0.0.1:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?:\/\/.*$",
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

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "bhoomix-core"}

# Frontend SPA Static Files Serving
if CLIENT_DIST_DIR and CLIENT_DIST_DIR.exists():
    logger.info(f"Serving unified Frontend SPA from: {CLIENT_DIST_DIR}")
    assets_dir = CLIENT_DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Keep /api routes within API handling
        if full_path.startswith("api"):
            return JSONResponse(status_code=404, content={"detail": f"API endpoint /{full_path} not found"})

        # Serve direct static files (e.g. vite.svg, favicon.ico) if present
        potential_file = CLIENT_DIST_DIR / full_path
        if full_path and potential_file.is_file():
            return FileResponse(potential_file)

        # SPA Fallback for client-side routing (/login, /dashboard, etc.)
        index_file = CLIENT_DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"detail": "Frontend index.html not found"})
else:
    logger.info("Running in standalone backend mode (no frontend build detected).")

    @app.get("/")
    def root():
        return {
            "system": "BHOOMIX",
            "description": "AI-Powered Historical Land Record Digitization and Revenue Verification System",
            "status": "online",
            "disclaimer": "PROTOTYPE SYSTEM – DEMO DATA ONLY"
        }

