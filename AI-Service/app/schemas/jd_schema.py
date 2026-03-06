from pydantic import BaseModel
from typing import List, Optional


class Topic(BaseModel):
    name: str
    category: str

class JDRequest(BaseModel):
    rawText: str
class JDParseResponse(BaseModel):

    role: Optional[str]
    seniority: Optional[str]

    skills: List[str]
    tools: List[str]
    frameworks: List[str]
    cloud: List[str]
    database: List[str]

    topics: List[Topic]

    responsibilities: List[str]

    qualifications: List[str]

    experience_required: Optional[str]

    education_required: Optional[str]




