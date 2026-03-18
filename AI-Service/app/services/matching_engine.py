from app.services.openai_service import call_openai, USE_MOCK
from app.utils.mock_loader import load_mock
from app.utils.skill_normalizer import normalize_skill_list
from fastapi import Request

WEIGHTS = {
    "skills": 3,
    "frameworks": 2,
    "database": 2,
    "cloud": 2,
    "tools": 1
}


def build_weighted_skill_pool(data: dict):

    weighted = {}

    for category, weight in WEIGHTS.items():

        skills = normalize_skill_list(data.get(category, []))

        for skill in skills:
            weighted[skill] = max(weighted.get(skill, 0), weight)

    return weighted


def calculate_match(resume_data: dict, jd_data: dict):

    resume_pool = build_weighted_skill_pool(resume_data)
    jd_pool = build_weighted_skill_pool(jd_data)

    matched = []
    missing = []

    total_weight = 0
    matched_weight = 0

    for skill, weight in jd_pool.items():

        total_weight += weight

        if skill in resume_pool:
            matched.append(skill)
            matched_weight += weight
        else:
            missing.append(skill)

    if total_weight == 0:
        score = 0
    else:
        score = int((matched_weight / total_weight) * 100)

    return {
        "matchPercentage": score,
        "strongSkills": sorted(matched),
        "missingSkills": sorted(missing),
        "partiallyMatchedSkills": []
    }


def build_matching_prompt(match_result: dict):

    matched = match_result.get("strongSkills", [])
    missing = match_result.get("missingSkills", [])

    return f"""
You are an expert technical interview coach.

A candidate's resume was compared against a job description.

Matched Skills:
{matched}

Missing Skills:
{missing}

Based on this information generate:

1. Strength areas of the candidate
2. Improvement suggestions for missing skills

Return ONLY valid JSON in this format:

{{
  "strength_areas": [],
  "improvement_suggestions": []
}}
"""


def generate_ai_insights(match_result: dict , request:Request):

    prompt = build_matching_prompt(match_result)

    if USE_MOCK:
        return load_mock("match_mock.json")

    ai_result = call_openai(prompt,request)

    return ai_result


def match_resume_to_jd(resume_data: dict, jd_data: dict,request:Request):
    match_result = calculate_match(resume_data, jd_data)

    ai_insights = generate_ai_insights(match_result,request)

    final_result = {
        **match_result,
        **ai_insights
    }

    return final_result