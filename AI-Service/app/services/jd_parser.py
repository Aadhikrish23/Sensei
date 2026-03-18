from app.services.openai_service import USE_MOCK,  call_openai
from app.utils.mock_loader import load_mock
from app.utils.skill_normalizer import normalize_jd_data
from fastapi import Request

def build_jd_prompt(text: str):
    return f"""
You are an expert technical recruiter.

Extract structured information from the following job description.

Return ONLY valid JSON.

If a field is missing return null or empty list.

JSON structure:

{{
  "role": "",
  "seniority": "",

  "skills": [],
  "tools": [],
  "frameworks": [],
  "cloud": [],
  "database": [],

  "topics": [
    {{"name": "", "category": ""}}
  ],

  "responsibilities": [],

  "qualifications": [],

  "experience_required": "",

  "education_required": ""
}}

Job description text:
{text}
"""

def parse_job_description_with_ai(raw_text: str,request: Request):
    try:
        if USE_MOCK:
            return load_mock("jd_mock.json")

        prompt = build_jd_prompt(raw_text)
        parsed = call_openai(prompt,request)

        normalized = normalize_jd_data(parsed)

        return normalized

    except Exception as e:
        return {"error": str(e)}