#!/bin/bash

# Start script for Render.com
echo "🚀 Starting Nexus AI Backend..."

# Use PORT from environment or default to 8000
PORT=${PORT:-8000}

echo "📡 Server will run on port: $PORT"

# Start uvicorn server
exec uvicorn app.server:app --host 0.0.0.0 --port $PORT --workers 1
