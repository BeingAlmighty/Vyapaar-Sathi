from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class PromotionBase(BaseModel):
    merchant_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=2, max_length=255)
    discount_percent: float = Field(0.0, ge=0.0, le=100.0)
    discount_amount: float = Field(0.0, ge=0.0)
    start_date: datetime
    end_date: datetime
    target_category: Optional[str] = None
    status: str = Field("active", max_length=50)

class PromotionCreate(PromotionBase):
    pass

class PromotionResponse(PromotionBase):
    id: int
    created_at: datetime
    actual_sales: Optional[float] = 0.0
    incremental_sales: Optional[float] = 0.0
    roi_percent: Optional[float] = 0.0
    effectiveness: Optional[str] = "moderate"

    model_config = ConfigDict(from_attributes=True)
