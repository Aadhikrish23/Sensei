from pydantic import BaseModel
from typing import List, Optional


class Topic(BaseModel):
    name: str
    category: str


class JDParsedResponse(BaseModel):
    role: Optional[str] = None
    seniority: Optional[str] = None
    skills: List[str] = []
    tools: List[str] = []
    frameworks: List[str] = []
    cloud: List[str] = []
    database: List[str] = []
    topics: List[Topic] = []
    experience: Optional[str] = None
    education: Optional[str] = None