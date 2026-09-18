from typing import List, Optional
from app.database import get_db_connection
from app.schemas.product_schema import ProductResponse, ProductCreate, ProductUpdate, ProductAnalyticsResponse

async def get_top_selling_products(merchant_id: int, limit: int = 5) -> List[ProductAnalyticsResponse]:
    """Returns top selling products for the last 30 days compared to previous period."""
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                WITH current_period AS (
                    SELECT 
                        ti.product_id,
                        SUM(ti.quantity) as current_qty,
                        SUM(ti.total_amount) as current_sales
                    FROM transaction_items ti
                    JOIN transactions t ON ti.transaction_id = t.id
                    WHERE t.merchant_id = %s 
                      AND t.transaction_date >= NOW() - INTERVAL '30 days'
                    GROUP BY ti.product_id
                ),
                previous_period AS (
                    SELECT 
                        ti.product_id,
                        SUM(ti.quantity) as prev_qty,
                        SUM(ti.total_amount) as prev_sales
                    FROM transaction_items ti
                    JOIN transactions t ON ti.transaction_id = t.id
                    WHERE t.merchant_id = %s 
                      AND t.transaction_date >= NOW() - INTERVAL '60 days'
                      AND t.transaction_date < NOW() - INTERVAL '30 days'
                    GROUP BY ti.product_id
                )
                SELECT 
                    p.id as product_id,
                    p.name,
                    p.category,
                    p.price,
                    COALESCE(c.current_sales, 0.0) as current_sales,
                    COALESCE(prev.prev_sales, 0.0) as previous_sales,
                    COALESCE(c.current_qty, 0) as quantity_sold,
                    CASE 
                        WHEN COALESCE(prev.prev_sales, 0) = 0 THEN 0.0
                        ELSE ROUND(((COALESCE(c.current_sales, 0) - prev.prev_sales) / prev.prev_sales * 100)::numeric, 2)
                    END as growth_percent
                FROM products p
                LEFT JOIN current_period c ON p.id = c.product_id
                LEFT JOIN previous_period prev ON p.id = prev.product_id
                WHERE p.merchant_id = %s
                ORDER BY current_sales DESC
                LIMIT %s;
            """, (merchant_id, merchant_id, merchant_id, limit))
            rows = await cur.fetchall()
            return [ProductAnalyticsResponse(
                product_id=row['product_id'],
                name=row['name'],
                category=row['category'],
                price=float(row['price']),
                current_sales=float(row['current_sales']),
                previous_sales=float(row['previous_sales']),
                growth_percent=float(row['growth_percent']),
                quantity_sold=int(row['quantity_sold'])
            ) for row in rows]

async def get_declining_products(merchant_id: int, limit: int = 5) -> List[ProductAnalyticsResponse]:
    """Returns products with biggest percentage decline in sales over recent 30 days."""
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                WITH current_period AS (
                    SELECT 
                        ti.product_id,
                        SUM(ti.quantity) as current_qty,
                        SUM(ti.total_amount) as current_sales
                    FROM transaction_items ti
                    JOIN transactions t ON ti.transaction_id = t.id
                    WHERE t.merchant_id = %s 
                      AND t.transaction_date >= NOW() - INTERVAL '30 days'
                    GROUP BY ti.product_id
                ),
                previous_period AS (
                    SELECT 
                        ti.product_id,
                        SUM(ti.quantity) as prev_qty,
                        SUM(ti.total_amount) as prev_sales
                    FROM transaction_items ti
                    JOIN transactions t ON ti.transaction_id = t.id
                    WHERE t.merchant_id = %s 
                      AND t.transaction_date >= NOW() - INTERVAL '60 days'
                      AND t.transaction_date < NOW() - INTERVAL '30 days'
                    GROUP BY ti.product_id
                )
                SELECT 
                    p.id as product_id,
                    p.name,
                    p.category,
                    p.price,
                    COALESCE(c.current_sales, 0.0) as current_sales,
                    COALESCE(prev.prev_sales, 0.0) as previous_sales,
                    COALESCE(c.current_qty, 0) as quantity_sold,
                    CASE 
                        WHEN COALESCE(prev.prev_sales, 0) = 0 THEN 0.0
                        ELSE ROUND(((COALESCE(c.current_sales, 0) - prev.prev_sales) / prev.prev_sales * 100)::numeric, 2)
                    END as growth_percent
                FROM products p
                JOIN current_period c ON p.id = c.product_id
                JOIN previous_period prev ON p.id = prev.product_id
                WHERE p.merchant_id = %s AND prev.prev_sales > 0
                ORDER BY growth_percent ASC
                LIMIT %s;
            """, (merchant_id, merchant_id, merchant_id, limit))
            rows = await cur.fetchall()
            return [ProductAnalyticsResponse(
                product_id=row['product_id'],
                name=row['name'],
                category=row['category'],
                price=float(row['price']),
                current_sales=float(row['current_sales']),
                previous_sales=float(row['previous_sales']),
                growth_percent=float(row['growth_percent']),
                quantity_sold=int(row['quantity_sold'])
            ) for row in rows]

async def get_product_by_id(product_id: int) -> Optional[ProductResponse]:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT id, merchant_id, name, category, price, cost_price, created_at
                FROM products
                WHERE id = %s;
            """, (product_id,))
            row = await cur.fetchone()
            if not row:
                return None
            return ProductResponse(
                id=row['id'],
                merchant_id=row['merchant_id'],
                name=row['name'],
                category=row['category'],
                price=float(row['price']),
                cost_price=float(row['cost_price']),
                created_at=row['created_at']
            )

async def create_product(product_in: ProductCreate) -> ProductResponse:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                INSERT INTO products (merchant_id, name, category, price, cost_price)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, merchant_id, name, category, price, cost_price, created_at;
            """, (product_in.merchant_id, product_in.name, product_in.category, product_in.price, product_in.cost_price))
            row = await cur.fetchone()
            product_id = row['id']

            # Insert initial inventory
            await cur.execute("""
                INSERT INTO inventory (merchant_id, product_id, current_stock, min_reorder_level, max_stock_level)
                VALUES (%s, %s, %s, %s, %s);
            """, (product_in.merchant_id, product_id, product_in.initial_stock, product_in.min_reorder_level, product_in.min_reorder_level * 5))

            return ProductResponse(
                id=row['id'],
                merchant_id=row['merchant_id'],
                name=row['name'],
                category=row['category'],
                price=float(row['price']),
                cost_price=float(row['cost_price']),
                created_at=row['created_at']
            )

async def update_product(product_id: int, product_in: ProductUpdate) -> Optional[ProductResponse]:
    existing = await get_product_by_id(product_id)
    if not existing:
        return None

    name = product_in.name if product_in.name is not None else existing.name
    category = product_in.category if product_in.category is not None else existing.category
    price = product_in.price if product_in.price is not None else existing.price
    cost_price = product_in.cost_price if product_in.cost_price is not None else existing.cost_price

    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                UPDATE products
                SET name = %s, category = %s, price = %s, cost_price = %s
                WHERE id = %s
                RETURNING id, merchant_id, name, category, price, cost_price, created_at;
            """, (name, category, price, cost_price, product_id))
            row = await cur.fetchone()
            return ProductResponse(
                id=row['id'],
                merchant_id=row['merchant_id'],
                name=row['name'],
                category=row['category'],
                price=float(row['price']),
                cost_price=float(row['cost_price']),
                created_at=row['created_at']
            )

async def delete_product(product_id: int) -> bool:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("DELETE FROM products WHERE id = %s RETURNING id;", (product_id,))
            res = await cur.fetchone()
            return res is not None
