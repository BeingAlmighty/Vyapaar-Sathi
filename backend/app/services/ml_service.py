import httpx
from typing import Dict, Any, List
from app.config import settings

async def call_ml_forecast(product_sales_summary: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Sends aggregated sales summary to Python ML service for demand forecasting.
    Includes fallback if ML service is unreachable.
    """
    url = f"{settings.ML_SERVICE_URL.rstrip('/')}/ml/forecast"
    payload = {"products": product_sales_summary}

    try:
        async with httpx.AsyncClient(timeout=settings.ML_SERVICE_TIMEOUT_SECONDS) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"ML Service unavailable (/ml/forecast): {e}")

    # Graceful Fallback if ML Service is offline
    return {
        "status": "fallback",
        "message": "ML Service unavailable. Returning baseline statistical forecast.",
        "forecasts": [
            {
                "product_id": item.get("product_id"),
                "product_name": item.get("name"),
                "expected_demand_next_30d": int(item.get("quantity_sold", 10) * 1.1),
                "trend": "stable"
            } for item in product_sales_summary
        ]
    }

async def call_ml_combinations(merchant_id: int) -> Dict[str, Any]:
    """
    Asks ML service to analyze item association rules / combo suggestions.
    Includes fallback matching Burger + Cold Coffee pattern.
    """
    url = f"{settings.ML_SERVICE_URL.rstrip('/')}/ml/combinations"
    payload = {"merchant_id": merchant_id}

    try:
        async with httpx.AsyncClient(timeout=settings.ML_SERVICE_TIMEOUT_SECONDS) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"ML Service unavailable (/ml/combinations): {e}")

    # Fallback combo recommendation matching hackathon demo seed pattern
    return {
        "status": "fallback",
        "recommended_combos": [
            {
                "item_1": "Veg Supreme Burger",
                "item_2": "Cold Coffee",
                "co_occurrence_count": 85,
                "suggested_combo_price": 180.0,
                "potential_revenue_lift": "18%"
            }
        ]
    }
