from fastapi import APIRouter, HTTPException

from schemas import ChatRequest, ChatResponse
from services.llm_service import generate_medical_response

router = APIRouter(prefix="/ai-assistant", tags=["AI Assistant"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a user message to the AI assistant and return its response."""
    try:
        ai_response = await generate_medical_response(request.message)
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return ChatResponse(response=ai_response)