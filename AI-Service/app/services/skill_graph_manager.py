def initialize_skill_graph(skills):
    """
    Initialize the skill confidence graph
    """

    graph = {}

    for skill in skills:
        graph[skill] = {
            "scores": [],
            "confidence": 0.0,
            "questions_asked": 0
        }

    return graph


def update_skill_graph(skill_graph, skill_tags, score):
    """
    Update skill confidence graph after evaluation
    """

    for skill in skill_tags:

        if skill not in skill_graph:
            continue

        node = skill_graph[skill]

        node["scores"].append(score)
        node["questions_asked"] += 1

        node["confidence"] = sum(node["scores"]) / (len(node["scores"]) * 10)

    return skill_graph


def compute_candidate_fit(skill_graph):

    if not skill_graph:
        return 0

    total = 0

    for skill in skill_graph.values():
        total += skill["confidence"]

    return total / len(skill_graph)

PASS_THRESHOLD = 0.75
FAIL_THRESHOLD = 0.35
MIN_QUESTIONS = 4


def check_interview_decision(skill_graph):

    tested = [
        skill for skill in skill_graph.values()
        if skill["questions_asked"] > 0
    ]

    if not tested:
        return "CONTINUE"

    # Count interview rounds instead of skill hits
    total_questions = max(
        skill["questions_asked"] for skill in skill_graph.values()
    )

    # 🚨 Prevent early decision
    if total_questions < MIN_QUESTIONS:
        return "CONTINUE"

    fit_score = sum(s["confidence"] for s in tested) / len(tested)

    if fit_score >= PASS_THRESHOLD:
        return "PASS"

    if fit_score <= FAIL_THRESHOLD:
        return "FAIL"

    return "CONTINUE"
def select_next_skill(skill_graph):

    untested = []
    weak = []
    uncertain = []
    strong = []

    for skill, data in skill_graph.items():

        if data["questions_asked"] == 0:
            untested.append(skill)

        elif data["confidence"] < 0.4:
            weak.append(skill)

        elif data["confidence"] < 0.7:
            uncertain.append(skill)

        else:
            strong.append(skill)

    if untested:
        return untested[0]

    if weak:
        return weak[0]

    if uncertain:
        return uncertain[0]

    return strong[0]


def determine_difficulty(score):

    if score >= 8:
        return "hard"

    if score >= 5:
        return "medium"

    return "easy"