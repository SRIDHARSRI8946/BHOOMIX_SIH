import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", BASE_DIR / "uploads" / "private"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Try loading .env if exists
env_path = BASE_DIR / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())

# Database Settings
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "bhoomix")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    if MYSQL_PASSWORD:
        DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    else:
        DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"

# JWT & Auth
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "bhoomix-super-secure-jwt-secret-key-2026-sih")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Security Limits
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15"))
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
}

# CORS
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# Server & Static Serving
PORT = int(os.getenv("PORT", "5000"))
HOST = os.getenv("HOST", "0.0.0.0")

# Static frontend assets directory
def resolve_client_dist():
    custom_dir = os.getenv("CLIENT_DIST_DIR")
    if custom_dir:
        p = Path(custom_dir)
        if p.exists():
            return p
    # Bundled container path: ./client_dist
    bundled = BASE_DIR / "client_dist"
    if bundled.exists() and (bundled / "index.html").exists():
        return bundled
    # Local dev workspace path: ../client/dist
    local_dist = BASE_DIR.parent / "client" / "dist"
    if local_dist.exists() and (local_dist / "index.html").exists():
        return local_dist
    return None

CLIENT_DIST_DIR = resolve_client_dist()

