from fastapi import APIRouter

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
async def generate_question_endpoint(data: GenerateQuestionRequest):
    question = await generate_question(data)

    return {"question": question}


@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer_endpoint(data: EvaluateAnswerRequest):
    result = await evaluate_answer(data)

    return result


@router.post("/generate-next-question", response_model=GenerateNextQuestionResponse)
async def generate_next_question_endpoint(request: GenerateNextQuestionRequest):
    result = await generate_next_question(
        resume_data=request.resume_data,
        jd_data=request.jd_data,
        match_result=request.match_result,
        previous_question=request.previous_question,
        user_answer=request.user_answer,
        evaluation_score=request.evaluation_score,
        skill_tags=request.skill_tags,
        skill_graph=request.skill_graph,
        interview_history=request.interview_history
    )

    return result

@router.post("/final-report")
async def final_report(data: dict):

    report = generate_final_report(data)

    return report