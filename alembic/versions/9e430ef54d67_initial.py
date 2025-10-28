"""initial

Revision ID: 9e430ef54d67
Revises: e813fba92e8b
Create Date: 2025-10-26 13:10:48.141192

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9e430ef54d67'
down_revision: Union[str, Sequence[str], None] = 'e813fba92e8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
