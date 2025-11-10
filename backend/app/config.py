import os
from dotenv import load_dotenv


def _resolve_data_root() -> str:
    """Best-effort detection of writable data directory for persistent storage."""
    railway_volume = os.getenv("RAILWAY_VOLUME_MOUNT_PATH")
    if railway_volume:
        # Keep data isolated inside the mounted volume when running on Railway
        return os.path.join(railway_volume, "data")

    # Allow manual override via DATA_ROOT while keeping ./ as final fallback
    return os.getenv("DATA_ROOT", ".")

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # API Keys
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    
    # Data directories (support Railway volume mounts automatically)
    DATA_ROOT = _resolve_data_root()
    INTELLIGENT_DB_PATH = os.getenv("INTELLIGENT_DB_PATH", os.path.join(DATA_ROOT, "chroma"))
    INTELLIGENT_COLLECTION = os.getenv("INTELLIGENT_COLLECTION", "ksa_project")
    
    # Server configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "8000"))
    
    # CORS origins
    CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if origin.strip()]
    
    # Chat settings
    default_sessions_path = os.path.join(DATA_ROOT, "smart_chat_sessions.json")
    CHAT_SESSIONS_FILE = os.getenv("CHAT_SESSIONS_FILE", default_sessions_path)
    MAX_CONTEXT_MESSAGES = int(os.getenv("MAX_CONTEXT_MESSAGES", "10"))
    
    # Embedding model
    EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"

settings = Settings()
