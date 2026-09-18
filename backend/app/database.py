import sys
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import psycopg
from psycopg_pool import AsyncConnectionPool
from psycopg.rows import dict_row
from app.config import settings

# Global async connection pool
pool: AsyncConnectionPool = None

async def init_db_pool():
    global pool
    if pool is None:
        try:
            pool = AsyncConnectionPool(
                conninfo=settings.DATABASE_URL,
                min_size=settings.DB_MIN_POOL_SIZE,
                max_size=settings.DB_MAX_POOL_SIZE,
                open=False,
                kwargs={"row_factory": dict_row}
            )
            await pool.open()
            print("PostgreSQL connection pool initialized successfully.")
        except Exception as e:
            print(f"Warning: Failed to initialize PostgreSQL pool: {e}", file=sys.stderr)

async def close_db_pool():
    global pool
    if pool is not None:
        await pool.close()
        pool = None
        print("PostgreSQL connection pool closed.")

@asynccontextmanager
async def get_db_connection():
    """
    Async context manager for acquiring a database connection from the pool.
    Yields an AsyncConnection with dict_row row factory.
    """
    global pool
    if pool is None:
        # Fallback inline connection attempt if pool not initialized
        conn = await psycopg.AsyncConnection.connect(settings.DATABASE_URL, row_factory=dict_row)
        try:
            yield conn
        finally:
            await conn.close()
    else:
        async with pool.connection() as conn:
            yield conn

async def check_db_health() -> bool:
    """Checks database responsiveness."""
    try:
        async with get_db_connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT 1;")
                res = await cur.fetchone()
                return res is not None
    except Exception:
        return False
