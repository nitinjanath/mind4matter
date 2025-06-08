from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import os
import base64
import httpx

from app import models, schemas, crud
from app.database import get_db
from app.routers.auth_routes import get_current_user

router = APIRouter()

# ----------------------
# Donation & Leaderboard
# ----------------------

@router.post("/donate")
def donate(
    donation: schemas.DonationCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    new_donation = models.Donation(amount=donation.amount, user_id=user.id)
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)
    return {"message": "Donation successful", "donation": new_donation}


@router.get("/donations", response_model=List[schemas.DonationOut])
def get_donations(db: Session = Depends(get_db)):
    donations = db.query(models.Donation).order_by(models.Donation.amount.desc()).all()
    return donations


@router.get("/leaderboard", response_model=List[schemas.LeaderboardEntry])
def leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)


# ----------------------
# PayPal Integration (Amount Only)
# ----------------------

class CreateOrderRequest(BaseModel):
    amount: float


async def get_paypal_access_token() -> str:
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


@router.post("/orders")
async def create_order(order_request: CreateOrderRequest):
    access_token = await get_paypal_access_token()

    amount_str = f"{order_request.amount:.2f}"

    order_body = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": amount_str,
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
