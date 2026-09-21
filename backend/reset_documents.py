import os
import glob
from pathlib import Path
import app.database as db_mod
from app.models import (
    LandRecordSubmission,
    OCRResult,
    ValidationResult,
    OfficerReview,
    ApprovalRecord,
    AuditLog,
    ExistingLandRecord
)

def reset_documents():
    print("=== RESETTING ENTERED DOCUMENT DETAILS IN BHOOMIX ===")
    
    # 1. Connect to DB
    db_mod.init_db()
    session = db_mod.SessionLocal()
    
    try:
        # Delete dependent tables first
        approvals_deleted = session.query(ApprovalRecord).delete()
        print(f"Deleted {approvals_deleted} approval records.")

        reviews_deleted = session.query(OfficerReview).delete()
        print(f"Deleted {reviews_deleted} officer reviews.")

        validations_deleted = session.query(ValidationResult).delete()
        print(f"Deleted {validations_deleted} validation results.")

        ocr_deleted = session.query(OCRResult).delete()
        print(f"Deleted {ocr_deleted} OCR results.")

        submissions_deleted = session.query(LandRecordSubmission).delete()
        print(f"Deleted {submissions_deleted} land record submissions.")

        audit_deleted = session.query(AuditLog).filter(
            (AuditLog.entity_type == "SUBMISSION") | 
            (AuditLog.action.in_([
                "DOCUMENT_UPLOADED", 
                "DOCUMENT_SUBMITTED", 
                "MANUAL_VERIFICATION_PERFORMED", 
                "APPROVAL_CREATED", 
                "REJECTION_RECORDED",
                "RECORD_APPROVED",
                "RECORD_REJECTED"
            ]))
        ).delete(synchronize_session=False)
        print(f"Deleted {audit_deleted} submission-related audit log entries.")

        session.commit()
        print("Database commit successful.")

        # Verify reference records are still preserved
        ref_count = session.query(ExistingLandRecord).count()
        print(f"Preserved {ref_count} reference database land records for ongoing verification.")

    except Exception as e:
        session.rollback()
        print("Error resetting database:", e)
        raise
    finally:
        session.close()

    # 2. Delete uploaded physical deed files & generated approval PDFs
    uploads_dir = Path(__file__).resolve().parent / "uploads" / "private"
    if uploads_dir.exists():
        files_deleted = 0
        for f in uploads_dir.glob("*.pdf"):
            try:
                f.unlink()
                files_deleted += 1
            except Exception as fe:
                print(f"Could not delete {f}: {fe}")
        for img in uploads_dir.glob("*.jpg"):
            try:
                img.unlink()
                files_deleted += 1
            except Exception:
                pass
        for img in uploads_dir.glob("*.png"):
            try:
                img.unlink()
                files_deleted += 1
            except Exception:
                pass
        print(f"Removed {files_deleted} uploaded document deed and approval PDF files from uploads/private.")

    print("\n=== RESET COMPLETE: Citizen and Revenue Officer document queues are completely clean! ===")

if __name__ == "__main__":
    reset_documents()
