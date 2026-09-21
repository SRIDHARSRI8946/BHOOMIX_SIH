import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # CITIZEN, REVENUE_OFFICER
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    citizen_profile = relationship("Citizen", back_populates="user", uselist=False)
    officer_profile = relationship("RevenueOfficer", back_populates="user", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="user")


class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="citizen_profile")
    submissions = relationship("LandRecordSubmission", back_populates="citizen")


class RevenueOfficer(Base):
    __tablename__ = "revenue_officers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    officer_code = Column(String(50), unique=True, index=True, nullable=False)
    department = Column(String(150), nullable=False)
    designation = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="officer_profile")
    reviews = relationship("OfficerReview", back_populates="officer")
    approvals = relationship("ApprovalRecord", back_populates="officer")


class LandRecordSubmission(Base):
    __tablename__ = "land_record_submissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    citizen_id = Column(Integer, ForeignKey("citizens.id", ondelete="CASCADE"), nullable=False)
    submission_reference = Column(String(50), unique=True, index=True, nullable=False)  # BX-YYYY-XXXXXX
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_hash = Column(String(64), nullable=False)  # SHA-256
    file_size_bytes = Column(Integer, nullable=False, default=0)
    mime_type = Column(String(100), nullable=False)

    # Status tracking
    upload_status = Column(String(50), default="UPLOADED", nullable=False)
    ocr_status = Column(String(50), default="PENDING", nullable=False)
    validation_status = Column(String(50), default="PENDING", nullable=False)
    approval_status = Column(String(50), default="DRAFT", nullable=False)

    submitted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    citizen = relationship("Citizen", back_populates="submissions")
    ocr_result = relationship("OCRResult", back_populates="submission", uselist=False)
    validations = relationship("ValidationResult", back_populates="submission")
    reviews = relationship("OfficerReview", back_populates="submission")
    approval_record = relationship("ApprovalRecord", back_populates="submission", uselist=False)


class OCRResult(Base):
    __tablename__ = "ocr_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey("land_record_submissions.id", ondelete="CASCADE"), unique=True, nullable=False)
    extracted_owner_name = Column(String(150), nullable=True)
    extracted_survey_number = Column(String(50), nullable=True)
    extracted_area = Column(String(100), nullable=True)
    extracted_village = Column(String(100), nullable=True)
    extracted_taluk = Column(String(100), nullable=True)
    extracted_district = Column(String(100), nullable=True)
    extracted_document_number = Column(String(100), nullable=True)
    extracted_document_date = Column(String(50), nullable=True)
    extracted_sub_registrar_office = Column(String(150), nullable=True)
    extracted_text = Column(Text, nullable=True)
    overall_confidence = Column(Float, default=0.0, nullable=False)
    field_confidences = Column(Text, nullable=True)  # JSON string of field scores
    processed_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    submission = relationship("LandRecordSubmission", back_populates="ocr_result")


class ExistingLandRecord(Base):
    __tablename__ = "existing_land_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    record_id = Column(String(50), unique=True, index=True, nullable=False)  # ER-001
    registration_district = Column(String(100), index=True, nullable=False)
    sub_registrar_office = Column(String(150), nullable=False)
    taluk = Column(String(100), index=True, nullable=False)
    village = Column(String(100), index=True, nullable=False)
    survey_number = Column(String(50), index=True, nullable=False)
    owner_name = Column(String(150), nullable=False)
    document_number = Column(String(100), nullable=False)
    document_date = Column(String(50), nullable=True)
    land_extent_text = Column(String(100), nullable=False)
    land_extent_numeric = Column(Float, nullable=True)
    land_extent_unit = Column(String(100), nullable=False)
    status = Column(String(50), default="ACTIVE", nullable=False)
    source_type = Column(String(100), nullable=False)
    geometry_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    validations = relationship("ValidationResult", back_populates="existing_record")


class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey("land_record_submissions.id", ondelete="CASCADE"), nullable=False)
    existing_record_id = Column(Integer, ForeignKey("existing_land_records.id", ondelete="SET NULL"), nullable=True)
    field_name = Column(String(100), nullable=False)
    ocr_value = Column(String(255), nullable=True)
    existing_value = Column(String(255), nullable=True)
    match_status = Column(String(50), nullable=False)  # MATCH, MISMATCH, NOT_AVAILABLE, MANUAL_VERIFICATION_REQUIRED
    confidence = Column(Float, default=1.0, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    submission = relationship("LandRecordSubmission", back_populates="validations")
    existing_record = relationship("ExistingLandRecord", back_populates="validations")


class OfficerReview(Base):
    __tablename__ = "officer_reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey("land_record_submissions.id", ondelete="CASCADE"), nullable=False)
    officer_id = Column(Integer, ForeignKey("revenue_officers.id", ondelete="CASCADE"), nullable=False)
    review_type = Column(String(100), nullable=False)  # MANUAL_VERIFICATION, CLARIFICATION_REQUEST, REJECTION
    remarks = Column(Text, nullable=False)
    decision = Column(String(50), nullable=False)
    verified_fields = Column(Text, nullable=True)  # JSON string of verified fields and corrected values
    reviewed_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    submission = relationship("LandRecordSubmission", back_populates="reviews")
    officer = relationship("RevenueOfficer", back_populates="reviews")


class ApprovalRecord(Base):
    __tablename__ = "approval_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey("land_record_submissions.id", ondelete="CASCADE"), unique=True, nullable=False)
    officer_id = Column(Integer, ForeignKey("revenue_officers.id", ondelete="CASCADE"), nullable=False)
    approval_reference = Column(String(100), unique=True, index=True, nullable=False)
    decision = Column(String(50), default="APPROVED", nullable=False)
    approval_date = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    remarks = Column(Text, nullable=False)
    pdf_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    submission = relationship("LandRecordSubmission", back_populates="approval_record")
    officer = relationship("RevenueOfficer", back_populates="approvals")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=False)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    details = Column(Text, nullable=True)

    user = relationship("User", back_populates="audit_logs")
