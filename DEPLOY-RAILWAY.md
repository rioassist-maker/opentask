# Deploy OpenTask to Railway

**Quick setup:** 5-10 minutes  
**Cost:** $5/month credit (free tier)

---

## Prerequisites

1. Railway account (sign up with GitHub at https://railway.app)
2. GitHub repo access: https://github.com/rioassist-maker/opentask

---

## Deployment Steps

### 1. Create New Project

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select: `rioassist-maker/opentask`
4. Railway will auto-detect the Dockerfile

### 2. Configure Service

Railway should auto-configure, but verify:

- **Builder:** Dockerfile
- **Start Command:** `/pb/entrypoint.sh` (set automatically)
- **Port:** 8080 (auto-detected from EXPOSE in Dockerfile)

### 3. Add Volume for Database

**CRITICAL:** PocketBase needs persistent storage for SQLite database.

1. In your service, click **"Variables"** tab
2. Click **"New Variable"**
3. Add:
   - **Name:** `RAILWAY_VOLUME_MOUNT_PATH`
   - **Value:** `/pb/pb_data`

Or use Railway CLI:
```bash
railway volume create --name opentask-data --mount-path /pb/pb_data
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait ~2-3 minutes for build
3. Check logs for: `Server started at http://0.0.0.0:8080`

### 5. Get Public URL

1. Go to **"Settings"** tab
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `opentask-production.up.railway.app`)

### 6. Create Admin User

1. Visit `https://your-url.railway.app/_/`
2. Create admin account (first user is auto-admin)
3. Save credentials securely

### 7. Verify API

Test the API:
```bash
curl https://your-url.railway.app/api/health
```

Should return PocketBase version info.

---

## Update Frontend

Once deployed, update the frontend to point to Railway:

### Vercel Environment Variable

1. Go to Vercel dashboard → `frontend` project
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_POCKETBASE_URL`:
   - Old: `https://opentask.fly.dev`
   - New: `https://your-url.railway.app`
4. Redeploy frontend

---

## Environment Variables (Optional)

If needed, add these in Railway Variables tab:

```bash
# Admin email (optional, for automated setup)
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=secure_password_here

# API settings (optional)
PB_ENCRYPTION_KEY=generate_random_32_char_string
```

---

## Monitoring

### Check Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs
```

### Health Check

Add to your monitoring:
- **Endpoint:** `https://your-url.railway.app/api/health`
- **Expected:** 200 OK with PocketBase version

---

## Rollback (if needed)

Railway keeps deployment history:

1. Go to **"Deployments"** tab
2. Find previous working deployment
3. Click **"Redeploy"**

---

## Cost Estimate

- **Free tier:** $5 credit/month
- **Expected usage:** ~$3-4/month for hobby project
- **Includes:**
  - 512MB RAM
  - 1 GB storage
  - Unlimited bandwidth (fair use)

---

## Troubleshooting

### "Server not responding"
- Check logs for errors
- Verify volume is mounted at `/pb/pb_data`
- Ensure port 8080 is exposed

### "Migrations failed"
- Check `pb_migrations/` folder is in repo
- Verify migrations copied in entrypoint.sh
- Check Railway build logs

### "Database locked"
- Restart the service
- Ensure only one instance is running
- Check volume permissions

---

## Next Steps

After successful deployment:

1. ✅ Update frontend env var (Vercel)
2. ✅ Test task creation via frontend
3. ✅ Configure OpenClaw skill to use new URL
4. ✅ Update README.md with production URL
5. ✅ Delete Fly.io app (optional cleanup)

---

**Production URL:** https://your-url.railway.app  
**Admin UI:** https://your-url.railway.app/_/  
**API:** https://your-url.railway.app/api/

🚂 **Ready to ship!**
