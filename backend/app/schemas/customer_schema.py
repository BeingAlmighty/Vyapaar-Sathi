from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    merchant_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., min_length=10, max_length=50)
    email: Optional[EmailStr] = None

class CustomerResponse(CustomerBase):
    id: int
    first_order_date: Optional[datetime] = None
    last_order_date: Optional[datetime] = None
    total_orders: int = 0
    total_spend: float = 0.0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CustomerRetentionResponse(BaseModel):
    total_customers: int
    new_customers: int
    returning_customers: int
    repeat_purchase_rate: float
    inactive_customers_count: int
    at_risk_customers_count: int

class AtRiskCustomerResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    last_order_date: Optional[datetime] = None
    days_inactive: int
    total_orders: int
    total_spend: float
