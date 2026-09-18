from app.database import get_db_connection
from app.schemas.merchant_schema import MerchantResponse

async def get_merchant_by_id(merchant_id: int) -> MerchantResponse:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT id, name, email, phone, business_name, business_type, created_at
                FROM merchants
                WHERE id = %s;
            """, (merchant_id,))
            row = await cur.fetchone()
            if not row:
                return None
            return MerchantResponse(**row)
