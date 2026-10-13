
from typing import Any, List
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation: List[ChatMessage] = Field(default_factory=list)
    investigations: List[Any] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
