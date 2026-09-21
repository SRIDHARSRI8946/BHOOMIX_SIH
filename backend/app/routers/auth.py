from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Citizen, RevenueOfficer
from ..schemas import UserLogin, CitizenRegister, UserRegister, TokenResponse
from ..security import hash_password, verify_password, create_access_token
from ..dependencies import get_current_user
from ..audit import log_audit

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register_user(
    data: UserRegister,
    request: Request,
    db: Session = Depends(get_db)
):
    # Validate required fields
    if not data.full_name.strip() or not data.email.strip() or not data.phone.strip():
        raise HTTPException(status_code=400, detail="All required fields must be filled")

    # Password match & length
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    # Phone validation
    clean_phone = "".join(filter(str.isdigit, data.phone))
    if len(clean_phone) < 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit phone number")

    # Check duplicate email
    existing_user = db.query(User).filter(User.email == data.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="An account with this email address already exists")

    role = data.role.strip().upper() if data.role else "CITIZEN"
    if role not in ("CITIZEN", "REVENUE_OFFICER"):
        role = "CITIZEN"

    new_user = User(
        full_name=data.full_name.strip(),
        email=data.email.strip().lower(),
        phone=data.phone.strip(),
        password_hash=hash_password(data.password),
        role=role,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_out = {
        "id": new_user.id,
        "name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role,
        "phone": new_user.phone,
    }

    if role == "REVENUE_OFFICER":
        district = data.district.strip() if data.district else "Dharmapuri"
        code = data.officer_code.strip() if data.officer_code else f"RO-{district[:3].upper()}-{new_user.id:03d}"
        designation = data.designation.strip() if data.designation else "Tahsildar / Revenue Divisional Officer"
        dept = data.department.strip() if data.department else f"Revenue & Land Administration Department, {district} District, Tamil Nadu"
        officer_profile = RevenueOfficer(
            user_id=new_user.id,
            officer_code=code,
            department=dept,
            designation=designation,
        )
        db.add(officer_profile)
        db.commit()
        user_out.update({
            "officer_code": code,
            "department": dept,
            "designation": designation,
            "district": district,
        })
        log_audit(
            db=db,
            action="OFFICER_REGISTERED",
            entity_type="USER",
            entity_id=str(new_user.id),
            user_id=new_user.id,
            details={"name": new_user.full_name, "email": new_user.email, "officer_code": code, "district": district},
            request=request,
        )
    else:
        addr = data.address.strip() if data.address else ""
        if data.district and data.district not in addr:
            addr = f"{addr}, {data.district} District, Tamil Nadu" if addr else f"{data.district} District, Tamil Nadu"
        citizen_profile = Citizen(
            user_id=new_user.id,
            address=addr,
        )
        db.add(citizen_profile)
        db.commit()
        user_out.update({
            "address": citizen_profile.address,
        })
        log_audit(
            db=db,
            action="CITIZEN_REGISTERED",
            entity_type="USER",
            entity_id=str(new_user.id),
            user_id=new_user.id,
            details={"name": new_user.full_name, "email": new_user.email},
            request=request,
        )

    token = create_access_token({"sub": str(new_user.id), "role": new_user.role})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_out,
    }

@router.post("/login", response_model=TokenResponse)
def login(
    data: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email.strip().lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact administration."
        )

    # Log audit
    log_audit(
        db=db,
        action="USER_LOGIN",
        entity_type="USER",
        entity_id=str(user.id),
        user_id=user.id,
        details={"role": user.role, "email": user.email},
        request=request,
    )

    token = create_access_token({"sub": str(user.id), "role": user.role})

    profile_data = {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
    }

    if user.role == "REVENUE_OFFICER" and user.officer_profile:
        profile_data.update({
            "officer_code": user.officer_profile.officer_code,
            "department": user.officer_profile.department,
            "designation": user.officer_profile.designation,
        })
    elif user.role == "CITIZEN" and user.citizen_profile:
        profile_data.update({
            "address": user.citizen_profile.address,
        })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": profile_data
    }

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    user_data = {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
    }
    if user.role == "REVENUE_OFFICER" and user.officer_profile:
        user_data.update({
            "officer_code": user.officer_profile.officer_code,
            "department": user.officer_profile.department,
            "designation": user.officer_profile.designation,
        })
    elif user.role == "CITIZEN" and user.citizen_profile:
        user_data.update({
            "address": user.citizen_profile.address,
        })
    return user_data
