from fastapi import APIRouter, HTTPException

from .models import ChatRequest, ChatResponse
from .service import generate_response


router = APIRouter(
    prefix="/api/v1",
    tags=["Chatbot"]
)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:

        reply = generate_response(
            message=request.message,
            conversation=[
                {
                    "role": msg.role,
                    "content": msg.content
                }
                for msg in request.conversation
            ],
            investigations=request.investigations
        )

        return ChatResponse(reply=reply)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )