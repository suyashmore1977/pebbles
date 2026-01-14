# Railway Deployment Guide

Complete guide to deploying Pebbles on Railway.app.

---

## Prerequisites

1. GitHub account with Pebbles repo
2. Railway account (free tier available)
3. Gemini API key from Google AI Studio

---

## Deployment Steps

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose `suyashmore1977/pebbles`

---

### Step 2: Deploy Backend

Since Pebbles is a monorepo, you need to configure the root directory.

1. Click on the created service
2. Go to **Settings** tab
3. Under **"Root Directory"**, enter: `server`
4. Under **"Build"**, verify:
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Go to **Variables** tab
6. Add environment variable:
   - `GEMINI_API_KEY` = your_api_key_here
7. Go to **Settings** → **Networking**
8. Click **"Generate Domain"**
9. Note the URL (e.g., `https://pebbles-server-xxx.up.railway.app`)

---

### Step 3: Deploy Frontend

1. In the same project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose `suyashmore1977/pebbles` again
4. Click on the new service
5. Go to **Settings** tab
6. Under **"Root Directory"**, enter: `client`
7. Go to **Variables** tab
8. Add environment variable:
   - `VITE_API_URL` = (your backend URL from Step 2)
9. Go to **Settings** → **Networking**
10. Click **"Generate Domain"**

---

## Configuration Files

### Backend: `server/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Frontend: `client/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npx serve dist -s -l $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## Architecture on Railway

```
┌─────────────────────────────────────────────┐
│           Railway Project                    │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Frontend        │  │ Backend         │  │
│  │ (client/)       │  │ (server/)       │  │
│  │                 │  │                 │  │
│  │ React + Vite    │  │ Node + Express  │  │
│  │ Static files    │  │ API server      │  │
│  │                 │  │                 │  │
│  │ VITE_API_URL ───┼──┼─> Port 5000     │  │
│  └────────┬────────┘  └────────┬────────┘  │
│           │                    │           │
│           ▼                    │           │
│   pebbles-xxx.up.railway.app  │           │
│                                │           │
│                                ▼           │
│                   pebbles-api.up.railway.app│
└─────────────────────────────────────────────┘
```

---

## Auto-Deploys

Railway auto-deploys on every push to `main`:

```bash
git add .
git commit -m "Update"
git push origin main
# Railway automatically detects and redeploys
```

---

## Monitoring

### View Logs
1. Click on a service
2. Go to **"Deployments"** tab
3. Click on a deployment
4. View **"Build Logs"** and **"Deploy Logs"**

### Common Log Messages

**Backend**:
```
Server: http://localhost:5000
Model: gemini-2.0-flash
```

**Frontend**:
```
Serving! 
Local: http://localhost:PORT
```

---

## Costs

| Tier | Cost | Limits |
|------|------|--------|
| Free | $5/month credit | ~100 hours of usage |
| Pro | $20/month | Unlimited |

**Tips to reduce cost**:
- Services sleep when inactive
- Use Render for backend (more free hours)

---

## Troubleshooting

### "Railpack could not determine how to build"
**Solution**: Set Root Directory in Settings

### "Port already in use"
**Solution**: Remove PORT from env vars (Railway sets it automatically)

### "CORS error"
**Solution**: Backend already has CORS enabled. Check API URL is correct.

### "API calls failing"
**Solution**: Check VITE_API_URL ends without trailing slash

### Frontend shows blank page
**Solution**: Check browser console, verify VITE_API_URL is set
