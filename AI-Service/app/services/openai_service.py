import os
import json
from openai import OpenAI
from dotenv import load_dotenv

from app.utils.skill_normalizer import normalize_resume_data

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Toggle AI calls during development
USE_MOCK = os.getenv("MOCK_FLAG");


def resume_mock_response():
    return{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "location": "San Francisco, CA",

  "role": "Backend Developer",
  "seniority": "Mid-Level",

  "skills": [
    "Node.js",
    "REST API"
  ],

  "tools": [
    "Docker",
    "Git"
  ],

  "frameworks": [
    "Express"
  ],

  "cloud": [
    "AWS"
  ],

  "database": [
    "PostgreSQL"
  ],

  "topics": [
    {
      "name": "Node.js",
      "category": "backend"
    },
    {
      "name": "REST API",
      "category": "backend"
    },
    {
      "name": "PostgreSQL",
      "category": "database"
    },
    {
      "name": "Docker",
      "category": "devops"
    },
    {
      "name": "AWS",
      "category": "cloud"
    }
  ],

  "projects": [
    {
      "name": "E-commerce Backend",
      "description": "Built REST APIs for an e-commerce platform handling product catalog, orders, and user authentication.",
      "technologies": [
        "Node.js",
        "Express",
        "PostgreSQL"
      ]
    },
    {
      "name": "Task Management API",
      "description": "Developed a task management backend with authentication and role-based access control.",
      "technologies": [
        "Node.js",
        "Express",
        "MongoDB"
      ]
    }
  ],

  "work_experience": [
    {
      "company": "TechCorp",
      "role": "Backend Developer",
      "duration": "2022 - Present",
      "responsibilities": [
        "Developed REST APIs using Node.js and Express",
        "Optimized PostgreSQL queries for performance",
        "Deployed services using Docker and AWS"
      ]
    }
  ],

  "achievements": [
    "Reduced API latency by 40%",
    "Improved database query performance by 30%"
  ],

  "experience": "2+ years",
  "education": "Bachelor's in Computer Science"
}

def jd_mock_response():
    return {
  "role": "Backend Developer",
  "seniority": "Mid-Level",

  "skills": [
    "Node.js",
    "REST API",
    "Microservices"
  ],

  "tools": [
    "Docker",
    "Git"
  ],

  "frameworks": [
    "Express"
  ],

  "cloud": [
    "AWS"
  ],

  "database": [
    "PostgreSQL"
  ],

  "topics": [
    {
      "name": "Node.js",
      "category": "backend"
    },
    {
      "name": "REST API",
      "category": "backend"
    },
    {
      "name": "Microservices",
      "category": "backend"
    },
    {
      "name": "Docker",
      "category": "devops"
    },
    {
      "name": "AWS",
      "category": "cloud"
    },
    {
      "name": "PostgreSQL",
      "category": "database"
    }
  ],

  "responsibilities": [
    "Design and develop scalable backend services",
    "Build RESTful APIs for internal and external applications",
    "Collaborate with frontend teams to integrate APIs",
    "Optimize database queries and performance",
    "Deploy services using containerization tools"
  ],

  "qualifications": [
    "Strong experience with Node.js and Express",
    "Understanding of REST API design principles",
    "Experience with PostgreSQL or other relational databases",
    "Familiarity with Docker and containerized deployments",
    "Knowledge of cloud platforms such as AWS"
  ],

  "experience_required": "2+ years backend development experience",

  "education_required": "Bachelor's degree in Computer Science or related field"
}

def call_openai(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are an expert HR analyst. Always return valid JSON. Return ONLY JSON. No markdown. No explanation."
                                          "If a field is not present in the document return null or []. Do not invent information."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json-object"},
        temperature=0.2,
        max_tokens=1200

    )

    content = response.choices[0].message.content
    return json.loads(content)




