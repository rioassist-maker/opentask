#!/bin/bash
set -e

echo "🚂 OpenTask - Fresh Railway Setup"
echo "=================================="
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "Step 1: Login to Railway"
railway login

echo ""
echo "Step 2: Create new project"
echo "Choose: Create Empty Project"
echo "Name it: opentask-fresh"
read -p "Press ENTER when project is created..."

echo ""
echo "Step 3: Link to this directory"
railway link

echo ""
echo "Step 4: Create volume for persistent database"
railway volume create opentask-data --mount-path /pb/pb_data

echo ""
echo "Step 5: Set environment variables"
railway variables set PORT=8080

echo ""
echo "Step 6: Deploy"
railway up

echo ""
echo "✅ Setup complete!"
echo "Next steps:"
echo "1. Get your Railway URL from dashboard"
echo "2. Visit https://your-url.railway.app/_/ to create admin"
echo "3. Test the app!"
