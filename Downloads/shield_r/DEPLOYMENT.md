# Deployment Guide - SHIELD_R

## Option 1: Deploy Frontend + Backend on Vercel (Monorepo)

### Step 1: Configure Vercel

Update `vercel.json` in root:
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### Step 2: Deploy Frontend to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts to link GitHub repo and deploy.

### Step 3: Deploy Backend Separately

Backend cannot run on Vercel (serverless limitations). Deploy to:
- **Render**: Free tier available (https://render.com)
- **Railway**: Simple deployment (https://railway.app)
- **Fly.io**: Docker-based (https://fly.io)
- **Heroku**: Classic option (https://heroku.com)

---

## Option 2: Backend on Render, Frontend on Vercel (RECOMMENDED)

### Step 1: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" > "Web Service"
3. Connect your GitHub repo
4. Fill in:
   - **Name**: shield-r-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start` (or `npm start`)
   - **Environment**: Add `PORT=10000` if needed

5. Deploy!

Get your backend URL: `https://shield-r-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. In Vercel project settings > Environment Variables
2. Add: `VITE_API_URL=https://shield-r-backend.onrender.com`
3. Redeploy the frontend

### Step 3: Update your Vite config

Edit `frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000')
  }
})
```

---

## Option 3: Full Stack on Render

Both frontend and backend on Render (simplest for beginners):

1. Deploy backend to Render (as above)
2. Update `VITE_API_URL` in frontend to point to backend
3. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://shield-r-backend.onrender.com
   ```
4. Build: `cd frontend && npm run build`
5. Deploy `frontend/dist` to Render as static site

---

## Troubleshooting

### 404 on Frontend Pages
- **Solution**: Ensure `vercel.json` has correct build config
- **Check**: Vercel dashboard > Deployments > Build logs

### 404 on API Calls
- **Check**: Is backend deployed and running?
- **Check**: Is `VITE_API_URL` set correctly?
- **Test**: Visit backend URL directly in browser: `https://backend-url/health`

### CORS Errors
- Backend already has CORS enabled
- If still issues, add to backend:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

### Build Fails
- Check `npm run build` works locally: `cd frontend && npm run build`
- Verify all dependencies are in `package.json`
- Check Node.js version compatibility

---

## Environment Variables

### Vercel Frontend
Dashboard > Settings > Environment Variables
```
VITE_API_URL=https://your-backend-url.com
```

### Render Backend
Dashboard > Environment > Add Variable
```
PORT=10000
NODE_ENV=production
```

---

## Quick Checklist

- [ ] Frontend builds locally: `npm run build`
- [ ] Backend runs locally: `npm start`
- [ ] Backend deployed to Render/Railway/etc
- [ ] `VITE_API_URL` set in Vercel
- [ ] Test `/health` endpoint on deployed backend
- [ ] Redeploy frontend after env var change
- [ ] Check browser console for API errors (F12)

---

## Useful Commands

```bash
# Build frontend
cd frontend && npm run build

# Test backend locally
npm start

# Check if backend is running
curl https://your-backend-url.com/health

# View Vercel logs
vercel logs

# View Render logs
# Dashboard > Service > Logs
```

---

## Example Deployment

**Frontend**: https://shield-r.vercel.app  
**Backend**: https://shield-r-backend.onrender.com

Environment Variable on Vercel:
```
VITE_API_URL=https://shield-r-backend.onrender.com
```

---

**Need help?** Check the logs on Vercel/Render dashboard!
