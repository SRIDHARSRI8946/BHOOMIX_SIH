import re
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from ..models import ExistingLandRecord, LandRecordSubmission, OCRResult, ValidationResult

def normalize_text(val: Optional[str]) -> str:
    if not val:
        return ""
    # Lowercase, replace non-alphanumeric with spaces, collapse spaces
    cleaned = re.sub(r'[^a-zA-Z0-9]', ' ', val.lower())
    return " ".join(cleaned.split())

def normalize_survey(val: Optional[str]) -> str:
    if not val:
        return ""
    # Strip spaces around slashes
    return re.sub(r'\s*/\s*', '/', val.strip().lower())

def find_reference_record(
    db: Session,
    survey_number: str,
    village: str,
    taluk: str,
    district: str
) -> Tuple[str, Optional[ExistingLandRecord], List[ExistingLandRecord]]:
    """
    Finds matching reference record using primary search fields:
    1. Survey Number
    2. Village
    3. Taluk
    4. Registration District
    """
    clean_survey = normalize_survey(survey_number)
    clean_village = normalize_text(village)
    clean_taluk = normalize_text(taluk)
    clean_district = normalize_text(district)

    active_records = db.query(ExistingLandRecord).filter(
        ExistingLandRecord.status == "ACTIVE"
    ).all()

    matches = []
    for rec in active_records:
        rec_survey = normalize_survey(rec.survey_number)
        rec_village = normalize_text(rec.village)
        rec_taluk = normalize_text(rec.taluk)
        rec_district = normalize_text(rec.registration_district)

        if (rec_survey == clean_survey and
            rec_village == clean_village and
            rec_taluk == clean_taluk and
            rec_district == clean_district):
            matches.append(rec)

    # Fallback to survey + village if taluk/district had minor transcription difference
    if not matches:
        for rec in active_records:
            rec_survey = normalize_survey(rec.survey_number)
            rec_village = normalize_text(rec.village)
            if rec_survey == clean_survey and rec_village == clean_village:
                matches.append(rec)

    if len(matches) == 1:
        return "FOUND", matches[0], matches
    elif len(matches) == 0:
        return "REFERENCE_RECORD_NOT_FOUND", None, []
    else:
        return "MULTIPLE_REFERENCE_RECORDS_FOUND", None, matches

def compare_field(field_name: str, ocr_val: Optional[str], ref_val: Optional[str], ref_record: Optional[ExistingLandRecord]) -> Dict[str, Any]:
    ocr_str = (ocr_val or "").strip()
    ref_str = (ref_val or "").strip()

    if not ref_str:
        return {
            "field_name": field_name,
            "ocr_value": ocr_str,
            "existing_value": "Not Recorded",
            "match_status": "NOT_AVAILABLE",
            "confidence": 0.5,
            "reason": "Reference value not found in database",
        }

    # Special Rule: Land Extent & Source Notation Check
    if field_name == "Land Extent":
        if ref_record and (
            ref_record.land_extent_unit == "SOURCE_NOTATION_REQUIRES_CONFIRMATION" or
            ref_record.land_extent_numeric is None
        ):
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": f"{ref_str} ({ref_record.land_extent_unit})",
                "match_status": "MANUAL_VERIFICATION_REQUIRED",
                "confidence": 0.6,
                "reason": f"Source notation '{ref_str}' requires Revenue Officer confirmation against submitted '{ocr_str}' (No automatic conversion)",
            }
        
        # Numeric area check if available
        norm_ocr = normalize_text(ocr_str)
        norm_ref = normalize_text(ref_str)
        if norm_ocr == norm_ref:
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MATCH",
                "confidence": 0.95,
                "reason": "Exact match",
            }
        else:
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MISMATCH",
                "confidence": 0.4,
                "reason": f"Area difference detected: '{ocr_str}' vs existing '{ref_str}'",
            }

    # Survey Number Check
    if field_name == "Survey Number":
        if normalize_survey(ocr_str) == normalize_survey(ref_str):
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MATCH",
                "confidence": 0.99,
                "reason": "Normalized survey number matched",
            }
        else:
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MISMATCH",
                "confidence": 0.2,
                "reason": f"Survey number mismatch: '{ocr_str}' != '{ref_str}'",
            }

    # Owner Name Check
    if field_name == "Owner Name":
        norm_ocr = normalize_text(ocr_str)
        norm_ref = normalize_text(ref_str)
        if norm_ocr == norm_ref:
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MATCH",
                "confidence": 0.98,
                "reason": "Exact name match (normalized)",
            }
        elif norm_ocr in norm_ref or norm_ref in norm_ocr:
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MATCH",
                "confidence": 0.88,
                "reason": "Potential match (name partial overlap)",
            }
        else:
            return {
                "field_name": field_name,
                "ocr_value": ocr_str,
                "existing_value": ref_str,
                "match_status": "MISMATCH",
                "confidence": 0.3,
                "reason": f"Owner name mismatch: '{ocr_str}' vs '{ref_str}'",
            }

    # General Text Fields
    if normalize_text(ocr_str) == normalize_text(ref_str):
        return {
            "field_name": field_name,
            "ocr_value": ocr_str,
            "existing_value": ref_str,
            "match_status": "MATCH",
            "confidence": 0.98,
            "reason": "Field matches existing record",
        }
    else:
        return {
            "field_name": field_name,
            "ocr_value": ocr_str,
            "existing_value": ref_str,
            "match_status": "MISMATCH",
            "confidence": 0.4,
            "reason": f"Value differs: '{ocr_str}' vs '{ref_str}'",
        }

