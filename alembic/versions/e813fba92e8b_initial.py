"""initial

Revision ID: e813fba92e8b
Revises: f9f531586820
Create Date: 2025-10-26 13:09:43.062953

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e813fba92e8b'
down_revision: Union[str, Sequence[str], None] = 'f9f531586820'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
