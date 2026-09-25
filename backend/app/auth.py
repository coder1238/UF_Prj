from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .config import JWT_ALGORITHM, JWT_EXPIRE_MINUTES, JWT_SECRET
from .database import get_db
from .models import AuthorityUser

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer(auto_error=False)
def hash_password(password): return pwd_context.hash(password)
def verify_password(password, hashed): return pwd_context.verify(password, hashed)
def create_access_token(user):
    return jwt.encode({"sub": user.username, "role": user.role, "exp": datetime.now(timezone.utc)+timedelta(minutes=JWT_EXPIRE_MINUTES)}, JWT_SECRET, algorithm=JWT_ALGORITHM)
def get_current_authority_user(credentials: HTTPAuthorizationCredentials|None=Depends(bearer), db:Session=Depends(get_db)):
    unauthorized = HTTPException(status_code=401, detail="Invalid or missing authority token", headers={"WWW-Authenticate":"Bearer"})
    if not credentials: raise unauthorized
    try: username = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM]).get("sub")
    except JWTError: raise unauthorized
    user = db.query(AuthorityUser).filter_by(username=username).first()
    if not user: raise unauthorized
    return user

