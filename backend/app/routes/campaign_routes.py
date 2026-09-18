from typing import List
from fastapi import APIRouter, Path
from app.controllers import campaign_controller
from app.schemas.campaign_schema import CampaignCreate, CampaignResponse, CampaignApproveResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/campaigns", tags=["Autonomous Actions & Campaigns"])

@router.post("", response_model=APIResponse[CampaignResponse], status_code=201)
async def create_campaign(campaign_in: CampaignCreate):
    data = await campaign_controller.handle_create_campaign(campaign_in)
    return APIResponse(success=True, data=data)

@router.get("/{merchant_id}", response_model=APIResponse[List[CampaignResponse]])
async def get_campaigns(merchant_id: int = Path(..., gt=0)):
    data = await campaign_controller.handle_get_campaigns(merchant_id)
    return APIResponse(success=True, data=data)

@router.post("/{campaign_id}/approve", response_model=APIResponse[CampaignApproveResponse])
async def approve_campaign(campaign_id: int = Path(..., gt=0)):
    data = await campaign_controller.handle_approve_campaign(campaign_id)
    return APIResponse(success=True, data=data)
