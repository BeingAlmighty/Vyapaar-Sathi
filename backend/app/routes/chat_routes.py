from fastapi import APIRouter
from app.controllers.chat_controller import handle_chat_message
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/chat", tags=["AI Teammate Chat"])

@router.post("", response_model=APIResponse[ChatResponse])
async def chat_with_teammate(chat_in: ChatRequest):
    data = await handle_chat_message(chat_in)
    return APIResponse(success=True, data=data)
