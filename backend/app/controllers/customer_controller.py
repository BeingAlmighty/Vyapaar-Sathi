from app.services.customer_service import get_customer_retention, get_at_risk_customers

async def handle_get_retention(merchant_id: int):
    return await get_customer_retention(merchant_id)

async def handle_get_at_risk(merchant_id: int, min_inactive_days: int = 30):
    return await get_at_risk_customers(merchant_id, min_inactive_days)
