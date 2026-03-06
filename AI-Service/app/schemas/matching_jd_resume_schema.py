from pydantic import BaseModel
from typing import List,Optional

class MatchRequest(BaseModel):
    jd_data:dict
    resume_data:dict