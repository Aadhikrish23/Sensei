from app.services.openai_service import USE_MOCK, call_openai, resume_mock_response
from app.utils.skill_normalizer import normalize_resume_data


def build_resume_prompt(text: str):
    return f"""
You are a resume parsing engine.

Extract information ONLY from the provided resume text.

Rules:
- DO NOT invent information
- If information is missing, return null
- Do not guess
- Do not fabricate projects or experience
- Only extract what exists in the resume
- Return ONLY valid JSON
- Do not include explanations
- Do not include markdown
- Do not include text outside JSON

Return JSON in this structure:

{{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "skills": [],
  "frameworks": [],
  "tools": [],
  "cloud": [],
  "database": [],
  "education": "",
  "experience": "",
  "work_experience": [],
  "projects": [],
  "achievements": []
}}

Resume Text:
{text}
"""


def parse_resume_with_ai(raw_text: str):
    try:
        if USE_MOCK:
            return resume_mock_response()

        prompt = build_resume_prompt(raw_text)

        parsed = call_openai(prompt)

        normalized = normalize_resume_data(parsed)

        return normalized

    except Exception as e:
        return {"error": str(e)}