from typing import List
from app.database import get_db_connection
from app.schemas.promotion_schema import PromotionResponse

async def get_promotions(merchant_id: int) -> List[PromotionResponse]:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT 
                    p.id,
                    p.merchant_id,
                    p.name,
                    p.discount_percent,
                    p.discount_amount,
                    p.start_date,
                    p.end_date,
                    p.target_category,
                    p.status,
                    p.created_at,
                    COALESCE(SUM(ti.total_amount), 0.0) as actual_sales
                FROM promotions p
                LEFT JOIN products prod ON p.target_category IS NULL OR prod.category = p.target_category
                LEFT JOIN transaction_items ti ON ti.product_id = prod.id
                LEFT JOIN transactions t ON ti.transaction_id = t.id AND t.transaction_date BETWEEN p.start_date AND p.end_date
                WHERE p.merchant_id = %s
                GROUP BY p.id;
            """, (merchant_id,))
            rows = await cur.fetchall()

            result = []
            for row in rows:
                sales = float(row['actual_sales'])
                disc_pct = float(row['discount_percent'])
                
                # Deterministic calculation of incremental sales & ROI
                expected_baseline = sales * (1.0 - (disc_pct / 100.0))
                incremental = sales - expected_baseline
                discount_cost = sales * (disc_pct / 100.0)
                
                roi = round(((incremental - discount_cost) / (discount_cost + 1.0)) * 100, 2)
                
                effectiveness = "high"
                if roi < 0:
                    effectiveness = "ineffective"
                elif roi < 25:
                    effectiveness = "moderate"

                result.append(PromotionResponse(
                    id=row['id'],
                    merchant_id=row['merchant_id'],
                    name=row['name'],
                    discount_percent=disc_pct,
                    discount_amount=float(row['discount_amount']),
                    start_date=row['start_date'],
                    end_date=row['end_date'],
                    target_category=row['target_category'],
                    status=row['status'],
                    created_at=row['created_at'],
                    actual_sales=sales,
                    incremental_sales=round(incremental, 2),
                    roi_percent=roi,
                    effectiveness=effectiveness
                ))
            return result
