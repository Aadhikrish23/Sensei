from fastapi import APIRouter,Request
from app.services.matching_engine import match_resume_to_jd
from app.schemas.matching_jd_resume_schema import MatchRequest

router = APIRouter()

@router.post("/match-resume-jd")
def match_jd_resume(data:MatchRequest,request:Request):
    result= match_resume_to_jd(data.resume_data,data.jd_data,request)
    return result;