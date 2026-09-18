import unittest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from app.main import app

class TestBackendAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data["success"])
        self.assertEqual(json_data["data"]["api"], "healthy")

    @patch("app.controllers.merchant_controller.handle_get_merchant")
    def test_get_merchant_endpoint(self, mock_get_merchant):
        mock_get_merchant.return_value = {
            "id": 1,
            "name": "Rajesh Sharma",
            "email": "rajesh.sharma@paytm-merchant.com",
            "phone": "+919876543210",
            "business_name": "Rajesh Fast Food & Cafe",
            "business_type": "Restaurant/Cafe",
            "created_at": "2026-01-01T00:00:00Z"
        }

        response = self.client.get("/api/merchants/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["name"], "Rajesh Sharma")

    def test_get_dashboard_endpoint(self):
        # Calls live Supabase database for merchant 1
        response = self.client.get("/api/dashboard/1")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data["success"])
        self.assertIn("sales_summary", json_data["data"])
        self.assertIn("sales_growth_percent", json_data["data"]["sales_summary"])

    def test_chat_fallback(self):
        chat_payload = {
            "merchant_id": 1,
            "message": "Meri sales kyun gir rahi hai?",
            "language": "hinglish"
        }
        response = self.client.post("/api/chat", json=chat_payload)
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data["success"])
        self.assertEqual(json_data["data"]["language"], "hinglish")
        self.assertIn("visuals", json_data["data"])
        self.assertIn("suggestions", json_data["data"])

if __name__ == "__main__":
    unittest.main()
