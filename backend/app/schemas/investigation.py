from pydantic import BaseModel, Field


class Investigation(BaseModel):
    """
    Represents a single investigation/test extracted
    from a prescription.
    """

    original_name: str = Field(
        ...,
        description="Name extracted by Gemini"
    )

    canonical_name: str = Field(
        ...,
        description="Validated standardized investigation name"
    )

    confidence: float = Field(
        ...,
        ge=0,
        le=1,
        description="Confidence score"
    )

    validation_status: str = Field(
        ...,
        description="matched / partial / unknown"
    )

    reason: str = Field(
        ...,
        description="Why Gemini selected this investigation"
    )