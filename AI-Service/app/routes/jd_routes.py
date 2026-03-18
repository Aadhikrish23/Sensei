from fastapi import APIRouter,Request
from pydantic import BaseModel
from app.schemas.jd_schema import  JDRequest , JDParseResponse
from app.services.jd_cleaner import clean_job_description
from app.services.jd_parser import parse_job_description_with_ai

router = APIRouter()



@router.post("/parse-jd", response_model=JDParseResponse)
def parse_job_description(data: JDRequest,request:Request):
    cleaned_text = clean_job_description(data.rawText)
    result = parse_job_description_with_ai(cleaned_text,request)
    # Temporary mock response
    return result
