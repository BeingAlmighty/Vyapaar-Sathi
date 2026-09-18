from app.schemas.chat_schema import ChatRequest
from app.services.chat_service import process_chat_message

async def handle_chat_message(chat_in: ChatRequest):
    return await process_chat_message(chat_in)
