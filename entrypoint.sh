#!/bin/sh
set -e

# Railway inyecta PORT; localmente usamos 8080 por defecto
PORT="${PORT:-8080}"

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

echo "🚀 Launching PocketBase on port $PORT..."
echo "   - API: http://0.0.0.0:$PORT/api/"
echo "   - Admin: http://0.0.0.0:$PORT/_/"
echo "   - Frontend: http://0.0.0.0:$PORT/"
echo ""

# Start PocketBase (pb_public se sirve como sitio estático en /)
cd /pb
exec ./pocketbase serve --http="0.0.0.0:$PORT" --dir=/pb/pb_data
