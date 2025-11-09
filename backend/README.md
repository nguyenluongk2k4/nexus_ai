# Backend API - Nexus AI

Backend service cho Nexus AI sử dụng FastAPI, Google Gemini AI, và ChromaDB vector database.

## 🚀 Quick Start

### Local Development

1. **Cài đặt dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Tạo file `.env` từ template:**
```bash
cp .env.example .env
```

3. **Cấu hình `.env`:**
```env
GOOGLE_API_KEY=your_google_api_key_here
```

4. **Chạy server:**
```bash
# Cách 1: Sử dụng uvicorn trực tiếp
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000

# Cách 2: Chạy file server.py
python -m app.server

# Cách 3: Sử dụng script (từ root folder)
./run-dev.bat
```

5. **Test API:**
- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs

## 📁 Cấu trúc Project

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py           # Environment configuration
│   ├── server.py           # FastAPI application
│   └── smart_chatbot.py    # Chatbot logic with RAG
├── chroma/                 # ChromaDB vector database
├── .env                    # Environment variables (not in git)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── requirements.txt        # Python dependencies
├── render.yaml            # Render.com config
├── runtime.txt            # Python version
├── Procfile               # Process file for deployment
├── DEPLOY.md              # Deployment guide
└── README.md              # This file
```

## 🔧 Environment Variables

Xem file `.env.example` để biết tất cả các biến environment:

### Required
- `GOOGLE_API_KEY` - Google Gemini API key

### Optional
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8000)
- `CORS_ORIGINS` - Allowed origins (default: localhost:3000,localhost:5173)
- `INTELLIGENT_DB_PATH` - ChromaDB path (default: ./chroma)
- `INTELLIGENT_COLLECTION` - Collection name (default: ksa_project)
- `CHAT_SESSIONS_FILE` - Chat sessions file (default: smart_chat_sessions.json)
- `MAX_CONTEXT_MESSAGES` - Max context messages (default: 10)

## 📡 API Endpoints

### REST Endpoints

#### Health Check
```http
GET /health
```
Response:
```json
{
  "status": "ok"
}
```

#### Create New Session
```http
POST /session/new
```
Response:
```json
{
  "session_id": "session_20231109_143022"
}
```

### WebSocket Endpoint

#### Chat WebSocket
```
WS /ws
```

**Message Types:**

1. **Ping/Pong:**
```json
// Send
{"type": "ping"}

// Receive
{"type": "pong"}
```

2. **New Session:**
```json
// Send
{"type": "new_session"}

// Receive
{
  "type": "session_started",
  "session_id": "session_20231109_143022"
}
```

3. **User Message:**
```json
// Send
{
  "type": "user_message",
  "text": "What is Python?",
  "session_id": "session_20231109_143022"
}

// Receive (thinking status)
{
  "type": "status",
  "status": "thinking",
  "session_id": "session_20231109_143022"
}

// Receive (bot response)
{
  "type": "bot_message",
  "text": "Python is a high-level programming language...",
  "session_id": "session_20231109_143022"
}

// Receive (idle status)
{
  "type": "status",
  "status": "idle",
  "session_id": "session_20231109_143022"
}
```

4. **Error:**
```json
{
  "type": "error",
  "error": "error_code",
  "message": "Error description",
  "session_id": "session_20231109_143022"
}
```

## 🧠 Smart Chatbot Features

### RAG (Retrieval Augmented Generation)
- Sử dụng ChromaDB để lưu trữ và tìm kiếm documents
- Embedding model: `paraphrase-multilingual-mpnet-base-v2`
- Cosine similarity search

### Memory Management
- Session-based conversation history
- Context window: 10 messages
- Persistent storage in JSON file

### AI Model
- Google Gemini 2.5 Flash
- Vietnamese language support
- Markdown formatted responses

## 🚀 Deployment

Xem file [DEPLOY.md](./DEPLOY.md) để biết chi tiết về deployment lên Render.com

### Quick Deploy to Render.com

1. Push code to GitHub
2. Connect GitHub repo to Render
3. Configure environment variables
4. Deploy!

URL: `https://your-service.onrender.com`

## 📦 Dependencies

Main libraries:
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **ChromaDB** - Vector database
- **Google Generative AI** - LLM
- **Sentence Transformers** - Embeddings
- **PyTorch** - ML framework
- **python-dotenv** - Environment management

See `requirements.txt` for full list.

## 🐛 Troubleshooting

### ChromaDB not found
```bash
# Ensure database exists
ls -la chroma/

# Recreate database (if you have ingest script)
python ingest.py
```

### Import errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS errors
- Check `CORS_ORIGINS` in `.env`
- Ensure frontend URL is included

### Port already in use
```bash
# Change port in .env
PORT=8001

# Or kill process
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

## 🛠️ Tech Stack

- **FastAPI** - Modern web framework
- **Google Gemini AI** - Large language model
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embeddings
- **Uvicorn** - ASGI server
