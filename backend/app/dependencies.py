from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .security import decode_access_token
from .models import User, Citizen, RevenueOfficer

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account does not exist",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Contact system administrator.",
        )
    return user

def require_role(allowed_roles: list):
    def role_checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of roles {allowed_roles}",
            )
        return user
    return role_checker

def require_citizen(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> tuple[User, Citizen]:
    if user.role != "CITIZEN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to registered Citizens only",
        )
    citizen = db.query(Citizen).filter(Citizen.user_id == user.id).first()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen profile not found")
    return user, citizen

def require_officer(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> tuple[User, RevenueOfficer]:
    if user.role != "REVENUE_OFFICER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized Revenue Officers only",
        )
    officer = db.query(RevenueOfficer).filter(RevenueOfficer.user_id == user.id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Revenue officer profile not found")
    return user, officer
