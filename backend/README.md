# NexusAI Backend

FastAPI backend with Google Gemini AI and ChromaDB for the AI Skill Tree platform.

## 🚀 Development

### Prerequisites
- Python 3.8+
- pip

### Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at: **http://localhost:8000**

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Structure

```
app/
├── __init__.py         # Package init
├── server.py           # FastAPI application
├── smart_chatbot.py    # Chatbot logic with Gemini AI
└── config.py           # Configuration management

chroma/                 # ChromaDB vector database
smart_chat_sessions.json # Chat sessions storage
```

## 🔧 Environment Variables

Create `.env`:

```env
# Google Gemini API Key (required)
GOOGLE_API_KEY=your_google_api_key_here

# Database
INTELLIGENT_DB_PATH=./chroma
INTELLIGENT_COLLECTION=ksa_project

# Server
HOST=0.0.0.0
PORT=8000

# CORS
CORS_ORIGINS=http://localhost:3000

# Chat
CHAT_SESSIONS_FILE=smart_chat_sessions.json
MAX_CONTEXT_MESSAGES=10
```

## 🎯 API Endpoints

### Health Check
```
GET /health
```

### New Chat Session
```
POST /session/new
```

### WebSocket Chat
```
WS /ws
```

## 🛠️ Tech Stack

- **FastAPI** - Modern web framework
- **Google Gemini AI** - Large language model
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embeddings
- **Uvicorn** - ASGI server
