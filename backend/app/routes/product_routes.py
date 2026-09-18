from typing import List
from fastapi import APIRouter, Path, Query
from app.controllers import product_controller
from app.schemas.product_schema import ProductResponse, ProductCreate, ProductUpdate, ProductAnalyticsResponse
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/products", tags=["Product Management & Intelligence"])

@router.get("/top/{merchant_id}", response_model=APIResponse[List[ProductAnalyticsResponse]])
async def get_top_products(merchant_id: int = Path(..., gt=0), limit: int = Query(5, ge=1, le=50)):
    data = await product_controller.handle_get_top_products(merchant_id, limit)
    return APIResponse(success=True, data=data)

@router.get("/declining/{merchant_id}", response_model=APIResponse[List[ProductAnalyticsResponse]])
async def get_declining_products(merchant_id: int = Path(..., gt=0), limit: int = Query(5, ge=1, le=50)):
    data = await product_controller.handle_get_declining_products(merchant_id, limit)
    return APIResponse(success=True, data=data)

@router.get("/{product_id}", response_model=APIResponse[ProductResponse])
async def get_product(product_id: int = Path(..., gt=0)):
    data = await product_controller.handle_get_product(product_id)
    return APIResponse(success=True, data=data)

@router.post("", response_model=APIResponse[ProductResponse], status_code=201)
async def create_product(product_in: ProductCreate):
    data = await product_controller.handle_create_product(product_in)
    return APIResponse(success=True, data=data)

@router.put("/{product_id}", response_model=APIResponse[ProductResponse])
async def update_product(product_in: ProductUpdate, product_id: int = Path(..., gt=0)):
    data = await product_controller.handle_update_product(product_id, product_in)
    return APIResponse(success=True, data=data)

@router.delete("/{product_id}", response_model=APIResponse[dict])
async def delete_product(product_id: int = Path(..., gt=0)):
    data = await product_controller.handle_delete_product(product_id)
    return APIResponse(success=True, data=data)
