from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AuditLog, User, RevenueOfficer
from ..schemas import AuditLogOut
from ..dependencies import require_officer

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("/logs")
def get_audit_logs(
    limit: int = Query(50, le=200),
    auth_data: tuple[User, RevenueOfficer] = Depends(require_officer),
    db: Session = Depends(get_db),
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()

    output = []
    for l in logs:
        user_name = l.user.full_name if l.user else "System"
        user_role = l.user.role if l.user else "SYSTEM"
        output.append({
            "id": l.id,
            "user_name": user_name,
            "user_role": user_role,
            "action": l.action,
            "entity_type": l.entity_type,
            "entity_id": l.entity_id,
            "ip_address": l.ip_address,
            "timestamp": l.timestamp,
            "details": l.details,
        })
    return output
