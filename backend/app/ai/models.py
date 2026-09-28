# from pydantic import BaseModel

# from typing import List


# class GeminiInvestigation(BaseModel):
#     name: str
#     reason: str


# class GeminiResponse(BaseModel):
#     investigations: List[GeminiInvestigation]

from typing import List
from pydantic import BaseModel, Field


class GeminiInvestigation(BaseModel):
    raw_name: str
    standard_name: str
    confidence: float = Field(ge=0.0, le=1.0)


class GeminiResponse(BaseModel):
    investigations: List[GeminiInvestigation]

