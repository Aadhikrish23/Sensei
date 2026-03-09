from app.services.openai_service import call_openai


def build_prompt(data):

    return f"""
You are a senior FAANG interview evaluator.

Analyze the candidate interview performance and produce a professional interview report.

Session Summary:
{data["sessionSummary"]}

Resume Skills:
{data["resumeSkills"]}

Job Description Skills:
{data["jdSkills"]}

Return JSON in this format:

{{
"hiring_recommendation": "",
"candidate_summary": "",
"strengths": [],
"weaknesses": [],
"technical_depth_feedback": "",
"communication_feedback": "",
"improvement_plan": []
}}

Rules:
- Be constructive
- Act like an interview coach
- Do not generate questions
- Output JSON only
"""

def generate_final_report(data):

    prompt = build_prompt(data)

    response = call_openai(prompt)

    return response