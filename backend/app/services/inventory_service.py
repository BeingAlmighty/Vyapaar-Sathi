from typing import List
from app.database import get_db_connection
from app.schemas.inventory_schema import InventoryItemResponse, InventoryRiskSummaryResponse

async def get_inventory_risk(merchant_id: int) -> InventoryRiskSummaryResponse:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT 
                    i.id,
                    i.product_id,
                    p.name as product_name,
                    p.category,
                    i.current_stock,
                    i.min_reorder_level,
                    i.max_stock_level,
                    i.last_restocked_at
                FROM inventory i
                JOIN products p ON i.product_id = p.id
                WHERE i.merchant_id = %s
                ORDER BY i.current_stock ASC;
            """, (merchant_id,))
            rows = await cur.fetchall()

            items = []
            low_stock_count = 0
            excess_stock_count = 0
            stockout_risk_count = 0

            for row in rows:
                stock = int(row['current_stock'])
                min_lvl = int(row['min_reorder_level'])
                max_lvl = int(row['max_stock_level'])

                status = "optimal"
                stockout_risk = "low"
                reorder_qty = 0

                if stock <= min_lvl:
                    status = "low_stock"
                    stockout_risk = "high" if stock < (min_lvl / 2) else "medium"
                    low_stock_count += 1
                    stockout_risk_count += 1
                    reorder_qty = max_lvl - stock
                elif stock > max_lvl:
                    status = "excess_stock"
                    stockout_risk = "low"
                    excess_stock_count += 1
                    reorder_qty = 0

                items.append(InventoryItemResponse(
                    id=row['id'],
                    product_id=row['product_id'],
                    product_name=row['product_name'],
                    category=row['category'],
                    current_stock=stock,
                    min_reorder_level=min_lvl,
                    max_stock_level=max_lvl,
                    status=status,
                    recommended_reorder_qty=reorder_qty,
                    stockout_risk=stockout_risk,
                    last_restocked_at=row['last_restocked_at']
                ))

            return InventoryRiskSummaryResponse(
                low_stock_count=low_stock_count,
                excess_stock_count=excess_stock_count,
                stockout_risk_count=stockout_risk_count,
                items=items
            )
