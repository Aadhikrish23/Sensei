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
    "express.js": "Express"
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

    data["skills"] = normalize_skill_list(data.get("skills"))
    data["tools"] = normalize_skill_list(data.get("tools"))
    data["frameworks"] = normalize_skill_list(data.get("frameworks"))
    data["cloud"] = normalize_skill_list(data.get("cloud"))
    data["database"] = normalize_skill_list(data.get("database"))

    return data