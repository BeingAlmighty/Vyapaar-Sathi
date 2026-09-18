from fastapi import APIRouter, Path
from app.controllers.inventory_controller import handle_get_inventory_risk
from app.schemas.inventory_schema import InventoryRiskSummaryResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/inventory", tags=["Inventory Intelligence"])

@router.get("/risk/{merchant_id}", response_model=APIResponse[InventoryRiskSummaryResponse])
async def get_inventory_risk(merchant_id: int = Path(..., gt=0)):
    data = await handle_get_inventory_risk(merchant_id)
    return APIResponse(success=True, data=data)
