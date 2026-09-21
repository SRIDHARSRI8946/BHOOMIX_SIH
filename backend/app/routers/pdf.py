import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, LandRecordSubmission, ApprovalRecord
from ..dependencies import get_current_user

from typing import Optional
from fastapi.security import HTTPAuthorizationCredentials
from ..dependencies import security_scheme
from ..security import decode_access_token

router = APIRouter(prefix="/pdf", tags=["PDF Generation & Download"])

@router.get("/download/{submission_id}")
def download_approval_pdf(
    submission_id: int,
    token: Optional[str] = None,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
):
    submission = db.query(LandRecordSubmission).filter(
        LandRecordSubmission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Resolve token from Bearer header or ?token= query parameter
    auth_token = None
    if credentials and credentials.credentials:
        auth_token = credentials.credentials
    elif token:
        auth_token = token

    if auth_token:
        payload = decode_access_token(auth_token)
        if payload and payload.get("sub"):
            current_user = db.query(User).filter(User.id == int(payload["sub"])).first()
            if current_user and current_user.role == "CITIZEN":
                if not submission.citizen or submission.citizen.user_id != current_user.id:
                    raise HTTPException(status_code=403, detail="Not authorized to access this approval document")

    approval = submission.approval_record
    if not approval or not approval.pdf_path or not os.path.exists(approval.pdf_path):
        raise HTTPException(
            status_code=404,
            detail="Approval PDF has not been generated for this record yet"
        )

    return FileResponse(
        path=approval.pdf_path,
        media_type="application/pdf",
        filename=f"BhoomiX_Approval_{approval.approval_reference}.pdf"
    )

@router.get("/verify/{approval_ref}")
def verify_approval_public(
    approval_ref: str,
    db: Session = Depends(get_db),
):
    """
    Public non-sensitive verification endpoint encoded in the QR code.
    Confirms whether a prototype approval reference exists.
    """
    approval = db.query(ApprovalRecord).filter(
        ApprovalRecord.approval_reference == approval_ref
    ).first()

    if not approval:
        return {
            "valid": False,
            "message": "Prototype approval record reference not found."
        }

    submission = approval.submission
    ocr = submission.ocr_result if submission else None

    return {
        "valid": True,
        "prototype_notice": "THIS IS A PROTOTYPE VERIFICATION RECORD AND IS NOT A GOVERNMENT CERTIFICATE.",
        "approval_reference": approval.approval_reference,
        "decision": approval.decision,
        "approval_date": approval.approval_date,
        "survey_number": ocr.extracted_survey_number if ocr else None,
        "village": ocr.extracted_village if ocr else None,
        "district": ocr.extracted_district if ocr else None,
        "officer_code": approval.officer.officer_code if approval.officer else None,
    }
