from pydantic import BaseModel, Field
from typing import List, Optional


class Topic(BaseModel):
    name: str
    category: Optional[str] = None


class Project(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)


class WorkExperience(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    responsibilities: List[str] = Field(default_factory=list)


class ResumeParseResponse(BaseModel):

    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

    role: Optional[str] = None
    seniority: Optional[str] = None

    skills: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    cloud: List[str] = Field(default_factory=list)
    database: List[str] = Field(default_factory=list)

    topics: List[Topic] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    work_experience: List[WorkExperience] = Field(default_factory=list)

    achievements: List[str] = Field(default_factory=list)

    experience: Optional[str] = None
    education: Optional[str] = None


class ResumeRequest(BaseModel):
    rawText: str