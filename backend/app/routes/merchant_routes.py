from fastapi import APIRouter, Path
from app.controllers.merchant_controller import handle_get_merchant
from app.schemas.merchant_schema import MerchantResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/merchants", tags=["Merchant Management"])

@router.get("/{merchant_id}", response_model=APIResponse[MerchantResponse])
async def get_merchant(merchant_id: int = Path(..., gt=0)):
    merchant = await handle_get_merchant(merchant_id)
    return APIResponse(success=True, data=merchant)
