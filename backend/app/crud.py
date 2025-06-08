from sqlalchemy.orm import Session
from app import models, schemas
from app.auth import hash_password
from sqlalchemy import func

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pw, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_donation(db: Session, user_id: int, donation: schemas.DonationCreate):
    db_donation = models.Donation(user_id=user_id, amount=donation.amount)
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

def get_leaderboard(db: Session, limit: int = 10):
    return (
        db.query(models.User.email.label("user_email"), func.sum(models.Donation.amount).label("total_donated"))
        .join(models.Donation)
        .group_by(models.User.id)
        .order_by(func.sum(models.Donation.amount).desc())
        .all()
    )
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()
# def create_user_google(db: Session, user: schemas.GoogleUser) -> models.User:
#     db_user = models.User(
#         email=user.email,
#         name=user.name,
#         picture=user.picture,
#         hashed_password=None  # Important to mark as a Google OAuth account
#     )
    # db.add(db_user)
    # db.commit()
    # db.refresh(db_user)
    # return db_user
