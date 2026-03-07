from app.services.openai_service import call_openai
import json


async def generate_question(data):
    strong_skills = data.matchAnalysis.strongSkills
    missing_skills = data.matchAnalysis.missingSkills

    prompt = f"""
    You are a technical interviewer.

    Role Category: {data.roleCategory}
    Difficulty: {data.difficulty}

    Strong skills: {strong_skills}
    Missing skills: {missing_skills}

    Generate ONE interview question.

    Rules:
    - Ask a realistic technical interview question
    - Target either a strong skill or a missing skill
    - Output MUST be valid JSON
    - Do NOT include explanations

    Return ONLY this JSON structure:

    {{
     "questionText": "string",
     "questionType": "THEORY",
     "difficulty": "{data.difficulty}",
     "skillTags": ["skill"]
    }}
    """

    response = call_openai(prompt)

    return response


async def evaluate_answer(data):
    prompt = f"""
You are a senior technical interviewer.

Evaluate the candidate's answer.

Question:
{data.questionText}

Candidate Answer:
{data.answerText}

Question Type: {data.questionType}
Difficulty: {data.difficulty}

Skills involved:
{data.skillTags}

Evaluate the answer on a scale of 0–10.

Return ONLY JSON:

{{
 "evaluation": {{
    "technical": number,
    "depth": number,
    "communication": number,
    "relevance": number
 }},
 "feedback": {{
    "strengths": ["..."],
    "weaknesses": ["..."],
    "improvements": ["..."]
 }}
}}
"""

    result = call_openai(prompt)
    return result
