import os
import logging
from . import database
from .models import (
    User,
    Citizen,
    RevenueOfficer,
    LandRecordSubmission,
    OCRResult,
    ValidationResult,
    OfficerReview,
    ApprovalRecord,
    AuditLog,
    ExistingLandRecord,
)
from .security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhoomix.reset")

def reset_and_seed():
    engine = database.init_db()
    database.Base.metadata.create_all(bind=engine)
    session = database.SessionLocal()

    logger.info("Cleaning previous reviews, submissions, OCR results, approval records, and audit logs...")
    session.query(ValidationResult).delete()
    session.query(OfficerReview).delete()
    session.query(ApprovalRecord).delete()
    session.query(OCRResult).delete()
    session.query(LandRecordSubmission).delete()
    session.query(AuditLog).delete()

    # Delete any Ramesh Kumar record
    ramesh_users = session.query(User).filter(User.full_name.ilike("%ramesh%")).all()
    for u in ramesh_users:
        logger.info(f"Removing user {u.full_name} ({u.email})")
        session.delete(u)

    session.commit()

    # Ensure Officer account exists
    officer_user = session.query(User).filter(User.email == "officer@bhoomix.gov.in").first()
    if not officer_user:
        officer_user = User(
            full_name="S. Rajesh Kumar",
            email="officer@bhoomix.gov.in",
            phone="9876543210",
            password_hash=hash_password("Officer@123"),
            role="REVENUE_OFFICER",
            is_active=True,
        )
        session.add(officer_user)
        session.commit()
        session.refresh(officer_user)

        officer_profile = RevenueOfficer(
            user_id=officer_user.id,
            officer_code="RO-DHM-042",
            department="Revenue & Land Administration Department, Tamil Nadu",
            designation="Tahsildar / Revenue Divisional Officer",
        )
        session.add(officer_profile)
        session.commit()
        logger.info("Created Revenue Officer account: officer@bhoomix.gov.in / Officer@123")

    # Ensure Citizen account is Ananthi R
    citizen_user = session.query(User).filter(User.email == "citizen@bhoomix.gov.in").first()
    if not citizen_user:
        citizen_user = User(
            full_name="R. Ananthi",
            email="citizen@bhoomix.gov.in",
            phone="9876501234",
            password_hash=hash_password("Citizen@123"),
            role="CITIZEN",
            is_active=True,
        )
        session.add(citizen_user)
        session.commit()
        session.refresh(citizen_user)

        citizen_profile = Citizen(
            user_id=citizen_user.id,
            address="Plot No. 14, Main Road, Payanatham Village, Pappireddipatti Taluk, Dharmapuri District, Tamil Nadu",
        )
        session.add(citizen_profile)
        session.commit()
        logger.info("Created Citizen account for R. Ananthi: citizen@bhoomix.gov.in / Citizen@123")
    else:
        citizen_user.full_name = "R. Ananthi"
        session.commit()

    # Ensure reference records ER-001, ER-002, ER-003 exist
    ref_records = [
        {
            "record_id": "ER-001",
            "registration_district": "Dharmapuri",
            "sub_registrar_office": "Pappireddipatti",
            "taluk": "Pappireddipatti",
            "village": "Payanatham",
            "survey_number": "132/1",
            "owner_name": "R. Ananthi",
            "document_number": "3463",
            "document_date": "2003-07-11",
            "land_extent_text": "0.97.5",
            "land_extent_numeric": None,
            "land_extent_unit": "SOURCE_NOTATION_REQUIRES_CONFIRMATION",
            "status": "ACTIVE",
            "source_type": "SOURCE_BASED_DEMO_REFERENCE",
        },
        {
            "record_id": "ER-002",
            "registration_district": "Dharmapuri",
            "sub_registrar_office": "Pappireddipatti",
            "taluk": "Pappireddipatti",
            "village": "Payanatham",
            "survey_number": "132/1A",
            "owner_name": "M. Selvi",
            "document_number": "DEMO-3464",
            "document_date": "2003-07-12",
            "land_extent_text": "0.75",
            "land_extent_numeric": 0.75,
            "land_extent_unit": "ACRES",
            "status": "ACTIVE",
            "source_type": "FICTIONAL_DEMO_DATA",
        },
        {
            "record_id": "ER-003",
            "registration_district": "Dharmapuri",
            "sub_registrar_office": "Pappireddipatti",
            "taluk": "Pappireddipatti",
            "village": "Payanatham",
            "survey_number": "132/2",
            "owner_name": "K. Murugan",
            "document_number": "DEMO-3465",
            "document_date": "2003-07-14",
            "land_extent_text": "1.10",
            "land_extent_numeric": 1.10,
            "land_extent_unit": "ACRES",
            "status": "ACTIVE",
            "source_type": "FICTIONAL_DEMO_DATA",
        },
    ]

    for rec_data in ref_records:
        existing = session.query(ExistingLandRecord).filter(ExistingLandRecord.record_id == rec_data["record_id"]).first()
        if not existing:
            rec = ExistingLandRecord(**rec_data)
            session.add(rec)
            logger.info(f"Seeded reference land record {rec_data['record_id']}")
        else:
            for k, v in rec_data.items():
                setattr(existing, k, v)

    session.commit()
    logger.info("Database reset complete. Database is clean of all previous reviews!")
    session.close()

if __name__ == "__main__":
    reset_and_seed()
