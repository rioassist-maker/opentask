#!/bin/sh
set -e

# Railway inyecta PORT; localmente usamos 8080 por defecto
PORT="${PORT:-8080}"

# Si Railway montó un volumen, usa ese path; si no, /pb/pb_data (ephemeral sin volumen)
DATA_DIR="${RAILWAY_VOLUME_MOUNT_PATH:-/pb/pb_data}"

echo "🚂 Starting OpenTask (Frontend + Backend on Railway)"
echo "   Data dir: $DATA_DIR ${RAILWAY_VOLUME_MOUNT_PATH:+[volume]}"
if [ -z "$RAILWAY_VOLUME_MOUNT_PATH" ]; then
  echo "   ⚠️  Sin volumen: los datos se pierden en cada deploy. Crea un Volume y monta en /pb/pb_data"
fi

# Copy migrations to data directory if not already there
if [ ! -d "$DATA_DIR/pb_migrations" ]; then
  echo "📦 Copying migrations to data directory..."
  mkdir -p "$DATA_DIR"
  cp -r /pb/pb_migrations "$DATA_DIR/"
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
exec ./pocketbase serve --http="0.0.0.0:$PORT" --dir="$DATA_DIR"
