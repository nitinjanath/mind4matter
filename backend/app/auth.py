from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
# Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "my-dev-secret")

print("SECRET_KEY:", SECRET_KEY)
 # Replace this with a strong, secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10000000

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if "sub" not in payload:
            return None
        return payload
    except JWTError:
        return None


