from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    merchant_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=2, max_length=255)
    category: str = Field(..., min_length=2, max_length=100)
    price: float = Field(..., ge=0.0)
    cost_price: float = Field(..., ge=0.0)

class ProductCreate(ProductBase):
    initial_stock: Optional[int] = Field(10, ge=0)
    min_reorder_level: Optional[int] = Field(10, ge=0)

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    price: Optional[float] = Field(None, ge=0.0)
    cost_price: Optional[float] = Field(None, ge=0.0)

class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductAnalyticsResponse(BaseModel):
    product_id: int
    name: str
    category: str
    price: float
    current_sales: float
    previous_sales: float
    growth_percent: float
    quantity_sold: int
