from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class CampaignBase(BaseModel):
    merchant_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    campaign_type: str = Field(..., max_length=100)
    target_audience: Optional[str] = None
    metrics_json: Optional[Dict[str, Any]] = Field(default_factory=dict)

class CampaignCreate(CampaignBase):
    pass

class CampaignResponse(CampaignBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CampaignApproveResponse(BaseModel):
    campaign_id: int
    status: str
    message: str
    updated_at: datetime
