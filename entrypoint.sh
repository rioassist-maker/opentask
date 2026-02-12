#!/bin/sh
set -e

echo "Starting OpenTask PocketBase..."

# Copy migrations if they don't exist in data dir
if [ ! -d "/pb/pb_data/pb_migrations" ]; then
  echo "Copying migrations to data directory..."
  mkdir -p /pb/pb_data
  cp -r /pb/pb_migrations /pb/pb_data/
  echo "Migrations copied successfully"
fi

echo "Launching PocketBase..."
# Start PocketBase with explicit data dir
cd /pb
exec ./pocketbase serve --http=0.0.0.0:8080 --dir=/pb/pb_data
