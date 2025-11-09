import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # API Keys
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    
    # Database paths
    INTELLIGENT_DB_PATH = os.getenv("INTELLIGENT_DB_PATH", "./chroma")
    INTELLIGENT_COLLECTION = os.getenv("INTELLIGENT_COLLECTION", "ksa_project")
    
    # Server configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "8000"))
    
    # CORS origins
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Chat settings
    CHAT_SESSIONS_FILE = os.getenv("CHAT_SESSIONS_FILE", "smart_chat_sessions.json")
    MAX_CONTEXT_MESSAGES = int(os.getenv("MAX_CONTEXT_MESSAGES", "10"))
    
    # Embedding model
    EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"

settings = Settings()
