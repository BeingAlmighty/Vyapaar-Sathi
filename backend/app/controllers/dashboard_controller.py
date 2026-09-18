from app.services.dashboard_service import get_dashboard_summary
from app.services.merchant_service import get_merchant_by_id
from fastapi import HTTPException

async def handle_get_dashboard(merchant_id: int):
    merchant = await get_merchant_by_id(merchant_id)
    if not merchant:
        raise HTTPException(status_code=404, detail=f"Merchant with ID {merchant_id} not found")
    return await get_dashboard_summary(merchant_id)
