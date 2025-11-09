# 🚀 Deployment Checklist - Render.com

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] `.gitignore` configured properly
- [ ] No sensitive data in repository (API keys, passwords)
- [ ] Dependencies updated in `requirements.txt`
- [ ] Environment variables documented

### 2. Backend Configuration Files
- [ ] `backend/.env.example` - Template for environment variables
- [ ] `backend/.gitignore` - Ignore sensitive files
- [ ] `backend/requirements.txt` - Python dependencies
- [ ] `backend/render.yaml` - Render configuration
- [ ] `backend/runtime.txt` - Python version (3.11.0)
- [ ] `backend/Procfile` - Process command (optional)
- [ ] `backend/README.md` - Documentation
- [ ] `backend/DEPLOY.md` - Deployment guide

### 3. Environment Variables Ready
- [ ] Google Gemini API key obtained
- [ ] Frontend deployment URL known (for CORS)
- [ ] All required env vars listed in `.env.example`

### 4. Database Preparation (ChromaDB)
Choose one option:
- [ ] Option A: Database embedded in repository
- [ ] Option B: Use Render Disk for storage
- [ ] Option C: Recreate database on deploy (with ingest script)

### 5. Testing Local
- [ ] Backend runs locally: `http://localhost:8000`
- [ ] Health endpoint works: `/health`
- [ ] WebSocket connection works: `/ws`
- [ ] API documentation accessible: `/docs`
- [ ] No errors in console/logs

---

## 🌐 Render.com Deployment Steps

### Step 1: GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] Main branch is up-to-date

### Step 2: Create Web Service
1. [ ] Log in to Render Dashboard: https://dashboard.render.com
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repository
4. [ ] Or use "Blueprint" with `render.yaml`

### Step 3: Service Configuration
- [ ] **Name:** `nexus-ai-backend` (or your choice)
- [ ] **Region:** Singapore (or closest to users)
- [ ] **Branch:** `main`
- [ ] **Root Directory:** `backend`
- [ ] **Runtime:** Python 3
- [ ] **Build Command:** `pip install -r requirements.txt`
- [ ] **Start Command:** `uvicorn app.server:app --host 0.0.0.0 --port $PORT`

### Step 4: Instance Type
- [ ] **Free Tier:** For testing (512MB RAM, sleeps after 15min)
- [ ] **Starter:** For production ($7/month, always on)

### Step 5: Environment Variables
Set in Render Dashboard → Environment:

**Required:**
- [ ] `GOOGLE_API_KEY` = `your_actual_api_key`

**Recommended:**
- [ ] `CORS_ORIGINS` = `https://your-frontend-url.com,http://localhost:3000`
- [ ] `HOST` = `0.0.0.0`
- [ ] `INTELLIGENT_DB_PATH` = `./chroma`
- [ ] `INTELLIGENT_COLLECTION` = `ksa_project`
- [ ] `CHAT_SESSIONS_FILE` = `smart_chat_sessions.json`
- [ ] `MAX_CONTEXT_MESSAGES` = `10`

**Note:** `PORT` is automatically set by Render

### Step 6: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes first time)
- [ ] Check logs for errors
- [ ] Wait for "Application startup complete"

### Step 7: Get Deployment URL
- [ ] Copy your service URL: `https://your-service.onrender.com`
- [ ] Save it for frontend configuration

---

## 🧪 Post-Deployment Testing

### Backend API Tests
- [ ] Health check: `https://your-service.onrender.com/health`
- [ ] API docs: `https://your-service.onrender.com/docs`
- [ ] Create session: `POST /session/new`
- [ ] WebSocket: `wss://your-service.onrender.com/ws`

### Test Commands
```bash
# Health check
curl https://your-service.onrender.com/health

# Create new session
curl -X POST https://your-service.onrender.com/session/new

# Test WebSocket (use wscat)
npm install -g wscat
wscat -c wss://your-service.onrender.com/ws
```

### Expected Responses
- [ ] Health returns: `{"status": "ok"}`
- [ ] Session returns: `{"session_id": "session_..."}`
- [ ] WebSocket connects successfully
- [ ] No 500 errors in logs

---

## 🎨 Frontend Configuration

