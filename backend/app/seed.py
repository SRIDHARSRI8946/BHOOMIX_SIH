import logging
from sqlalchemy.orm import Session
from .database import init_db, Base
from .models import User, Citizen, RevenueOfficer, ExistingLandRecord
from .security import hash_password

logger = logging.getLogger("bhoomix.seed")

def seed_database(db: Session):
    # 1. Create default Revenue Officer
    officer_user = db.query(User).filter(User.email == "officer@bhoomix.gov.in").first()
    if not officer_user:
        officer_user = User(
            full_name="S. Rajesh Kumar",
            email="officer@bhoomix.gov.in",
            phone="9876543210",
            password_hash=hash_password("Officer@123"),
            role="REVENUE_OFFICER",
            is_active=True,
        )
        db.add(officer_user)
        db.commit()
        db.refresh(officer_user)

        officer_profile = RevenueOfficer(
            user_id=officer_user.id,
            officer_code="RO-DHM-042",
            department="Revenue & Land Administration Department, Tamil Nadu",
            designation="Tahsildar / Revenue Divisional Officer",
        )
        db.add(officer_profile)
        db.commit()
        logger.info("Created demo Revenue Officer account: officer@bhoomix.gov.in / Officer@123")

    # 2. Create default Citizen (R. Ananthi)
    citizen_user = db.query(User).filter(User.email == "citizen@bhoomix.gov.in").first()
    if not citizen_user:
        citizen_user = User(
            full_name="R. Ananthi",
            email="citizen@bhoomix.gov.in",
            phone="9876501234",
            password_hash=hash_password("Citizen@123"),
            role="CITIZEN",
            is_active=True,
        )
        db.add(citizen_user)
        db.commit()
        db.refresh(citizen_user)

        citizen_profile = Citizen(
            user_id=citizen_user.id,
            address="Plot No. 14, Main Road, Payanatham Village, Pappireddipatti Taluk, Dharmapuri District, Tamil Nadu",
        )
        db.add(citizen_profile)
        db.commit()
        logger.info("Created demo Citizen account: citizen@bhoomix.gov.in / Citizen@123")

    # 3. Seed Reference Records
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
        existing = db.query(ExistingLandRecord).filter(ExistingLandRecord.record_id == rec_data["record_id"]).first()
        if not existing:
            rec = ExistingLandRecord(**rec_data)
            db.add(rec)
            logger.info(f"Seeded reference land record {rec_data['record_id']} ({rec_data['survey_number']})")
    
    db.commit()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    engine = init_db()
    Base.metadata.create_all(bind=engine)
    from .database import SessionLocal
    with SessionLocal() as session:
        seed_database(session)
    print("Database initialization and demo seeding complete.")
