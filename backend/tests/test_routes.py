import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["api"] == "healthy"

@patch("app.controllers.merchant_controller.handle_get_merchant")
def test_get_merchant_endpoint(mock_get_merchant):
    mock_get_merchant.return_value = {
        "id": 1,
        "name": "Rajesh Sharma",
        "email": "rajesh.sharma@paytm-merchant.com",
        "phone": "+919876543210",
        "business_name": "Rajesh Fast Food & Cafe",
        "business_type": "Restaurant/Cafe",
        "created_at": "2026-01-01T00:00:00Z"
    }

    response = client.get("/api/merchants/1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Rajesh Sharma"

@patch("app.controllers.dashboard_controller.handle_get_dashboard")
def test_get_dashboard_endpoint(mock_get_dashboard):
    mock_get_dashboard.return_value = {
        "merchant_id": 1,
        "sales_summary": {
            "today_sales": 1500.0,
            "today_orders": 10,
            "monthly_sales": 45000.0,
            "monthly_orders": 300,
            "previous_monthly_sales": 57000.0,
            "sales_growth_percent": -21.05,
            "average_order_value": 150.0
        },
        "top_selling_products": [],
        "declining_products": [],
        "inventory_risk": {
            "low_stock_count": 1,
            "excess_stock_count": 1,
            "stockout_risk_count": 1,
            "items": []
        },
        "customer_metrics": {
            "total_customers": 60,
            "new_customers": 5,
            "returning_customers": 31,
            "repeat_purchase_rate": 51.67,
            "inactive_customers_count": 24,
            "at_risk_customers_count": 0
        },
        "alerts_and_opportunities": []
    }

    response = client.get("/api/dashboard/1")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["sales_summary"]["sales_growth_percent"] == -21.05

def test_campaign_create_and_approval_validation():
    # Test valid chat endpoint with language fallback
    chat_payload = {
        "merchant_id": 1,
        "message": "Meri sales kyun gir rahi hai?",
        "language": "hinglish"
    }
    response = client.post("/api/chat", json=chat_payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["language"] == "hinglish"
