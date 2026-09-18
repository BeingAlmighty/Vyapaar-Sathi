from typing import List
from fastapi import APIRouter, Path, Query
from app.controllers import customer_controller
from app.schemas.customer_schema import CustomerRetentionResponse, AtRiskCustomerResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/customers", tags=["Customer Intelligence"])

@router.get("/retention/{merchant_id}", response_model=APIResponse[CustomerRetentionResponse])
async def get_retention(merchant_id: int = Path(..., gt=0)):
    data = await customer_controller.handle_get_retention(merchant_id)
    return APIResponse(success=True, data=data)

@router.get("/at-risk/{merchant_id}", response_model=APIResponse[List[AtRiskCustomerResponse]])
async def get_at_risk_customers(merchant_id: int = Path(..., gt=0), min_inactive_days: int = Query(30, ge=1)):
    data = await customer_controller.handle_get_at_risk(merchant_id, min_inactive_days)
    return APIResponse(success=True, data=data)
