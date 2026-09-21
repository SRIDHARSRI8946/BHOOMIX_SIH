import os
import uuid
import hashlib
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from ..config import UPLOAD_DIR, MAX_UPLOAD_SIZE_MB, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES

def validate_and_save_file(file: UploadFile) -> tuple[str, str, str, int]:
    """
    Validates uploaded file:
    - MIME type
    - Extension allowlist
    - File size limit
    - Generates cryptographically safe random filename (UUID4)
    - Computes SHA-256 hash
    - Stores file in private directory outside web root

    Returns:
        (stored_filename, file_path_str, sha256_hash, file_size_bytes)
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing"
        )

    # Check extension
    orig_ext = Path(file.filename).suffix.lower()
    if orig_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{orig_ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Check content type
    content_type = file.content_type or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported MIME type '{content_type}'. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
        )

    # Generate random filename (UUID4) - NEVER use citizen original filename
    stored_filename = f"{uuid.uuid4().hex}{orig_ext}"
    target_path = UPLOAD_DIR / stored_filename

    # Ensure target path does not escape UPLOAD_DIR (path traversal protection)
    if not target_path.resolve().is_relative_to(UPLOAD_DIR.resolve()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Illegal file path manipulation detected"
        )

    # Read and hash chunks to avoid high memory spike
    sha256 = hashlib.sha256()
    total_bytes = 0
    max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024

    with open(target_path, "wb") as buffer:
        while True:
            chunk = file.file.read(64 * 1024)
            if not chunk:
                break
            total_bytes += len(chunk)
            if total_bytes > max_bytes:
                buffer.close()
                if target_path.exists():
                    target_path.unlink()
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds maximum allowed size of {MAX_UPLOAD_SIZE_MB}MB"
                )
            sha256.update(chunk)
            buffer.write(chunk)

    file_hash = sha256.hexdigest()
    return stored_filename, str(target_path.resolve()), file_hash, total_bytes
