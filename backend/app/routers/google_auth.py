# from fastapi import APIRouter, Request, Depends, HTTPException
# from fastapi.responses import RedirectResponse
# import os
# import httpx
# from urllib.parse import urlencode
# from app import crud, schemas
# from app.auth import create_access_token
# from app.database import get_db
# from sqlalchemy.orm import Session

# router = APIRouter(prefix="/auth/google", tags=["Google OAuth"])

# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# REDIRECT_URI = os.getenv("REDIRECT_URI")

# @router.get("/login")
# def google_login():
#     google_auth_endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
#     params = {
#         "client_id": GOOGLE_CLIENT_ID,
#         "redirect_uri": REDIRECT_URI,
#         "response_type": "code",
#         "scope": "openid email profile",
#         "access_type": "offline",
#         "prompt": "consent"
#     }
#     return RedirectResponse(f"{google_auth_endpoint}?{urlencode(params)}")


# @router.get("/callback")
# async def google_callback(request: Request, db: Session = Depends(get_db)):
#     code = request.query_params.get("code")
#     if not code:
#         raise HTTPException(status_code=400, detail="Missing code in callback")

#     async with httpx.AsyncClient() as client:
#         token_resp = await client.post(
#             "https://oauth2.googleapis.com/token",
#             data={
#                 "client_id": GOOGLE_CLIENT_ID,
#                 "client_secret": GOOGLE_CLIENT_SECRET,
#                 "code": code,
#                 "grant_type": "authorization_code",
#                 "redirect_uri": REDIRECT_URI
#             },
#             headers={"Content-Type": "application/x-www-form-urlencoded"}
#         )

#         token_data = token_resp.json()
#         access_token = token_data.get("access_token")
#         if not access_token:
#             raise HTTPException(status_code=400, detail="No access token received")

#         # Get user info
#         user_resp = await client.get(
#             "https://www.googleapis.com/oauth2/v2/userinfo",
#             headers={"Authorization": f"Bearer {access_token}"}
#         )
#         user_data = user_resp.json()
#         email = user_data.get("email")

#         # Create or fetch user
#         user = crud.get_user_by_email(db, email)
#         if not user:
#             user = crud.create_user(db, schemas.UserCreate(email=email, password=None))  # No password for Google

#         jwt_token = create_access_token(data={"sub": user.email})
#         return RedirectResponse(f"http://localhost:5173/oauth-success?token={jwt_token}")
