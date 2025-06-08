from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import os
import base64
from fastapi import FastAPI
from app.routers import auth_router
# Load environment variables early
load_dotenv()

# Internal app imports
from app.database import SessionLocal, get_db
from app import models, schemas, crud
from app.schemas import Token
from app.auth import hash_password, decode_access_token, create_access_token, verify_password
from app.routers import auth_routes, donation_routes
#from app.routers import google_auth

# Initialize app
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(donation_routes)
#app.include_router(google_auth.router)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, payload["sub"])
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mind4Matter backend API"}


@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = crud.create_user(db, user)
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/logout")
def logout():
    # Since JWT is stateless, just tell the frontend to delete the token.
    return {"message": "Logout successful. Please delete the token on the client side."}


@app.post("/login", response_model=schemas.TokenWithUser)  # Create a new response schema
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if db_user.hashed_password is None:
        raise HTTPException(
            status_code=400,
            detail="This account was created using Google OAuth. Please sign in with Google."
        )

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": db_user.email,
        "full_name": db_user.full_name
    }




@app.get("/dashboard")
def dashboard(user: models.User = Depends(get_current_user)):
    return {"message": f"Welcome {user.email}!"}


@app.post("/donate")
def donate(donation: schemas.DonationCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    new_donation = models.Donation(amount=donation.amount, user_id=user.id)
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)
    return {"message": "Donation successful", "donation": new_donation}


@app.get("/donations", response_model=list[schemas.DonationOut])
def get_donations(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    try:
        donations = db.query(models.Donation).filter(models.Donation.user_id == user.id).all()
        return donations
    except Exception as e:
        print("Donation fetch error:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch donations")


@app.get("/leaderboard", response_model=list[schemas.LeaderboardEntry])
def leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)


# ==============================
# PAYPAL INTEGRATION
# ==============================

class CartItem(BaseModel):
    id: str
    quantity: int

class CreateOrderRequest(BaseModel):
    cart: list[CartItem]

async def get_paypal_access_token():
    client_id = os.getenv("PAYPAL_CLIENT_ID")
    secret = os.getenv("PAYPAL_SECRET")
    if not client_id or not secret:
        raise HTTPException(status_code=500, detail="Missing PayPal credentials")

    auth = base64.b64encode(f"{client_id}:{secret}".encode()).decode()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            headers={
                "Authorization": f"Basic {auth}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data="grant_type=client_credentials",
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get PayPal access token")

    return response.json()["access_token"]

@app.post("/orders")
async def create_order(order_request: CreateOrderRequest):
    access_token = await get_paypal_access_token()

    order_body = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": "5.00"  # Static for now; you can calculate total from cart later
                }
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            json=order_body,
        )

    if response.status_code != 201:
        raise HTTPException(status_code=500, detail="Failed to create PayPal order")

    return response.json()