def run_submission_validation(db: Session, submission: LandRecordSubmission) -> Dict[str, Any]:
    """
    Validates a citizen submission against existing reference records:
    1. Finds reference record in MySQL.
    2. Runs field-by-field comparisons.
    3. Persists results to validation_results table.
    4. Updates submission validation_status.
    """
    ocr = submission.ocr_result
    if not ocr:
        return {
            "status": "NO_OCR_DATA",
            "message": "Document has not been processed through OCR yet",
            "validation_results": [],
            "requires_manual_verification": True,
        }

    search_status, ref_record, candidates = find_reference_record(
        db=db,
        survey_number=ocr.extracted_survey_number or "",
        village=ocr.extracted_village or "",
        taluk=ocr.extracted_taluk or "",
        district=ocr.extracted_district or "",
    )

    # Clear prior validation results for this submission
    db.query(ValidationResult).filter(ValidationResult.submission_id == submission.id).delete()

    validation_items = []
    has_discrepancy = False
    requires_manual = False

    if search_status == "REFERENCE_RECORD_NOT_FOUND":
        submission.validation_status = "REFERENCE_RECORD_NOT_FOUND"
        submission.approval_status = "MANUAL_VERIFICATION_REQUIRED"
        db.commit()
        return {
            "status": "REFERENCE_RECORD_NOT_FOUND",
            "discrepancy_message": "No matching active reference record found in database. Revenue Officer manual verification required.",
            "citizen_record": _serialize_ocr(ocr),
            "reference_record": None,
            "validation_results": [],
            "requires_manual_verification": True,
        }

    if search_status == "MULTIPLE_REFERENCE_RECORDS_FOUND":
        submission.validation_status = "MULTIPLE_REFERENCE_RECORDS_FOUND"
        submission.approval_status = "MANUAL_VERIFICATION_REQUIRED"
        db.commit()
        return {
            "status": "MULTIPLE_REFERENCE_RECORDS_FOUND",
            "discrepancy_message": f"Multiple potential reference records found ({len(candidates)}). Officer selection required.",
            "citizen_record": _serialize_ocr(ocr),
            "reference_record": None,
            "validation_results": [],
            "requires_manual_verification": True,
        }

    # Reference record found: compare 8 key fields
    field_pairs = [
        ("Owner Name", ocr.extracted_owner_name, ref_record.owner_name),
        ("Survey Number", ocr.extracted_survey_number, ref_record.survey_number),
        ("Village", ocr.extracted_village, ref_record.village),
        ("Taluk", ocr.extracted_taluk, ref_record.taluk),
        ("Registration District", ocr.extracted_district, ref_record.registration_district),
        ("Document Number", ocr.extracted_document_number, ref_record.document_number),
        ("Document Date", ocr.extracted_document_date, ref_record.document_date),
        ("Land Extent", ocr.extracted_area, ref_record.land_extent_text),
    ]

    is_verified = submission.approval_status in ("MANUAL_VERIFICATION_COMPLETED", "APPROVED")
    is_under_progress = submission.approval_status == "UNDER_MANUAL_VERIFICATION"

    for field_name, ocr_val, ref_val in field_pairs:
        res = compare_field(field_name, ocr_val, ref_val, ref_record)

        # If officer completed manual verification, mark discrepancy field as reconciled
        if is_verified and res["match_status"] in ("MISMATCH", "MANUAL_VERIFICATION_REQUIRED"):
            res["match_status"] = "MANUAL_VERIFICATION_COMPLETED"
            res["confidence"] = 1.0
            res["reason"] = f"Manual verification completed by Revenue Officer: Historical deed and source notation reconciled and confirmed."

        validation_items.append(res)

        if res["match_status"] in ("MISMATCH", "MANUAL_VERIFICATION_REQUIRED"):
            has_discrepancy = True
            requires_manual = True

        # Save to database
        db_val = ValidationResult(
            submission_id=submission.id,
            existing_record_id=ref_record.id,
            field_name=res["field_name"],
            ocr_value=res["ocr_value"],
            existing_value=res["existing_value"],
            match_status=res["match_status"],
            confidence=res["confidence"],
            reason=res["reason"],
        )
        db.add(db_val)

    if is_verified:
        if submission.approval_status == "APPROVED":
            discrepancy_message = "Record verified and approved by Revenue Officer."
        else:
            discrepancy_message = "Manual verification completed by Revenue Officer – Field discrepancies reconciled. Record ready for formal approval."
    elif is_under_progress:
        submission.validation_status = "UNDER_MANUAL_VERIFICATION"
        submission.approval_status = "UNDER_MANUAL_VERIFICATION"
        discrepancy_message = "Discrepancy is currently under manual verification by Revenue Officer (Under Progress)."
        requires_manual = True
    elif has_discrepancy:
        submission.validation_status = "DISCREPANCY_DETECTED"
        submission.approval_status = "MANUAL_VERIFICATION_REQUIRED"
        discrepancy_message = "Discrepancy detected between submitted document and reference record – Revenue Officer verification required."
    else:
        submission.validation_status = "MATCHED"
        submission.approval_status = "UNDER_REVIEW"
        discrepancy_message = "All primary record fields matched with reference database."

    db.commit()

    return {
        "status": submission.validation_status,
        "discrepancy_message": discrepancy_message,
        "citizen_record": _serialize_ocr(ocr),
        "reference_record": _serialize_ref(ref_record),
        "validation_results": validation_items,
        "requires_manual_verification": requires_manual,
    }

