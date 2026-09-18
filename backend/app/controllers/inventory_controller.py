from app.services.inventory_service import get_inventory_risk

async def handle_get_inventory_risk(merchant_id: int):
    return await get_inventory_risk(merchant_id)
