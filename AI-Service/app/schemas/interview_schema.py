from __future__ import annotations
from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class MatchAnalysis(BaseModel):
    strongSkills: List[str]
    missingSkills: List[str]
    partiallyMatchedSkills: List[str]


class GenerateQuestionRequest(BaseModel):
    roleCategory: str
    difficulty: str
    resumeData: Optional[Dict[str, Any]] = None
    jdData: Optional[Dict[str, Any]] = None
    matchAnalysis: MatchAnalysis
    questionNumber: int


class Question(BaseModel):
    questionText: str
    questionType: str
    difficulty: str
    skillTags: List[str]


class GenerateQuestionResponse(BaseModel):
    question: Question


class EvaluateAnswerRequest(BaseModel):
    questionText: str
    answerText: str
    questionType: str
    difficulty: str
    skillTags: List[str]

    resumeContext: Optional[Dict[str, Any]] = None
    jdContext: Optional[Dict[str, Any]] = None


class EvaluationScore(BaseModel):
    technical: float
    depth: float
    communication: float
    relevance: float


class Feedback(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    improvements: List[str]


class EvaluateAnswerResponse(BaseModel):
    evaluation: EvaluationScore
    feedback: Feedback


class GenerateNextQuestionRequest(BaseModel):

    resume_data: Dict[str, Any]
    jd_data: Dict[str, Any]
    match_result: Dict[str, Any]

    previous_question: str
    user_answer: str

    evaluation_score: float
    skill_tags: List[str]

    skill_graph: Dict[str, Any]

    interview_history: List[Dict[str, Any]]


class NextQuestion(BaseModel):
    questionText: str
    questionType: str
    difficulty: str
    skillTags: List[str]


class GenerateNextQuestionResponse(BaseModel):

    question: Optional[NextQuestion] = None

    interview_complete: bool

    decision: Optional[str] = None
    fit_score: Optional[float] = None

    skill_graph: Optional[Dict[str, Any]] = None