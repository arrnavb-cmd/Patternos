"""commerce tracking

Revision ID: 002
Revises: 001
Create Date: 2025-11-02 22:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'

def upgrade():
    # Purchases table
    op.create_table('purchases',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('order_id', sa.String(), unique=True),
        sa.Column('user_id', sa.String()),
        sa.Column('total_amount', sa.Float()),
        sa.Column('items', sa.JSON()),
        sa.Column('category', sa.String()),
        sa.Column('attributed_to_ad', sa.Boolean()),
        sa.Column('ad_campaign_id', sa.String()),
        sa.Column('ad_brand', sa.String()),
        sa.Column('ad_channel', sa.String()),
        sa.Column('location', sa.String()),
        sa.Column('timestamp', sa.DateTime()),
        sa.Column('client_id', sa.String())
    )
    
    # Ad impressions table
    op.create_table('ad_impressions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.String()),
        sa.Column('campaign_id', sa.String()),
        sa.Column('brand', sa.String()),
        sa.Column('product_id', sa.String()),
        sa.Column('category', sa.String()),
        sa.Column('channel', sa.String()),
        sa.Column('placement', sa.String()),
        sa.Column('viewed', sa.Boolean()),
        sa.Column('clicked', sa.Boolean()),
        sa.Column('location', sa.String()),
        sa.Column('timestamp', sa.DateTime()),
        sa.Column('client_id', sa.String())
    )
    
    # Campaigns table
    op.create_table('ad_campaigns',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('campaign_id', sa.String(), unique=True),
        sa.Column('brand', sa.String()),
        sa.Column('name', sa.String()),
        sa.Column('total_budget', sa.Float()),
        sa.Column('spent', sa.Float()),
        sa.Column('channels', sa.JSON()),
        sa.Column('target_categories', sa.JSON()),
        sa.Column('target_locations', sa.JSON()),
        sa.Column('status', sa.String()),
        sa.Column('start_date', sa.DateTime()),
        sa.Column('end_date', sa.DateTime()),
        sa.Column('client_id', sa.String())
    )

def downgrade():
    op.drop_table('ad_campaigns')
    op.drop_table('ad_impressions')
    op.drop_table('purchases')
