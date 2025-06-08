from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
# from google.oauth2 import id_token
# from google.auth.transport import requests as google_requests
import httpx
import os


from app import schemas, crud, auth, models
from app.database import get_db
from app.auth import decode_access_token, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Environment variables
# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# REDIRECT_URI = os.getenv("REDIRECT_URI")

# Token dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ========== GOOGLE OAUTH2 FLOW ==========

#@router.get("/google")
#async def google_oauth():
#    """Redirects user to Google OAuth2 login"""
#    return RedirectResponse(
#        f"https://accounts.google.com/o/oauth2/v2/auth?"
 #       f"client_id={GOOGLE_CLIENT_ID}&"
  #      f"redirect_uri={REDIRECT_URI}&"
   #     f"response_type=code&"
    #    f"scope=openid%20email%20profile"
    #)

##@router.get("/google/callback")
#async def google_callback(request: Request, db: Session = Depends(get_db)):
   # """Handles Google's OAuth2 redirect and stores user info in DB"""
    #code = request.query_params.get("code")
  #  if not code:
   #     raise HTTPException(status_code=400, detail="Missing Google OAuth code")

  #  token_url = "https://oauth2.googleapis.com/token"
   # async with httpx.AsyncClient() as client:
   #     token_resp = await client.post(
   #         token_url,
   #         data={
   #             "code": code,
   #             "client_id": GOOGLE_CLIENT_ID,
   #             "client_secret": GOOGLE_CLIENT_SECRET,
    #            "redirect_uri": REDIRECT_URI,
   #             "grant_type": "authorization_code",
   #         },
   #     )
    #    token_data = token_resp.json()
   #     access_token = token_data.get("access_token")
   #     if not access_token:
   #         raise HTTPException(status_code=400, detail="Failed to fetch access token")

#        userinfo_resp = await client.get(
    #        "https://www.googleapis.com/oauth2/v1/userinfo",
 #           headers={"Authorization": f"Bearer {access_token}"},
  #      )
  #      user_info = userinfo_resp.json()
  #      email = user_info.get("email")
  #      name = user_info.get("name")
  #      picture = user_info.get("picture")

   #     if not email:
    #        raise HTTPException(status_code=400, detail="Failed to fetch user info")

  #      user = crud.get_user_by_email(db, email)
  #      if not user:
 #           user = models.User(email=email, name=name, picture=picture)
   #         db.add(user)
   #         db.commit()
   #         db.refresh(user)

   #     jwt_token = create_access_token(data={"sub": user.email})
  #      return {"access_token": jwt_token, "token_type": "bearer"}

#@router.post("/google")
#def google_login(user: schemas.GoogleUser, db: Session = Depends(get_db)):
     
#    try:
#        idinfo = id_token.verify_oauth2_token(user.token, google_requests.Request(), GOOGLE_CLIENT_ID)
#        email = idinfo['email']
#        name = idinfo.get('name')
#        picture = idinfo.get('picture')

#        user = crud.get_user_by_email(db, email)
#        if not user:
#            user = models.User(email=email, name=name, picture=picture)
#            db.add(user)
#            db.commit()
#            db.refresh(user)

#        jwt_token = create_access_token(data={"sub": user.email})
# #        return {"access_token": jwt_token, "token_type": "bearer"}

#    except ValueError:
#        raise HTTPException(status_code=400, detail="Invalid Google token")


# ========== EMAIL/PASSWORD AUTH ==========

# @router.post("/signup")
# def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     """Registers a new user with email and password"""
#     db_user = crud.get_user_by_email(db, user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = crud.create_user(db, user)
#     access_token = create_access_token(data={"sub": new_user.email})
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.post("/login")
# def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
#     """Logs in a user using email and password"""
#     db_user = crud.get_user_by_email(db, user.email)
#     if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     access_token = create_access_token(data={"sub": db_user.email})
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.post("/logout")
# def logout():
#     """Client-side token deletion is the only logout step"""
#     return {"message": "Logout successful. Please delete the token on the client side."}


# # ========== USER SESSION ==========

# @router.get("/dashboard")
# def dashboard(user: models.User = Depends(lambda token=Depends(oauth2_scheme), db=Depends(get_db): get_current_user(token, db))):
#     """Protected dashboard route"""
#     return {"message": f"Welcome {user.email}!"}


# ========== UTILS ==========

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, payload["sub"])
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
