#!/bin/sh
set -e

echo "🚂 Starting OpenTask (Frontend + Backend on Railway)"

# Copy migrations to data directory if not already there
if [ ! -d "/pb/pb_data/pb_migrations" ]; then
  echo "📦 Copying migrations to persistent volume..."
  mkdir -p /pb/pb_data
  cp -r /pb/pb_migrations /pb/pb_data/
  echo "✅ Migrations copied"
fi

# Verify frontend exists
if [ -d "/pb/pb_public" ]; then
  echo "✅ Frontend static files found in /pb/pb_public"
else
  echo "⚠️  WARNING: No frontend files found in /pb/pb_public"
fi

echo "🚀 Launching PocketBase..."
echo "   - API: http://0.0.0.0:8080/api/"
echo "   - Admin: http://0.0.0.0:8080/_/"
echo "   - Frontend: http://0.0.0.0:8080/"
echo ""

# Start PocketBase
# It will automatically serve pb_public as the root static site
cd /pb
exec ./pocketbase serve --http=0.0.0.0:8080 --dir=/pb/pb_data
