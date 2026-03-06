from app.services.openai_service import USE_MOCK, call_openai, resume_mock_response
from app.utils.skill_normalizer import normalize_resume_data


def build_resume_prompt(text: str):
    return f"""
You are an expert technical recruiter and resume analyst.

Extract structured information from the following resume.

Return ONLY valid JSON.

Do not include explanations.

If a field is missing, return null or an empty list.

JSON structure:

{{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",

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

  "projects": [
    {{
      "name": "",
      "description": "",
      "technologies": []
    }}
  ],

  "work_experience": [
    {{
      "company": "",
      "role": "",
      "duration": "",
      "responsibilities": []
    }}
  ],

  "achievements": [],

  "experience": "",
  "education": ""
}}

Resume text:
{text}
"""

def parse_resume_with_ai(raw_text: str):
    try:
        if USE_MOCK:
            return resume_mock_response()

        prompt = build_resume_prompt(raw_text, "resume")

        parsed = call_openai(prompt)

        normalized = normalize_resume_data(parsed)

        return normalized


    except Exception as e:
        return {"error": str(e)}