from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
class Token(BaseModel):
    access_token: str
    token_type: str
class UserLogin(BaseModel):
    email: str
    password: str
class TokenWithUser(BaseModel):
    access_token: str
    token_type: str
    email: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    class Config:
        orm_mode = True
    #name: Optional[str]
    #picture: Optional[str]

class DonationCreate(BaseModel):
    amount: float

class DonationOut(BaseModel):
    id: int
    amount: float
    user_id: int
    class Config:
        orm_mode = True
class CreateOrderRequest(BaseModel):
    amount: float  # or Decimal if you prefer precision

class LeaderboardEntry(BaseModel):
    user_email: str
    total_donated: float
# class GoogleUser(BaseModel):
#     token: str
