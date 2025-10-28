# alembic/env.py
"""
Alembic environment configuration for PatternOS.
Works with SQLite (dev) and Postgres (prod).
Auto-loads app.config and app.db.Base for migrations.
"""

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config, pool
from alembic import context

# -------------------------------------------------------------------------
# 1. Make sure Alembic can import your app package (add repo root to sys.path)
# -------------------------------------------------------------------------
# Assuming structure: <repo_root>/
#   ├── alembic/
#   ├── app/
#   ├── Dockerfile, docker-compose.yml, etc.

repo_root = Path(__file__).resolve().parents[1]
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

# -------------------------------------------------------------------------
# 2. Import app settings and Base metadata
# -------------------------------------------------------------------------
try:
    from app.config import settings
    from app.db import Base
except Exception as exc:
    raise ImportError(
        "\n[alembic/env.py] ❌ Failed to import app modules.\n"
        "Check that:\n"
        "  • `app/__init__.py` exists (makes 'app' a package)\n"
        "  • `app/db.py` defines Base = declarative_base()\n"
        "  • Your working directory is the repo root (where alembic.ini is)\n\n"
        f"Original error:\n  {type(exc).__name__}: {exc}\n"
    ) from exc

# -------------------------------------------------------------------------
# 3. Alembic Config setup
# -------------------------------------------------------------------------
config = context.config

# Override sqlalchemy.url in alembic.ini with runtime value from app settings
if getattr(settings, "DATABASE_URL", None):
    config.set_main_option("sqlalchemy.url", str(settings.DATABASE_URL))

# Set up loggers via alembic.ini if file exists
if config.config_file_name:
    fileConfig(config.config_file_name)

# Set the metadata object for 'autogenerate' support
target_metadata = getattr(Base, "metadata", None)

# -------------------------------------------------------------------------
# 4. Migration runners
# -------------------------------------------------------------------------

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    is_sqlite = url.startswith("sqlite:")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=is_sqlite,  # Enable SQLite-safe ALTERs
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        dialect_name = connection.dialect.name.lower()
        is_sqlite = dialect_name == "sqlite"

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=is_sqlite,  # Enable SQLite batch mode
        )

        with context.begin_transaction():
            context.run_migrations()


# -------------------------------------------------------------------------
# 5. Entrypoint
# -------------------------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
