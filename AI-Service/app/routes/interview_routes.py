from fastapi import APIRouter
from app.services.interview_generator import generate_question
from app.schemas.interview_schema import GenerateQuestionRequest, GenerateQuestionResponse

router = APIRouter()

@router.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question_endpoint(data: GenerateQuestionRequest):

    question = await generate_question(data)

    return {"question": question}