def _serialize_ocr(ocr: OCRResult) -> Dict[str, Any]:
    return {
        "owner_name": ocr.extracted_owner_name,
        "survey_number": ocr.extracted_survey_number,
        "area": ocr.extracted_area,
        "village": ocr.extracted_village,
        "taluk": ocr.extracted_taluk,
        "district": ocr.extracted_district,
        "document_number": ocr.extracted_document_number,
        "document_date": ocr.extracted_document_date,
        "sub_registrar_office": ocr.extracted_sub_registrar_office,
        "overall_confidence": ocr.overall_confidence,
    }

def _serialize_ref(rec: Optional[ExistingLandRecord]) -> Optional[Dict[str, Any]]:
    if not rec:
        return None
    return {
        "id": rec.id,
        "record_id": rec.record_id,
        "owner_name": rec.owner_name,
        "survey_number": rec.survey_number,
        "village": rec.village,
        "taluk": rec.taluk,
        "registration_district": rec.registration_district,
        "sub_registrar_office": rec.sub_registrar_office,
        "document_number": rec.document_number,
        "document_date": rec.document_date,
        "land_extent_text": rec.land_extent_text,
        "land_extent_numeric": rec.land_extent_numeric,
        "land_extent_unit": rec.land_extent_unit,
        "status": rec.status,
        "source_type": rec.source_type,
    }
