#!/bin/bash

# Build script for Render.com
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Optional: Run database initialization if needed
# echo "🔧 Initializing database..."
# python scripts/init_db.py

echo "✅ Build completed successfully!"
