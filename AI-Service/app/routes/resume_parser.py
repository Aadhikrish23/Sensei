from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import parse_resume_with_ai
from app.schemas.resume_schema import ResumeParseResponse

router = APIRouter()

class ResumeRequest(BaseModel):
    rawText:str


@router.post("/parse-resume",response_model=ResumeParseResponse)
def parse_resume(data:ResumeRequest):
    result = parse_resume_with_ai(data.rawText)
    return result