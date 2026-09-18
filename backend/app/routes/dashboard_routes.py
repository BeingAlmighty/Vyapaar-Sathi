from fastapi import APIRouter, Path
from app.controllers.dashboard_controller import handle_get_dashboard
from app.schemas.common_schema import APIResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/{merchant_id}", response_model=APIResponse[dict])
async def get_dashboard(merchant_id: int = Path(..., gt=0)):
    data = await handle_get_dashboard(merchant_id)
    return APIResponse(success=True, data=data)
