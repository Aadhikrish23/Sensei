import os
import json
import time

from openai import OpenAI
from dotenv import load_dotenv
from fastapi import Request

from app.utils.ai_logger import log_ai_request, log_ai_response, log_ai_error
from app.utils.skill_normalizer import normalize_resume_data

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Toggle AI calls during development
USE_MOCK = os.getenv("MOCK_FLAG", "false").lower() == "true"


def call_openai(prompt: str, request: Request):
    request_id = getattr(request.state, "request_id", "unknown")

    start = time.time()

    try:
        log_ai_request(request_id, prompt)

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert HR analyst. Always return valid JSON. Return ONLY JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=1200
        )

        duration = round((time.time() - start) * 1000, 2)

        content = response.choices[0].message.content

        # 🔥 token usage
        tokens = response.usage.total_tokens if response.usage else 0

        log_ai_response(request_id, content, duration, tokens)

        return json.loads(content)

    except Exception as e:
        log_ai_error(request_id, str(e))
        raise


