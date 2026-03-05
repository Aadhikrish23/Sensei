import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Toggle AI calls during development
USE_MOCK = True


def build_prompt(text: str, doc_type: str):
    return f"""
Extract structured information from the following {doc_type}.

Return ONLY valid JSON with this structure:

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
  "experience": "",
  "education": ""
}}

{doc_type} text:
{text}
"""


def mock_response():
    return {
        "role": "Backend Developer",
        "seniority": "Mid-Level",
        "skills": ["Node.js", "REST API"],
        "tools": ["Docker"],
        "frameworks": ["Express"],
        "cloud": ["AWS"],
        "database": ["PostgreSQL"],
        "topics": [
            {"name": "Node.js", "category": "backend"},
            {"name": "REST API", "category": "backend"},
            {"name": "PostgreSQL", "category": "database"},
            {"name": "Docker", "category": "devops"},
            {"name": "AWS", "category": "cloud"}
        ],
        "experience": "2+ years",
        "education": "Bachelor's in Computer Science"
    }


def call_openai(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are an expert HR analyst."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content
    return json.loads(content)


def parse_job_description_with_ai(raw_text: str):
    try:
        if USE_MOCK:
            return mock_response()

        prompt = build_prompt(raw_text, "job description")
        return call_openai(prompt)

    except Exception as e:
        return {"error": str(e)}


def parse_resume_with_ai(raw_text: str):
    try:
        if USE_MOCK:
            return mock_response()

        prompt = build_prompt(raw_text, "resume")
        return call_openai(prompt)

    except Exception as e:
        return {"error": str(e)}