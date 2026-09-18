from fastapi import HTTPException
from app.services import product_service
from app.schemas.product_schema import ProductCreate, ProductUpdate

async def handle_get_top_products(merchant_id: int, limit: int = 5):
    return await product_service.get_top_selling_products(merchant_id, limit)

async def handle_get_declining_products(merchant_id: int, limit: int = 5):
    return await product_service.get_declining_products(merchant_id, limit)

async def handle_get_product(product_id: int):
    product = await product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
    return product

async def handle_create_product(product_in: ProductCreate):
    return await product_service.create_product(product_in)

async def handle_update_product(product_id: int, product_in: ProductUpdate):
    updated = await product_service.update_product(product_id, product_in)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
    return updated

async def handle_delete_product(product_id: int):
    success = await product_service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
    return {"message": "Product deleted successfully", "product_id": product_id}
