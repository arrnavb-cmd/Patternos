#!/usr/bin/env bash
set -euo pipefail

# Run alembic migrations (if alembic available)
if command -v alembic >/dev/null 2>&1; then
  echo "Running alembic upgrade head..."
  alembic upgrade head || {
    echo "Alembic upgrade failed — falling back to SQLAlchemy create_all()"
  }
else
  echo "alembic not found, skipping migrations"
fi

# Fallback to init_db if tables still missing (safe idempotent create_all)
python - <<'PY'
from app.db import init_db
try:
    init_db()
    print("DB init_db() complete")
except Exception as e:
    print("init_db failed:", e)
PY

# Exec the original CMD
exec "$@"
