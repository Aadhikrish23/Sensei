from app.services.openai_service import USE_MOCK, jd_mock_response, call_openai


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

def parse_job_description_with_ai(raw_text: str):
    try:
        if USE_MOCK:
            return jd_mock_response()

        prompt = build_jd_prompt(raw_text, "job description")
        return call_openai(prompt)

    except Exception as e:
        return {"error": str(e)}