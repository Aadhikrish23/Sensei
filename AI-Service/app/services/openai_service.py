import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# print("API KEY:", os.getenv("OPENAI_API_KEY"))

def parse_job_description_with_ai(raw_text: str):

    prompt = f"""
    Extract structured information from the following job description.

    Return ONLY valid JSON with this structure:

    {{
      "role": "",
      "skills": [],
      "tools": [],
      "experience": ""
    }}

    Job Description:
    {raw_text}
    """

    # response = client.chat.completions.create(
    #     model="gpt-4.1-mini",
    #     messages=[
    #         {"role": "system", "content": "You are an expert HR analyst."},
    #         {"role": "user", "content": prompt}
    #     ],
    #     temperature=0.2
    # )

    # content = response.choices[0].message.content

    try:
        # return json.loads(content)



            # Mock AI response
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
    except:
        return {"error": "Failed to parse AI response"}