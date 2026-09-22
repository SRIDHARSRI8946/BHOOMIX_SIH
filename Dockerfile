# ==============================================================================
# Stage 1: Build the React (Vite) Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Install dependencies
COPY client/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source and build static assets
COPY client/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Production Python Runtime with FastAPI & OCR support
# ==============================================================================
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000 \
    CLIENT_DIST_DIR=/app/client_dist \
    UPLOAD_DIR=/app/uploads/private

WORKDIR /app

# Install system dependencies (Tesseract OCR, fonts, and required native libraries)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    poppler-utils \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/app ./app
COPY backend/reset_documents.py ./

# Copy compiled frontend dist from Stage 1
COPY --from=frontend-builder /app/client/dist ./client_dist

# Create uploads and data directories
RUN mkdir -p /app/uploads/private /app/data

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

EXPOSE 5000

# Start unified BhoomiX server with dynamic PORT expansion
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-5000}"]
