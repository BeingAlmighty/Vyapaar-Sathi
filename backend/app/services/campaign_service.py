from typing import List, Optional
from datetime import datetime, timezone
import json
from app.database import get_db_connection
from app.schemas.campaign_schema import CampaignCreate, CampaignResponse, CampaignApproveResponse

ALLOWED_TRANSITIONS = {
    "pending_approval": ["approved", "rejected"],
    "approved": ["scheduled", "active"],
    "scheduled": ["active", "completed"],
    "active": ["completed"],
    "rejected": [],
    "completed": []
}

async def create_campaign(campaign_in: CampaignCreate) -> CampaignResponse:
    """Creates a campaign in mandatory 'pending_approval' state."""
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            metrics_json_str = json.dumps(campaign_in.metrics_json or {})
            await cur.execute("""
                INSERT INTO campaigns (merchant_id, title, description, campaign_type, status, target_audience, metrics_json)
                VALUES (%s, %s, %s, %s, 'pending_approval', %s, %s::jsonb)
                RETURNING id, merchant_id, title, description, campaign_type, status, target_audience, metrics_json, created_at, updated_at;
            """, (
                campaign_in.merchant_id,
                campaign_in.title,
                campaign_in.description,
                campaign_in.campaign_type,
                campaign_in.target_audience,
                metrics_json_str
            ))
            row = await cur.fetchone()
            return CampaignResponse(
                id=row['id'],
                merchant_id=row['merchant_id'],
                title=row['title'],
                description=row['description'],
                campaign_type=row['campaign_type'],
                status=row['status'],
                target_audience=row['target_audience'],
                metrics_json=row['metrics_json'],
                created_at=row['created_at'],
                updated_at=row['updated_at']
            )

async def get_campaigns_by_merchant(merchant_id: int) -> List[CampaignResponse]:
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT id, merchant_id, title, description, campaign_type, status, target_audience, metrics_json, created_at, updated_at
                FROM campaigns
                WHERE merchant_id = %s
                ORDER BY created_at DESC;
            """, (merchant_id,))
            rows = await cur.fetchall()
            return [CampaignResponse(
                id=row['id'],
                merchant_id=row['merchant_id'],
                title=row['title'],
                description=row['description'],
                campaign_type=row['campaign_type'],
                status=row['status'],
                target_audience=row['target_audience'],
                metrics_json=row['metrics_json'] if isinstance(row['metrics_json'], dict) else json.loads(row['metrics_json'] or '{}'),
                created_at=row['created_at'],
                updated_at=row['updated_at']
            ) for row in rows]

async def approve_campaign(campaign_id: int) -> CampaignApproveResponse:
    """
    Approves a campaign only if currently in 'pending_approval' state.
    Rejects repeat approval attempts.
    """
    async with get_db_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT id, status FROM campaigns WHERE id = %s;
            """, (campaign_id,))
            row = await cur.fetchone()
            if not row:
                raise ValueError(f"Campaign with ID {campaign_id} not found.")

            current_status = row['status']

            if current_status != "pending_approval":
                raise ValueError(
                    f"Campaign cannot be approved. Current status is '{current_status}'. "
                    f"Only campaigns in 'pending_approval' status can be approved."
                )

            now = datetime.now(timezone.utc)
            await cur.execute("""
                UPDATE campaigns
                SET status = 'approved', updated_at = %s
                WHERE id = %s
                RETURNING id, status, updated_at;
            """, (now, campaign_id))
            updated_row = await cur.fetchone()

            return CampaignApproveResponse(
                campaign_id=updated_row['id'],
                status=updated_row['status'],
                message="Campaign approved successfully. Workflow triggered for execution.",
                updated_at=updated_row['updated_at']
            )
