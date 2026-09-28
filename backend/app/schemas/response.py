from pydantic import BaseModel
from typing import List

from app.schemas.investigation import Investigation


class AnalysisResponse(BaseModel):
    """
    Final response returned by the API.
    """

    success: bool

    investigations: List[Investigation]

    total_detected: int

    processing_time: float