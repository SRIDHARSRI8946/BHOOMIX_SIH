from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Authentication
class UserLogin(BaseModel):
    email: str
    password: str

class CitizenRegister(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    confirm_password: str
    address: str

class UserRegister(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    confirm_password: str
    role: str = "CITIZEN"  # CITIZEN or REVENUE_OFFICER
    address: Optional[str] = None
    district: Optional[str] = "Dharmapuri"
    officer_code: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfile(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: str
    is_active: bool
    created_at: datetime
    profile_details: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# OCR Results & Extraction
class OCRResultUpdate(BaseModel):
    extracted_owner_name: Optional[str] = None
    extracted_survey_number: Optional[str] = None
    extracted_area: Optional[str] = None
    extracted_village: Optional[str] = None
    extracted_taluk: Optional[str] = None
    extracted_district: Optional[str] = None
    extracted_document_number: Optional[str] = None
    extracted_document_date: Optional[str] = None
    extracted_sub_registrar_office: Optional[str] = None

class OCRResultOut(BaseModel):
    id: int
    submission_id: int
    extracted_owner_name: Optional[str]
    extracted_survey_number: Optional[str]
    extracted_area: Optional[str]
    extracted_village: Optional[str]
    extracted_taluk: Optional[str]
    extracted_district: Optional[str]
    extracted_document_number: Optional[str]
    extracted_document_date: Optional[str]
    extracted_sub_registrar_office: Optional[str]
    extracted_text: Optional[str]
    overall_confidence: float
    field_confidences: Optional[str]
    processed_at: datetime

    class Config:
        from_attributes = True

# Existing Land Records
class ExistingLandRecordOut(BaseModel):
    id: int
    record_id: str
    registration_district: str
    sub_registrar_office: str
    taluk: str
    village: str
    survey_number: str
    owner_name: str
    document_number: str
    document_date: Optional[str]
    land_extent_text: str
    land_extent_numeric: Optional[float]
    land_extent_unit: str
    status: str
    source_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class ExistingLandRecordCreate(BaseModel):
    record_id: str
    registration_district: str
    sub_registrar_office: str
    taluk: str
    village: str
    survey_number: str
    owner_name: str
    document_number: str
    document_date: Optional[str] = None
    land_extent_text: str
    land_extent_numeric: Optional[float] = None
    land_extent_unit: str
    status: str = "ACTIVE"
    source_type: str = "SOURCE_BASED_DEMO_REFERENCE"

# Validation
class ValidationItem(BaseModel):
    field_name: str
    ocr_value: Optional[str]
    existing_value: Optional[str]
    match_status: str
    confidence: float
    reason: Optional[str]

class ComparisonResponse(BaseModel):
    submission_id: int
    submission_reference: str
    status: str  # MATCHED, DISCREPANCY_DETECTED, REFERENCE_RECORD_NOT_FOUND, MULTIPLE_REFERENCE_RECORDS_FOUND
    discrepancy_message: Optional[str] = None
    citizen_record: Dict[str, Any]
    reference_record: Optional[Dict[str, Any]] = None
    validation_results: List[ValidationItem]
    requires_manual_verification: bool

# Officer Actions
class ManualVerificationRequest(BaseModel):
    decision: str  # CONFIRM_ORIGINAL, REQUEST_CORRECTION, REJECT, APPROVE_AFTER_VERIFICATION
    remarks: str
    corrected_values: Optional[Dict[str, Any]] = None
    supporting_notes: Optional[str] = None

class ApprovalRequest(BaseModel):
    remarks: str

class RejectionRequest(BaseModel):
    reason: str
    remarks: str

# Submissions
class SubmissionSummary(BaseModel):
    id: int
    submission_reference: str
    citizen_name: str
    original_filename: str
    survey_number: Optional[str]
    village: Optional[str]
    district: Optional[str]
    upload_status: str
    ocr_status: str
    validation_status: str
    approval_status: str
    overall_confidence: Optional[float]
    submitted_at: Optional[datetime]
    created_at: datetime
    has_approval_pdf: bool

    class Config:
        from_attributes = True

# Audit
class AuditLogOut(BaseModel):
    id: int
    user_name: Optional[str]
    user_role: Optional[str]
    action: str
    entity_type: str
    entity_id: str
    ip_address: Optional[str]
    timestamp: datetime
    details: Optional[str]

    class Config:
        from_attributes = True
