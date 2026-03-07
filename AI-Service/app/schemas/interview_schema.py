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