#!/bin/bash

echo "🔄 Restarting AniStream backend server..."

# Kill existing server process
pkill -f "node src/server.js" || echo "No existing server process found"

# Wait a moment
sleep 2

# Start the server
echo "🚀 Starting server..."
npm start &

echo "✅ Server restart initiated. Check logs for confirmation."
