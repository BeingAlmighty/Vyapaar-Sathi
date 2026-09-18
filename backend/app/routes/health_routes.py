from fastapi import APIRouter
from app.controllers.health_controller import check_health
from app.schemas.common_schema import APIResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=APIResponse[dict])
async def get_health_status():
    data = await check_health()
    return APIResponse(success=True, data=data)
