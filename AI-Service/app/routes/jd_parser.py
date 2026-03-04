from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import parse_job_description_with_ai
from app.schemas.jd_schema import JDParsedResponse
from app.services.jd_cleaner import clean_job_description
router = APIRouter()


class JDRequest(BaseModel):
    rawText: str


@router.post("/parse-jd", response_model=JDParsedResponse)
def parse_job_description(data: JDRequest):
    cleaned_text = clean_job_description(data.rawText)
    result = parse_job_description_with_ai(cleaned_text)
    # Temporary mock response
    return result
