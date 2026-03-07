from fastapi import APIRouter
from app.services.interview_generator import generate_question, evaluate_answer
from app.schemas.interview_schema import GenerateQuestionRequest, GenerateQuestionResponse, EvaluateAnswerResponse, \
    EvaluateAnswerRequest

router = APIRouter()


@router.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question_endpoint(data: GenerateQuestionRequest):
    question = await generate_question(data)

    return {"question": question}


@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer_endpoint(data: EvaluateAnswerRequest):
    result = await evaluate_answer(data)

    return result
