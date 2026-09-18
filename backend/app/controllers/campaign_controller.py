from fastapi import HTTPException
from app.services import campaign_service
from app.schemas.campaign_schema import CampaignCreate

async def handle_create_campaign(campaign_in: CampaignCreate):
    return await campaign_service.create_campaign(campaign_in)

async def handle_get_campaigns(merchant_id: int):
    return await campaign_service.get_campaigns_by_merchant(merchant_id)

async def handle_approve_campaign(campaign_id: int):
    try:
        return await campaign_service.approve_campaign(campaign_id)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))
