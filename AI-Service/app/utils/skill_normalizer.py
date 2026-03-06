SKILL_ALIASES = {
    "nodejs": "Node.js",
    "node js": "Node.js",
    "node.js": "Node.js",

    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",

    "js": "JavaScript",
    "javascript": "JavaScript",

    "ts": "TypeScript",
    "typescript": "TypeScript",

    "aws ec2": "AWS",
    "amazon web services": "AWS",
    "aws": "AWS",

    "docker container": "Docker",
    "docker": "Docker",

    "reactjs": "React",
    "react.js": "React",

    "expressjs": "Express",
    "express.js": "Express",

    "RESTful APIs": "REST API",
    "REST API design": "REST API",
    "REST APIs": "REST API",

    "CI/CD pipelines": "CI/CD",
    "Continuous Integration": "CI/CD",

    "Microservices architectures": "Microservices",
    "Microservices architecture": "Microservices",

    "Containerization": "Docker",

    "Postgres": "PostgreSQL",
    "PostgresSQL": "PostgreSQL",

    "Agile/Scrum": "Agile",
    "Agile/Scrum development processes": "Agile",

    "restful api": "REST API",
    "rest api design": "REST API",
    "restful apis": "REST API",

    "agile/scrum": "Agile",
    "scrum methodology": "Scrum",

    "ci cd": "CI/CD",
    "ci/cd pipelines": "CI/CD",

    "microservice": "Microservices",
    "microservices architecture": "Microservices"
}


def normalize_skill(skill: str):
    if not skill:
        return skill

    key = skill.lower().strip()

    return SKILL_ALIASES.get(key, skill)


def normalize_skill_list(skills):
    if not skills:
        return []

    normalized = []

    for skill in skills:
        s = normalize_skill(skill)

        if s not in normalized:
            normalized.append(s)

    return normalized


def normalize_resume_data(data: dict):
    data.setdefault("role", None)
    data.setdefault("seniority", None)
    data.setdefault("topics", [])

    data["skills"] = normalize_skill_list(data.get("skills", []))
    data["frameworks"] = normalize_skill_list(data.get("frameworks", []))
    data["tools"] = normalize_skill_list(data.get("tools", []))
    data["cloud"] = normalize_skill_list(data.get("cloud", []))
    data["database"] = normalize_skill_list(data.get("database", []))

    normalized_experience = []

    for exp in data.get("work_experience", []):
        normalized_experience.append({
            "company": exp.get("company"),
            "role": exp.get("role") or exp.get("position"),
            "duration": exp.get("duration") or exp.get("period"),
            "responsibilities": [exp.get("details")] if exp.get("details") else []
        })

    data["work_experience"] = normalized_experience

    return data


def normalize_jd_data(data: dict):
    data["skills"] = normalize_skill_list(data.get("skills", []))
    data["frameworks"] = normalize_skill_list(data.get("frameworks", []))
    data["tools"] = normalize_skill_list(data.get("tools", []))
    data["cloud"] = normalize_skill_list(data.get("cloud", []))
    data["database"] = normalize_skill_list(data.get("database", []))

    return data
