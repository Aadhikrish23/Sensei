from fastapi import APIRouter,Request

from app.services.interview_generator import (
    generate_question,
    evaluate_answer,
    generate_next_question
)

from app.schemas.interview_schema import (
    GenerateQuestionRequest,
    GenerateQuestionResponse,
    EvaluateAnswerResponse,
    EvaluateAnswerRequest,
    GenerateNextQuestionResponse,
    GenerateNextQuestionRequest
)
from app.services.interview_report_service import generate_final_report

router = APIRouter()


@router.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question_endpoint(data: GenerateQuestionRequest, request: Request):
    question = await generate_question(data, request)
    return {"question": question}

@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer_endpoint(data: EvaluateAnswerRequest, request: Request):
    result = await evaluate_answer(data, request)
    return result

@router.post("/generate-next-question", response_model=GenerateNextQuestionResponse)
async def generate_next_question_endpoint(request_data: GenerateNextQuestionRequest, request: Request):
    result = await generate_next_question(
        resume_data=request_data.resume_data,
        jd_data=request_data.jd_data,
        match_result=request_data.match_result,
        previous_question=request_data.previous_question,
        user_answer=request_data.user_answer,
        evaluation_score=request_data.evaluation_score,
        skill_tags=request_data.skill_tags,
        skill_graph=request_data.skill_graph,
        interview_history=request_data.interview_history,
        request=request   # 🔥 pass it
    )
    return result

@router.post("/final-report")
async def final_report(data: dict, request: Request):
    report = generate_final_report(data, request)
    return report