def extract_asked_skills(interview_history):
    """
    Extract skills that were already tested in the interview
    """

    skills = set()

    for item in interview_history:
        for skill in item.get("skillTags", []):
            skills.add(skill)

    return list(skills)


def extract_questions(interview_history):
    """
    Extract all previous questions
    """

    questions = []

    for item in interview_history:
        questions.append(item.get("questionText", ""))

    return questions