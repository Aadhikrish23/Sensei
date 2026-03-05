from pydantic import BaseModel
from typing import List, Optional




class Topic(BaseModel):
    name: str
    category: str


class ResumeParseResponse(BaseModel):
    role: Optional[str]
    seniority: Optional[str]

    skills: List[str]
    tools: List[str]
    frameworks: List[str]
    cloud: List[str]
    database: List[str]

    topics: List[Topic]

    experience: Optional[str]
    education: Optional[str]