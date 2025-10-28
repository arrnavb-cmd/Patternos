#!/usr/bin/env bash
set -eu
if [ -z "${1:-}" ]; then
  echo "Usage: $0 <TOKEN>"
  exit 2
fi
TOKEN="$1"
echo "$TOKEN" | docker compose exec -T app python -c 'import sys, json, jwt; from app.config import settings; t=sys.stdin.read().strip(); 
try:
  print("DECODE_OK", json.dumps(jwt.decode(t, settings.JWT_SECRET, algorithms=[settings.JWT_ALGO])))
except Exception as e:
  print("DECODE_ERROR", type(e).__name__, str(e))'
