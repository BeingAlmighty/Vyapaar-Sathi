from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime

class MerchantBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=50)
    business_name: str = Field(..., min_length=2, max_length=255)
    business_type: str = Field("Restaurant/Cafe", max_length=100)

class MerchantCreate(MerchantBase):
    pass

class MerchantResponse(MerchantBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
