# 🌟 NexusAI - AI Skill Tree Platform

Full-stack application with separated Frontend (React) and Backend (FastAPI).

## 📁 Project Structure

```
nexus_ai/
├── frontend/          # 🎨 React + Vite UI
├── backend/           # 🔧 FastAPI + Gemini AI
├── docs/              # 📚 Documentation
├── scripts/           # 🚀 Development scripts
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Option 1: Run Both (Frontend + Backend)

```bash
# Windows
scripts\dev-all.bat
```

This will open 2 windows:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

### Option 2: Run Separately

**Frontend only:**
```bash
cd frontend
npm install
npm run dev
```

**Backend only:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.server:app --reload
```

## 📚 Documentation

- **Frontend README**: `frontend/README.md`
- **Backend README**: `backend/README.md`
- **Learning System**: `docs/LEARNING_SYSTEM.md`
- **Quiz System**: `docs/QUIZ_SYSTEM_ANALYSIS.md`
- **Quick Start**: `docs/QUICKSTART.md`

## 🔧 Configuration

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Backend (.env)
```env
GOOGLE_API_KEY=your_api_key_here
INTELLIGENT_DB_PATH=./chroma
```

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS + Radix UI
- React Context for state

### Backend
- FastAPI
- Google Gemini AI
- ChromaDB (Vector DB)
- Python 3.8+

## 📖 Features

- 🎯 **Skill Tree Visualization** - Interactive tree for 5 IT specializations
- 💬 **AI Chatbot** - Smart assistant powered by Gemini AI
- 📊 **Learning Progress** - Track study sessions, timeline, reminders
- 📈 **Insights & Analytics** - Charts, stats, achievements
- 🎓 **Quiz System** (planned) - Knowledge assessment

## 🎨 Original Design

Figma: https://www.figma.com/design/9UkKdzzJQO8UhrAwIAJDnE/AI-Skill-Tree-Web-UI

## 📝 License

MIT License