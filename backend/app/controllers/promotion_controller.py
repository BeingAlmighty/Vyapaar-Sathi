from app.services.promotion_service import get_promotions

async def handle_get_promotions(merchant_id: int):
    return await get_promotions(merchant_id)
