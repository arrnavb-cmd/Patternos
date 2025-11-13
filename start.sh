#!/bin/bash
set -e

echo "🚀 Starting PatternOS..."

# Initialize database
python3 init_db_railway.py

# Start uvicorn - Railway provides PORT variable
exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
