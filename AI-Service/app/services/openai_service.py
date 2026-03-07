import os
import json
from openai import OpenAI
from dotenv import load_dotenv

from app.utils.skill_normalizer import normalize_resume_data

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Toggle AI calls during development
USE_MOCK = os.getenv("MOCK_FLAG", "false").lower() == "true"


def call_openai(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are an expert HR analyst. Always return valid JSON. Return ONLY JSON. No markdown. No explanation."
                                          "If a field is not present in the document return null or []. Do not invent information."},
            {"role": "user", "content": prompt}
        ],
      response_format={"type": "json_object"},
        temperature=0.2,
        max_tokens=1200

    )

    content = response.choices[0].message.content
    return json.loads(content)




