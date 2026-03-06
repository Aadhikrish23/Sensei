from app.services.openai_service import call_openai, USE_MOCK, jd_mock_response


def calculate_match(resume_skills, jd_skills):
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched =sorted(list(jd_set.intersection(resume_set)))
    missing = sorted(list(jd_set-resume_set))
    extra = sorted(list(resume_set-jd_set))

    if len(jd_set) == 0:
        score = 0
    else:
        score = int((len(matched) / len(jd_set)) * 100)

    return {
        "match_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra
    }

def build_skill_pool(data: dict):
    skills = []

    skills.extend(data.get("skills", []))
    skills.extend(data.get("tools", []))
    skills.extend(data.get("frameworks", []))
    skills.extend(data.get("cloud", []))
    skills.extend(data.get("database", []))

    # topics are objects → extract the name
    topics = data.get("topics", [])
    for topic in topics:
        if isinstance(topic, dict):
            if topic.get("name"):
                skills.append(topic.get("name"))

    return skills

def build_matching_prompt(match_result: dict):

    matched = match_result.get("matched_skills", [])
    missing = match_result.get("missing_skills", [])
    extra = match_result.get("extra_skills", [])

    return f"""
You are an expert technical interview coach.

A candidate's resume was compared against a job description.

Matched Skills:
{matched}

Missing Skills:
{missing}

Additional Skills:
{extra}

Based on this information generate:

1. Strength areas of the candidate
2. Improvement suggestions for missing skills

Return ONLY valid JSON in this format:

{{
  "strength_areas": [],
  "improvement_suggestions": []
}}
"""

def generate_ai_insights(match_result: dict):

    prompt = build_matching_prompt(match_result)
    if USE_MOCK:
        return jd_mock_response()

    ai_result = call_openai(prompt)

    return ai_result

def match_resume_to_jd(resume_data: dict, jd_data: dict):

    resume_skills = build_skill_pool(resume_data)
    jd_skills = build_skill_pool(jd_data)

    match_result = calculate_match(resume_skills, jd_skills)

    ai_insights = generate_ai_insights(match_result)

    final_result = {
        **match_result,
        **ai_insights
    }

    return final_result