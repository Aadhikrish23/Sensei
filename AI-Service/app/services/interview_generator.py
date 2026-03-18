import json

from app.services.openai_service import call_openai

from app.services.skill_graph_manager import (
    update_skill_graph,
    compute_candidate_fit,
    check_interview_decision,
    select_next_skill,
    determine_difficulty
)
from app.utils.interview_memory_guard import extract_asked_skills, extract_questions


async def generate_question(data, request):

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

    response = call_openai(prompt, request)


    return response


async def evaluate_answer(data, request):

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

    response = call_openai(prompt, request)


    return response


async def generate_next_question(
        resume_data,
        jd_data,
        match_result,
        previous_question,
        user_answer,
        evaluation_score,
        skill_tags,
        skill_graph,
        interview_history,
        request
):

    skill_graph = update_skill_graph(
        skill_graph,
        skill_tags,
        evaluation_score
    )

    fit_score = compute_candidate_fit(skill_graph)

    decision = check_interview_decision(skill_graph)

    if decision != "CONTINUE":
        return {
            "interview_complete": True,
            "decision": decision,
            "fit_score": fit_score,
            "skill_graph": skill_graph
        }

    target_skill = select_next_skill(skill_graph)

    difficulty = determine_difficulty(evaluation_score)

    strong_skills = match_result.get("strongSkills", [])
    missing_skills = match_result.get("missingSkills", [])

    asked_skills = extract_asked_skills(interview_history)
    previous_questions = extract_questions(interview_history)

    prompt = f"""
    You are a strict senior technical interviewer.

    Generate the NEXT interview question.

    Target Skill: {target_skill}
    Difficulty: {difficulty}

    Candidate Resume:
    {resume_data}

    Job Description:
    {jd_data}

    Strong Skills:
    {strong_skills}

    Missing Skills:
    {missing_skills}

    Skills already tested:
    {asked_skills}

    Previous Questions:
    {previous_questions}

    Previous Question:
    {previous_question}

    Candidate Answer:
    {user_answer}

    Evaluation Score:
    {evaluation_score}

    Rules:
    - Ask ONLY one question
    - Do NOT explain answers
    - Do NOT repeat previous questions
    - Avoid testing the exact same concept again
    - Ask realistic technical interview questions

    Return ONLY JSON.

    {{
     "questionText": "string",
     "questionType": "THEORY",
     "difficulty": "{difficulty}",
     "skillTags": ["{target_skill}"]
    }}
    """

    response = call_openai(prompt, request)
    question_data = response

    return {
        "question": question_data,
        "interview_complete": False,
        "skill_graph": skill_graph
    }