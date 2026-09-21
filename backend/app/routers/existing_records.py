from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ExistingLandRecord, User, RevenueOfficer
from ..schemas import ExistingLandRecordOut, ExistingLandRecordCreate
from ..dependencies import require_officer, get_current_user

router = APIRouter(prefix="/existing-records", tags=["Existing Land Records (Reference DB)"])

@router.get("/search", response_model=List[ExistingLandRecordOut])
def search_records(
    survey_number: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    taluk: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(ExistingLandRecord)

    if survey_number:
        query = query.filter(ExistingLandRecord.survey_number.ilike(f"%{survey_number.strip()}%"))
    if village:
        query = query.filter(ExistingLandRecord.village.ilike(f"%{village.strip()}%"))
    if taluk:
        query = query.filter(ExistingLandRecord.taluk.ilike(f"%{taluk.strip()}%"))
    if district:
        query = query.filter(ExistingLandRecord.registration_district.ilike(f"%{district.strip()}%"))

    return query.all()

@router.get("/{record_id}", response_model=ExistingLandRecordOut)
def get_record(
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rec = db.query(ExistingLandRecord).filter(
        (ExistingLandRecord.record_id == record_id) | (ExistingLandRecord.id == int(record_id) if record_id.isdigit() else False)
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Existing reference record not found")
    return rec

@router.post("", response_model=ExistingLandRecordOut)
def create_record(
    data: ExistingLandRecordCreate,
    auth_data: tuple[User, RevenueOfficer] = Depends(require_officer),
    db: Session = Depends(get_db),
):
    existing = db.query(ExistingLandRecord).filter(ExistingLandRecord.record_id == data.record_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Record with this record_id already exists")

    rec = ExistingLandRecord(
        record_id=data.record_id,
        registration_district=data.registration_district,
        sub_registrar_office=data.sub_registrar_office,
        taluk=data.taluk,
        village=data.village,
        survey_number=data.survey_number,
        owner_name=data.owner_name,
        document_number=data.document_number,
        document_date=data.document_date,
        land_extent_text=data.land_extent_text,
        land_extent_numeric=data.land_extent_numeric,
        land_extent_unit=data.land_extent_unit,
        status=data.status,
        source_type=data.source_type,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

@router.put("/{record_id}", response_model=ExistingLandRecordOut)
def update_record(
    record_id: str,
    data: ExistingLandRecordCreate,
    auth_data: tuple[User, RevenueOfficer] = Depends(require_officer),
    db: Session = Depends(get_db),
):
    rec = db.query(ExistingLandRecord).filter(
        (ExistingLandRecord.record_id == record_id) | (ExistingLandRecord.id == int(record_id) if record_id.isdigit() else False)
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Existing reference record not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(rec, field, value)

    db.commit()
    db.refresh(rec)
    return rec
