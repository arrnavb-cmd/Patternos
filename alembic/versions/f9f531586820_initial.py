"""initial

Revision ID: f9f531586820
Revises: c0c9dc72b30b
Create Date: 2025-10-26 13:09:23.466517

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9f531586820'
down_revision: Union[str, Sequence[str], None] = 'c0c9dc72b30b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
