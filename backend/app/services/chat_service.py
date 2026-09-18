import httpx
import json
from typing import Dict, Any
from app.config import settings
from app.schemas.chat_schema import ChatRequest, ChatResponse, VisualElement
from app.services.dashboard_service import get_dashboard_summary

FALLBACK_MESSAGES = {
    "hinglish": "Aapka AI teammate abhi temporary unavailable hai. Aap dashboard par latest business insights dekh sakte hain.",
    "hindi": "आपका AI साथी अभी अस्थायी रूप से उपलब्ध नहीं है। आप डैशबोर्ड पर नवीनतम व्यावसायिक जानकारी देख सकते हैं।",
    "english": "Your AI teammate is temporarily unavailable. You can still view your latest business insights on the dashboard."
}

def default_json_serializer(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    return str(obj)

async def process_chat_message(chat_in: ChatRequest) -> ChatResponse:
    """
    Gathers SQL-based business metrics context and forwards to n8n AI webhook.
    Returns structured response or graceful multi-language fallback if n8n is offline.
    """
    # 1. Fetch deterministic SQL business metrics (NO LLM calculation)
    dashboard_data = {}
    try:
        dashboard_data = await get_dashboard_summary(chat_in.merchant_id)
    except Exception as e:
        print(f"Failed to fetch dashboard context for chat: {e}")

    # Serialize dashboard_data to ensure datetime objects are converted to ISO strings
    safe_dashboard_context = json.loads(json.dumps(dashboard_data, default=default_json_serializer))

    # Payload sent to n8n webhook
    n8n_payload = {
        "merchant_id": chat_in.merchant_id,
        "message": chat_in.message,
        "language": chat_in.language,
        "business_context": safe_dashboard_context
    }

    url = settings.N8N_WEBHOOK_URL

    # 2. Forward request to n8n webhook
    try:
        async with httpx.AsyncClient(timeout=settings.N8N_TIMEOUT_SECONDS) as client:
            res = await client.post(url, json=n8n_payload)
            if res.status_code == 200:
                data = res.json()
                
                # Format visual elements if present
                visuals = []
                if "visuals" in data and isinstance(data["visuals"], list):
                    for v in data["visuals"]:
                        visuals.append(VisualElement(
                            type=v.get("type", "line_chart"),
                            data_source=v.get("data_source", "sales_trend"),
                            payload=v.get("payload")
                        ))

                return ChatResponse(
                    message=data.get("message", "Analysis completed."),
                    language=data.get("language", chat_in.language),
                    visuals=visuals,
                    suggestions=data.get("suggestions", []),
                    workers=data.get("workers", [])
                )
    except Exception as e:
        print(f"n8n webhook call failed: {e}")

    # 3. Clean Graceful Fallback if n8n is offline or unreachable
    fallback_text = FALLBACK_MESSAGES.get(chat_in.language, FALLBACK_MESSAGES["english"])

    # Build demo visual fallback based on actual SQL metrics
    sales_growth = dashboard_data.get("sales_summary", {}).get("sales_growth_percent", 0.0)
    
    visuals = [
        VisualElement(
            type="line_chart",
            data_source="sales_trend",
            payload={"growth_percent": sales_growth}
        )
    ]

    suggestions = [
        "Which products are declining?",
        "What should I restock?",
        "Suggest a promotion for inactive customers"
    ]

    workers = ["Sales Worker", "Product Worker", "Customer Worker", "Inventory Worker"]

    return ChatResponse(
        message=f"{fallback_text} (Current Monthly Sales Growth: {sales_growth}%)",
        language=chat_in.language,
        visuals=visuals,
        suggestions=suggestions,
        workers=workers
    )
