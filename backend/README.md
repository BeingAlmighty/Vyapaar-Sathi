# Paytm Autonomous Merchant Growth Teammate Backend API

Production-grade, high-performance FastAPI backend API built for the **Paytm Autonomous Merchant Growth Teammate** hackathon project.

## Architecture

```text
                 NEXT.JS FRONTEND
                        │
                        ▼
                 FASTAPI BACKEND
                        │
     ┌──────────────────┼──────────────────┐
     ▼                  ▼                  ▼
PostgreSQL         n8n Webhook        Python ML Service
(Deterministic)    (AI Orchestrator)  (Forecast/Demand)
```

## Quick Start & Local Setup

### 1. Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Setup PostgreSQL & Environment Variables
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```

Create the PostgreSQL database:
```sql
CREATE DATABASE paytm_growth_db;
```

### 4. Initialize Database Schema & Seed Demo Data
```powershell
python seed/seed_data.py
```

The seed script creates realistic business data with key hackathon demo anomalies:
* **Burger Sales:** Down ~34% over recent 30 days
* **Cold Coffee:** Excess inventory (180 units in stock vs max 50 level)
* **Paneer Roll:** Sales declining
* **Inactive Customers:** 24 designated inactive customers (>45 days since last order)
* **Ineffective Promotion:** "Monsoon Special 15% Off" with negative ROI
* **Product Combo:** Strong association between Veg Supreme Burger and Cold Coffee

### 5. Run FastAPI Server
```powershell
uvicorn app.main:app --reload --port 8000
```

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Application health and dependency statuses (DB, n8n, ML) |
| `GET` | `/api/merchants/{merchant_id}` | Fetch merchant profile details |
| `GET` | `/api/dashboard/{merchant_id}` | Aggregated sales, AOV, top/declining products, alerts |
| `GET` | `/api/products/top/{merchant_id}` | Top selling products by revenue |
| `GET` | `/api/products/declining/{merchant_id}` | Products with steep sales decline |
| `GET` | `/api/products/{product_id}` | Get product details |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{product_id}` | Update product details |
| `DELETE` | `/api/products/{product_id}` | Delete a product |
| `GET` | `/api/inventory/risk/{merchant_id}` | Inventory stockout risk, low stock, excess stock |
| `GET` | `/api/customers/retention/{merchant_id}` | Customer retention and repeat purchase rate |
| `GET` | `/api/customers/at-risk/{merchant_id}` | Detailed list of at-risk / inactive customers |
| `GET` | `/api/promotions/{merchant_id}` | Promotion performance, incremental sales, ROI |
| `POST` | `/api/campaigns` | Create campaign (initial state `pending_approval`) |
| `GET` | `/api/campaigns/{merchant_id}` | List merchant campaigns |
| `POST` | `/api/campaigns/{campaign_id}/approve` | Merchant approval for pending campaign |
| `POST` | `/api/chat` | AI Teammate chat integration with n8n & multi-language support |

---

## Verification Commands

To verify code compilation across all modules:
```powershell
python -m compileall app
```
