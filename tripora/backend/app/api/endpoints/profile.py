from fastapi import APIRouter
from app.db.database import db
from app.models.profile import Profile, ProfileUpdate

router = APIRouter()

@router.get("", response_model=Profile)
async def get_user_profile():
    return db.get_profile()

@router.put("", response_model=Profile)
async def update_user_profile(data: ProfileUpdate):
    return db.update_profile(data)

