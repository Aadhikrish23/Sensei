from fastapi import APIRouter,Request
from pydantic import BaseModel
from app.schemas.resume_schema import ResumeParseResponse, ResumeRequest
from app.services.resume_parser import parse_resume_with_ai

router = APIRouter()




@router.post("/parse-resume",response_model=ResumeParseResponse)
def parse_resume(data:ResumeRequest,request:Request):
    result = parse_resume_with_ai(data.rawText,request)
    return result