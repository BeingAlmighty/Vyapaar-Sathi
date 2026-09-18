import sys
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
import psycopg

# On Windows, psycopg3 async requires SelectorEventLoop instead of default ProactorEventLoop
if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    except Exception:
        pass

from app.database import init_db_pool, close_db_pool
from app.exceptions import (
    validation_exception_handler,
    http_exception_handler,
    database_exception_handler,
    generic_exception_handler,
)

from app.routes import (
    health_routes,
    merchant_routes,
    dashboard_routes,
    product_routes,
    inventory_routes,
    customer_routes,
    promotion_routes,
    campaign_routes,
    chat_routes,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database pool
    await init_db_pool()
    yield
    # Shutdown: Close Database pool
    await close_db_pool()

app = FastAPI(
    title="Paytm Autonomous Merchant Growth Teammate API",
    description="Production-grade AI business teammate backend for Paytm merchants.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers Registration
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(psycopg.Error, database_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Register API Routers
app.include_router(health_routes.router)
app.include_router(merchant_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(product_routes.router)
app.include_router(inventory_routes.router)
app.include_router(customer_routes.router)
app.include_router(promotion_routes.router)
app.include_router(campaign_routes.router)
app.include_router(chat_routes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
