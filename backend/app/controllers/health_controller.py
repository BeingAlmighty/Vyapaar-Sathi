import httpx
from app.config import settings
from app.database import check_db_health

async def check_health():
    db_ok = await check_db_health()
    
    # Ping n8n
    n8n_status = "unavailable"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(settings.N8N_WEBHOOK_URL)
            if res.status_code < 500:
                n8n_status = "available"
    except Exception:
        n8n_status = "unavailable"

    # Ping ML Service
    ml_status = "unavailable"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(f"{settings.ML_SERVICE_URL.rstrip('/')}/health")
            if res.status_code == 200:
                ml_status = "available"
    except Exception:
        ml_status = "unavailable"

    return {
        "api": "healthy",
        "database": "healthy" if db_ok else "unhealthy",
        "n8n": n8n_status,
        "ml_service": ml_status
    }
