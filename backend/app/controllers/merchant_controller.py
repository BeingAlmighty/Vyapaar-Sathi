from fastapi import HTTPException
from app.services.merchant_service import get_merchant_by_id

async def handle_get_merchant(merchant_id: int):
    merchant = await get_merchant_by_id(merchant_id)
    if not merchant:
        raise HTTPException(status_code=404, detail=f"Merchant with ID {merchant_id} not found")
    return merchant
