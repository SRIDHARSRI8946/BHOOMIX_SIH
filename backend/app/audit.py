import json
import logging
from typing import Optional, Any
from sqlalchemy.orm import Session
from fastapi import Request
from .models import AuditLog

logger = logging.getLogger("bhoomix.audit")

def log_audit(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: str,
    user_id: Optional[int] = None,
    details: Optional[Any] = None,
    request: Optional[Request] = None,
):
    ip_address = None
    if request:
        client = request.client
        if client:
            ip_address = client.host
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip_address = forwarded.split(",")[0].strip()

    details_str = None
    if details is not None:
        if isinstance(details, (dict, list)):
            details_str = json.dumps(details, default=str)
        else:
            details_str = str(details)

    audit_entry = AuditLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        ip_address=ip_address or "127.0.0.1",
        details=details_str,
    )
    db.add(audit_entry)
    try:
        db.commit()
    except Exception as err:
        db.rollback()
        logger.error(f"Failed to record audit log: {err}")
