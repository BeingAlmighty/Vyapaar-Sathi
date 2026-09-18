from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class InventoryItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    category: str
    current_stock: int
    min_reorder_level: int
    max_stock_level: int
    status: str  # low_stock, excess_stock, optimal
    recommended_reorder_qty: int
    stockout_risk: str  # high, medium, low
    last_restocked_at: Optional[datetime] = None

class InventoryRiskSummaryResponse(BaseModel):
    low_stock_count: int
    excess_stock_count: int
    stockout_risk_count: int
    items: List[InventoryItemResponse]
