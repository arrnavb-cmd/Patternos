#!/bin/bash
cd /Users/arrnavb/Desktop/ARRNAVB/SaaS/PatternOS

# Check if CSV files exist
echo "🔍 Checking for CSV files..."
CSV_DIR="/mnt/user-data/uploads"

if [ ! -d "$CSV_DIR" ]; then
    echo "⚠️  Using local CSV files from data/csv_samples/"
    CSV_DIR="data/csv_samples"
fi

# Run ETL
python3 intent_intelligence/etl/etl_load_sample_data.py

echo "✅ ETL Complete!"
