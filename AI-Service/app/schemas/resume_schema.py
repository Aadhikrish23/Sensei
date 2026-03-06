from pydantic import BaseModel
from typing import List, Optional


class Topic(BaseModel):
    name: str
    category: str


class Project(BaseModel):
    name: Optional[str]
    description: Optional[str]
    technologies: List[str]


class WorkExperience(BaseModel):
    company: Optional[str]
    role: Optional[str]
    duration: Optional[str]
    responsibilities: List[str]


class ResumeParseResponse(BaseModel):

    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]

    role: Optional[str]
    seniority: Optional[str]

    skills: List[str]
    tools: List[str]
    frameworks: List[str]
    cloud: List[str]
    database: List[str]

    topics: List[Topic]

    projects: List[Project]

    work_experience: List[WorkExperience]

    achievements: List[str]

    experience: Optional[str]
    education: Optional[str]


class ResumeRequest(BaseModel):
    rawText:str