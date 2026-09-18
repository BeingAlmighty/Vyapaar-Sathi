from typing import List
from app.database import get_db_connection
from app.schemas.customer_schema import CustomerRetentionResponse, AtRiskCustomerResponse

async def get_customer_retention(merchant_id: int) -> CustomerRetentionResponse:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT 
                    COUNT(*) as total_customers,
                    COUNT(CASE WHEN first_order_date >= NOW() - INTERVAL '30 days' THEN 1 END) as new_customers,
                    COUNT(CASE WHEN total_orders > 1 THEN 1 END) as returning_customers,
                    COUNT(CASE WHEN last_order_date < NOW() - INTERVAL '45 days' THEN 1 END) as inactive_customers,
                    COUNT(CASE WHEN last_order_date BETWEEN (NOW() - INTERVAL '45 days') AND (NOW() - INTERVAL '30 days') THEN 1 END) as at_risk_customers
                FROM customers
                WHERE merchant_id = %s;
            """, (merchant_id,))
            row = await cur.fetchone()
            
            total = int(row['total_customers']) if row else 0
            new_c = int(row['new_customers']) if row else 0
            ret_c = int(row['returning_customers']) if row else 0
            inactive = int(row['inactive_customers']) if row else 0
            at_risk = int(row['at_risk_customers']) if row else 0

            repeat_rate = round((ret_c / total * 100), 2) if total > 0 else 0.0

            return CustomerRetentionResponse(
                total_customers=total,
                new_customers=new_c,
                returning_customers=ret_c,
                repeat_purchase_rate=repeat_rate,
                inactive_customers_count=inactive,
                at_risk_customers_count=at_risk
            )

async def get_at_risk_customers(merchant_id: int, min_inactive_days: int = 30) -> List[AtRiskCustomerResponse]:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT 
                    id,
                    name,
                    phone,
                    email,
                    last_order_date,
                    EXTRACT(DAY FROM (NOW() - last_order_date))::int as days_inactive,
                    total_orders,
                    total_spend
                FROM customers
                WHERE merchant_id = %s 
                  AND last_order_date <= NOW() - (%s * INTERVAL '1 day')
                ORDER BY last_order_date ASC;
            """, (merchant_id, min_inactive_days))
            rows = await cur.fetchall()

            return [AtRiskCustomerResponse(
                id=row['id'],
                name=row['name'],
                phone=row['phone'],
                email=row['email'],
                last_order_date=row['last_order_date'],
                days_inactive=int(row['days_inactive']) if row['days_inactive'] is not None else 999,
                total_orders=int(row['total_orders']),
                total_spend=float(row['total_spend'])
            ) for row in rows]
