#!/bin/sh
set -e

# Copy migrations if they don't exist in data dir
if [ ! -d "/pb/pb_data/pb_migrations" ]; then
  echo "Copying migrations to data directory..."
  mkdir -p /pb/pb_data
  cp -r /pb/pb_migrations /pb/pb_data/
fi

# Start PocketBase
exec /pb/pocketbase serve --http=0.0.0.0:8080
