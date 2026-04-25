from pydantic import BaseModel
from typing import List

class AgentResponse(BaseModel):
    score: float
    strengths: List[str]
    weaknesses: List[str]
    risks: List[str]
    verdict: str