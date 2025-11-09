# Environment Variables Configuration Guide

## 📋 Backend Environment Variables

Copy `.env.example` to `.env` và cấu hình các biến sau:

### Required Variables

```env
# Google Gemini API Key (REQUIRED)
# Get from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_actual_api_key_here
```

### Optional Variables (có default values)

```env
# Database Configuration
INTELLIGENT_DB_PATH=./chroma              # ChromaDB storage path
INTELLIGENT_COLLECTION=ksa_project        # Collection name in ChromaDB

# Server Configuration
HOST=0.0.0.0                             # Server host
PORT=8000                                 # Server port

# CORS Configuration
# Comma-separated list of allowed origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173

# Chat Settings
CHAT_SESSIONS_FILE=smart_chat_sessions.json  # Chat history storage
MAX_CONTEXT_MESSAGES=10                      # Max messages in context

# Embedding Model
EMBEDDING_MODEL_NAME=sentence-transformers/paraphrase-multilingual-mpnet-base-v2
```

## 🎨 Frontend Environment Variables

Create `.env.local` trong folder `frontend/`:

### Development

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# WebSocket URL
VITE_WS_URL=ws://localhost:8000/ws
```

### Production

```env
# Backend API URL (your deployed backend)
VITE_API_URL=https://your-backend.onrender.com

# WebSocket URL
VITE_WS_URL=wss://your-backend.onrender.com/ws
```

## 🔐 Security Best Practices

### 1. Never commit sensitive data
```bash
# These files are in .gitignore
backend/.env
frontend/.env.local
```

### 2. Use different API keys for dev/prod
```env
# Development
GOOGLE_API_KEY=dev_key_here

# Production (set in Render dashboard)
GOOGLE_API_KEY=prod_key_here
```

### 3. Restrict CORS origins in production
```env
# Development - allow localhost
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Production - only allow your domain
CORS_ORIGINS=https://yourdomain.com
```

## 🌐 Platform-Specific Configuration

### Render.com (Backend)

Set these in Render Dashboard → Environment:

```env
GOOGLE_API_KEY=your_key
HOST=0.0.0.0
PORT=8000  # Render sets this automatically, but you can override
CORS_ORIGINS=https://your-frontend-url.com
INTELLIGENT_DB_PATH=./chroma
INTELLIGENT_COLLECTION=ksa_project
CHAT_SESSIONS_FILE=smart_chat_sessions.json
MAX_CONTEXT_MESSAGES=10
```

### Vercel (Frontend)

Set in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com/ws
```

### Netlify (Frontend)

Set in Netlify Dashboard → Site settings → Environment variables:

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com/ws
```

## 🔍 How to Get API Keys

### Google Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env`: `GOOGLE_API_KEY=your_key_here`

**Or via Google Cloud Console:**

1. Visit: https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Generative Language API"
4. Go to "Credentials"
5. Create "API Key"
6. (Optional) Restrict key to specific APIs and IPs

## ✅ Verification

### Check Backend Config

```bash
cd backend
python -c "from app.config import settings; print(settings.GOOGLE_API_KEY[:10])"
```

Should print first 10 characters of your API key.

### Check Frontend Config

```bash
cd frontend
npm run dev
# Check browser console for API_URL
```

### Test API Connection

```bash
# Backend health check
curl http://localhost:8000/health

# Or deployed version
curl https://your-backend.onrender.com/health
```

## 🐛 Troubleshooting

### "GOOGLE_API_KEY not found"

**Solution:**
1. Ensure `.env` file exists in `backend/` folder
2. Check file name is exactly `.env` (not `.env.txt`)
3. Verify API key is set: `GOOGLE_API_KEY=your_key`
4. Restart backend server

### "CORS policy error"

**Solution:**
1. Check frontend URL is in `CORS_ORIGINS`
2. Use comma to separate multiple origins
3. Include protocol (`http://` or `https://`)
4. Restart backend after changing

### "Connection refused"

**Solution:**
1. Check backend is running: `http://localhost:8000/health`
2. Verify `VITE_API_URL` matches backend address
3. Check firewall/antivirus not blocking

### Environment variables not loading

**Solution:**

Backend:
```bash
# Check .env file location
ls -la backend/.env

# Manual load test
python -c "from dotenv import load_dotenv; load_dotenv(); import os; print(os.getenv('GOOGLE_API_KEY'))"
```

Frontend:
```bash
# Check .env.local location
ls -la frontend/.env.local

# Variables must start with VITE_
# Restart dev server after changes
npm run dev
```

## 📚 References

- [python-dotenv Documentation](https://pypi.org/project/python-dotenv/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [FastAPI Settings Management](https://fastapi.tiangolo.com/advanced/settings/)

## 📝 Template Summary

### Quick Setup Commands

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your API key
nano .env  # or use any text editor

# Frontend
cd frontend
cp .env.example .env.local  # if available
# Edit .env.local
nano .env.local
```

### Minimal Working Configuration

**Backend `.env`:**
```env
GOOGLE_API_KEY=your_key_here
```

**Frontend `.env.local`:**
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

That's the minimum needed to run locally!