### Update Frontend Environment
- [ ] Create/update `frontend/.env.local`:
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com/ws
```

### Test Frontend Connection
- [ ] Frontend can reach backend API
- [ ] Chat functionality works
- [ ] WebSocket messages send/receive
- [ ] No CORS errors in browser console

### Deploy Frontend (Choose Platform)

**Option A: Vercel**
- [ ] Connect GitHub repo
- [ ] Set `VITE_API_URL` and `VITE_WS_URL`
- [ ] Deploy from `frontend` folder

**Option B: Netlify**
- [ ] Connect GitHub repo
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Set environment variables

**Option C: Render Static Site**
- [ ] Create new Static Site
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`

---

## ⚙️ Advanced Configuration

### Persistent Storage (Render Disk)
- [ ] Create Disk: Name `chroma-storage`, Size 1GB
- [ ] Mount path: `/app/chroma`
- [ ] Update `INTELLIGENT_DB_PATH=/app/chroma`
- [ ] Upload database to disk

### Auto-Deploy
- [ ] Enable "Auto-Deploy" in Settings
- [ ] Every push triggers deployment

### Custom Domain
- [ ] Add custom domain in Settings
- [ ] Update DNS records
- [ ] Wait for SSL certificate

### Monitoring
- [ ] Check metrics: CPU, Memory, Requests
- [ ] Set up email alerts
- [ ] Monitor logs regularly

### Scaling
- [ ] Upgrade instance type if needed
- [ ] Enable horizontal scaling
- [ ] Add Redis for session management

---

## 🐛 Troubleshooting Checklist

### Deployment Failed
- [ ] Check build logs in Render Dashboard
- [ ] Verify `requirements.txt` is complete
- [ ] Ensure Python version matches `runtime.txt`
- [ ] Check for missing dependencies

### Application Not Starting
- [ ] Verify start command is correct
- [ ] Check `PORT` is from environment: `int(os.getenv("PORT", 8000))`
- [ ] Review application logs
- [ ] Ensure all environment variables are set

### 500 Internal Server Error
- [ ] Check `GOOGLE_API_KEY` is valid
- [ ] Verify ChromaDB path exists
- [ ] Review error logs for stack trace
- [ ] Test locally with same config

### CORS Errors
- [ ] Frontend URL added to `CORS_ORIGINS`
- [ ] Use comma separator, no spaces
- [ ] Include protocol: `https://`
- [ ] Restart service after changing

### WebSocket Connection Failed
- [ ] Use `wss://` (not `ws://`) for HTTPS
- [ ] Check WebSocket endpoint: `/ws`
- [ ] Verify backend URL is correct
- [ ] Test with wscat tool

### ChromaDB Not Found
- [ ] Verify database path in env vars
- [ ] Check if `chroma/` folder exists
- [ ] Upload database if using Render Disk
- [ ] Or recreate with ingest script

### High Memory Usage
- [ ] Upgrade instance type
- [ ] Check for memory leaks
- [ ] Reduce model size if possible
- [ ] Enable database connection pooling

---

## 📊 Success Criteria

### Backend Deployed ✅
- [x] Service is running (not crashed)
- [x] Health endpoint returns OK
- [x] API documentation accessible
- [x] WebSocket connects
- [x] No errors in logs

### Frontend Connected ✅
- [x] Can create chat session
- [x] Can send messages
- [x] Receives AI responses
- [x] No CORS errors
- [x] No console errors

### Performance ✅
- [x] Response time < 3 seconds
- [x] WebSocket latency < 500ms
- [x] No timeouts
- [x] Handles concurrent users

---

## 📝 Final Notes

### Costs
- **Free Tier:** $0/month (750 hours, sleeps after 15min)
- **Starter:** $7/month (always on, 512MB RAM)
- **Standard:** $15/month (1GB RAM)

### Support
- Render Documentation: https://render.com/docs
- Community Forum: https://community.render.com
- Support Email: support@render.com

### Next Steps After Successful Deploy
1. [ ] Share backend URL with team
2. [ ] Update frontend configuration
3. [ ] Test all features end-to-end
4. [ ] Monitor logs for first 24 hours
5. [ ] Set up monitoring/alerts
6. [ ] Document any issues/solutions
7. [ ] Create backup strategy

---

## 🎉 Deployment Complete!

Congratulations! Your NexusAI backend is now live on Render.com!

**Backend URL:** `https://your-service.onrender.com`
**API Docs:** `https://your-service.onrender.com/docs`

Remember to:
- Keep your API keys secure
- Monitor usage and costs
- Update dependencies regularly
- Back up your database
- Test before major updates

Happy coding! 🚀
