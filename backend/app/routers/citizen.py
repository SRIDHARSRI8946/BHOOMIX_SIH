import os
import json
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Citizen, LandRecordSubmission, OCRResult
from ..schemas import OCRResultUpdate
from ..dependencies import require_citizen
from ..services.file_service import validate_and_save_file
from ..services.ocr_service import process_document_ocr
from ..services.validation_service import run_submission_validation
from ..audit import log_audit

router = APIRouter(prefix="/citizen", tags=["Citizen Operations"])

def generate_submission_ref() -> str:
    year = datetime.utcnow().year
    rand_id = f"{random.randint(100000, 999999)}"
    return f"BX-{year}-{rand_id}"

@router.post("/upload")
def upload_document(
    request: Request,
    file: UploadFile = File(...),
    auth_data: tuple[User, Citizen] = Depends(require_citizen),
    db: Session = Depends(get_db),
):
    user, citizen = auth_data

    # 1. Validate and save file securely
    stored_name, file_path, file_hash, file_size = validate_and_save_file(file)

    sub_ref = generate_submission_ref()

    # 2. Create submission record
    submission = LandRecordSubmission(
        citizen_id=citizen.id,
        submission_reference=sub_ref,
        original_filename=file.filename or "unknown.pdf",
        stored_filename=stored_name,
        file_path=file_path,
        file_hash=file_hash,
        file_size_bytes=file_size,
        mime_type=file.content_type or "application/octet-stream",
        upload_status="UPLOADED",
        ocr_status="OCR_PROCESSING",
        validation_status="PENDING",
        approval_status="DRAFT",
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    log_audit(
        db=db,
        action="DOCUMENT_UPLOADED",
        entity_type="SUBMISSION",
        entity_id=str(submission.id),
        user_id=user.id,
        details={"ref": sub_ref, "size_bytes": file_size, "hash": file_hash},
        request=request,
    )

    # 3. Process OCR pipeline
    log_audit(
        db=db,
        action="OCR_STARTED",
        entity_type="SUBMISSION",
        entity_id=str(submission.id),
        user_id=user.id,
        details={"ref": sub_ref},
        request=request,
    )

    ocr_data = process_document_ocr(file_path=file_path, original_filename=file.filename or "")

    ocr_result = OCRResult(
        submission_id=submission.id,
        extracted_owner_name=ocr_data["owner_name"],
        extracted_survey_number=ocr_data["survey_number"],
        extracted_area=ocr_data["area"],
        extracted_village=ocr_data["village"],
        extracted_taluk=ocr_data["taluk"],
        extracted_district=ocr_data["district"],
        extracted_document_number=ocr_data["document_number"],
        extracted_document_date=ocr_data["document_date"],
        extracted_sub_registrar_office=ocr_data.get("sub_registrar_office", ""),
        extracted_text=ocr_data["raw_text"],
        overall_confidence=ocr_data["overall_confidence"],
        field_confidences=json.dumps(ocr_data["field_confidences"]),
    )
    db.add(ocr_result)

    submission.ocr_status = "OCR_COMPLETED"
    submission.approval_status = "READY_FOR_SUBMISSION"
    db.commit()

    log_audit(
        db=db,
        action="OCR_COMPLETED",
        entity_type="SUBMISSION",
        entity_id=str(submission.id),
        user_id=user.id,
        details={"ref": sub_ref, "confidence": ocr_data["overall_confidence"]},
        request=request,
    )

    return {
        "message": "Document uploaded and OCR processed successfully",
        "submission_id": submission.id,
        "submission_reference": submission.submission_reference,
        "status": submission.approval_status,
        "ocr_result": {
            "owner_name": ocr_result.extracted_owner_name,
            "survey_number": ocr_result.extracted_survey_number,
            "area": ocr_result.extracted_area,
            "village": ocr_result.extracted_village,
            "taluk": ocr_result.extracted_taluk,
            "district": ocr_result.extracted_district,
            "document_number": ocr_result.extracted_document_number,
            "document_date": ocr_result.extracted_document_date,
            "sub_registrar_office": ocr_result.extracted_sub_registrar_office,
            "raw_text": ocr_result.extracted_text,
            "overall_confidence": ocr_result.overall_confidence,
            "field_confidences": ocr_data["field_confidences"],
        }
    }

@router.put("/submissions/{submission_id}/ocr-review")
def update_ocr_transcription(
    submission_id: int,
    data: OCRResultUpdate,
    request: Request,
    auth_data: tuple[User, Citizen] = Depends(require_citizen),
    db: Session = Depends(get_db),
):
    user, citizen = auth_data
    submission = db.query(LandRecordSubmission).filter(
        LandRecordSubmission.id == submission_id,
        LandRecordSubmission.citizen_id == citizen.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if submission.approval_status not in ("READY_FOR_SUBMISSION", "DRAFT"):
        raise HTTPException(
            status_code=400,
            detail="Cannot modify OCR data after submission to Revenue Officer"
        )

    ocr = submission.ocr_result
    if not ocr:
        raise HTTPException(status_code=400, detail="OCR record not found")

    if data.extracted_owner_name is not None:
        ocr.extracted_owner_name = data.extracted_owner_name.strip()
    if data.extracted_survey_number is not None:
        ocr.extracted_survey_number = data.extracted_survey_number.strip()
    if data.extracted_area is not None:
        ocr.extracted_area = data.extracted_area.strip()
    if data.extracted_village is not None:
        ocr.extracted_village = data.extracted_village.strip()
    if data.extracted_taluk is not None:
        ocr.extracted_taluk = data.extracted_taluk.strip()
    if data.extracted_district is not None:
        ocr.extracted_district = data.extracted_district.strip()
    if data.extracted_document_number is not None:
        ocr.extracted_document_number = data.extracted_document_number.strip()
    if data.extracted_document_date is not None:
        ocr.extracted_document_date = data.extracted_document_date.strip()
    if data.extracted_sub_registrar_office is not None:
        ocr.extracted_sub_registrar_office = data.extracted_sub_registrar_office.strip()

    db.commit()

    log_audit(
        db=db,
        action="CITIZEN_EDITED_OCR",
        entity_type="SUBMISSION",
        entity_id=str(submission.id),
        user_id=user.id,
        details={"ref": submission.submission_reference},
        request=request,
    )

    return {"message": "Extracted record updated", "ocr_id": ocr.id}

@router.post("/submissions/{submission_id}/submit")
def submit_to_officer(
    submission_id: int,
    request: Request,
    auth_data: tuple[User, Citizen] = Depends(require_citizen),
    db: Session = Depends(get_db),
):
    user, citizen = auth_data
    submission = db.query(LandRecordSubmission).filter(
        LandRecordSubmission.id == submission_id,
        LandRecordSubmission.citizen_id == citizen.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if submission.approval_status not in ("READY_FOR_SUBMISSION", "DRAFT"):
        raise HTTPException(status_code=400, detail="Document has already been submitted to Revenue Officer")

    submission.approval_status = "SUBMITTED_TO_OFFICER"
    submission.submitted_at = datetime.utcnow()
    db.commit()

    # Trigger automatic comparison against existing reference database
    validation_res = run_submission_validation(db, submission)

    log_audit(
        db=db,
        action="SUBMISSION_SUBMITTED",
        entity_type="SUBMISSION",
        entity_id=str(submission.id),
        user_id=user.id,
        details={"ref": submission.submission_reference, "validation_status": submission.validation_status},
        request=request,
    )

    return {
        "message": "Submission received and sent to Revenue Officer queue",
        "submission_reference": submission.submission_reference,
        "approval_status": submission.approval_status,
        "validation_status": submission.validation_status,
        "discrepancy_detected": validation_res["status"] == "DISCREPANCY_DETECTED",
    }

@router.get("/submissions")
def get_citizen_submissions(
    auth_data: tuple[User, Citizen] = Depends(require_citizen),
    db: Session = Depends(get_db),
):
    user, citizen = auth_data
    submissions = db.query(LandRecordSubmission).filter(
        LandRecordSubmission.citizen_id == citizen.id
    ).order_by(LandRecordSubmission.created_at.desc()).all()

    results = []
    for s in submissions:
        ocr = s.ocr_result
        has_approval_pdf = bool(s.approval_record and s.approval_record.pdf_path)
        results.append({
            "id": s.id,
            "submission_reference": s.submission_reference,
            "original_filename": s.original_filename,
            "upload_status": s.upload_status,
            "ocr_status": s.ocr_status,
            "validation_status": s.validation_status,
            "approval_status": s.approval_status,
            "submitted_at": s.submitted_at,
            "created_at": s.created_at,
            "survey_number": ocr.extracted_survey_number if ocr else None,
            "owner_name": ocr.extracted_owner_name if ocr else None,
            "village": ocr.extracted_village if ocr else None,
            "district": ocr.extracted_district if ocr else None,
            "overall_confidence": ocr.overall_confidence if ocr else None,
            "has_approval_pdf": has_approval_pdf,
            "approval_reference": s.approval_record.approval_reference if s.approval_record else None,
            "approval_date": s.approval_record.approval_date if s.approval_record else None,
        })
    return results

@router.get("/submissions/{submission_id}")
def get_submission_detail(
    submission_id: int,
    auth_data: tuple[User, Citizen] = Depends(require_citizen),
    db: Session = Depends(get_db),
):
    user, citizen = auth_data
    submission = db.query(LandRecordSubmission).filter(
        LandRecordSubmission.id == submission_id,
        LandRecordSubmission.citizen_id == citizen.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    ocr = submission.ocr_result
    confidences = {}
    if ocr and ocr.field_confidences:
        try:
            confidences = json.loads(ocr.field_confidences)
        except Exception:
            pass

    return {
        "id": submission.id,
        "submission_reference": submission.submission_reference,
        "original_filename": submission.original_filename,
        "upload_status": submission.upload_status,
        "ocr_status": submission.ocr_status,
        "validation_status": submission.validation_status,
        "approval_status": submission.approval_status,
        "submitted_at": submission.submitted_at,
        "created_at": submission.created_at,
        "ocr_result": {
            "owner_name": ocr.extracted_owner_name if ocr else None,
            "survey_number": ocr.extracted_survey_number if ocr else None,
            "area": ocr.extracted_area if ocr else None,
            "village": ocr.extracted_village if ocr else None,
            "taluk": ocr.extracted_taluk if ocr else None,
            "district": ocr.extracted_district if ocr else None,
            "document_number": ocr.extracted_document_number if ocr else None,
            "document_date": ocr.extracted_document_date if ocr else None,
            "sub_registrar_office": ocr.extracted_sub_registrar_office if ocr else None,
            "raw_text": ocr.extracted_text if ocr else None,
            "overall_confidence": ocr.overall_confidence if ocr else None,
            "field_confidences": confidences,
        } if ocr else None,
        "approval_record": {
            "approval_reference": submission.approval_record.approval_reference,
            "approval_date": submission.approval_record.approval_date,
            "remarks": submission.approval_record.remarks,
        } if submission.approval_record else None,
    }

@router.get("/submissions/{submission_id}/document-file")
def view_document_file(
    submission_id: int,
    auth_data: tuple[User, Citizen] = Depends(require_citizen),
    db: Session = Depends(get_db),
):
    user, citizen = auth_data
    submission = db.query(LandRecordSubmission).filter(
        LandRecordSubmission.id == submission_id,
        LandRecordSubmission.citizen_id == citizen.id
    ).first()

    if not submission or not os.path.exists(submission.file_path):
        raise HTTPException(status_code=404, detail="Document file not found")

    return FileResponse(
        path=submission.file_path,
        media_type=submission.mime_type,
        filename=submission.original_filename
    )
