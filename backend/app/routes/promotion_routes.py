from typing import List
from fastapi import APIRouter, Path
from app.controllers.promotion_controller import handle_get_promotions
from app.schemas.promotion_schema import PromotionResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/promotions", tags=["Promotion Intelligence"])

@router.get("/{merchant_id}", response_model=APIResponse[List[PromotionResponse]])
async def get_promotions(merchant_id: int = Path(..., gt=0)):
    data = await handle_get_promotions(merchant_id)
    return APIResponse(success=True, data=data)
