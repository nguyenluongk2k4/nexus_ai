import os
import json
import chromadb
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import torch

# Google Generative AI
import google.generativeai as genai
# THÊM THƯ VIỆN SENTENCE TRANSFORMER
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()

# --- Cấu hình CỐT LÕI ---
INTELLIGENT_DB_PATH = './chroma' 
INTELLIGENT_COLLECTION = 'ksa_project' 
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
CHAT_SESSIONS_FILE = 'smart_chat_sessions.json'
MAX_CONTEXT_MESSAGES = 10 

# THÊM MODEL EMBEDDING GIỐNG HỆT FILE INGEST.PY
EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"

class SmartChatMemory:
    """
    Quản lý memory và context cho smart chatbot.
    Lưu và tải session từ file JSON.
    """
    
    def __init__(self, sessions_file: str = CHAT_SESSIONS_FILE):
        self.sessions_file = sessions_file
        self.sessions = self.load_sessions()
        self.current_session_id = None
        self.current_context = []
    
    def load_sessions(self) -> Dict[str, List[Dict]]:
        """Load chat sessions từ file"""
        try:
            if os.path.exists(self.sessions_file):
                with open(self.sessions_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading sessions: {e}")
        return {}
    
    def save_sessions(self):
        """Save chat sessions vào file"""
        try:
            with open(self.sessions_file, 'w', encoding='utf-8') as f:
                json.dump(self.sessions, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving sessions: {e}")
    
    def start_new_session(self) -> str:
        """Bắt đầu session mới"""
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.current_session_id = session_id
        self.sessions[session_id] = []
        self.current_context = []
        return session_id
    
    def add_message(self, user_message: str, ai_response: str):
        """Thêm tin nhắn vào session hiện tại (Đã bỏ sources thừa)"""
        if not self.current_session_id:
            self.start_new_session()
        
        message = {
            'timestamp': datetime.now().isoformat(),
            'user': user_message,
            'ai': ai_response,
        }
        
        # Thêm vào session để lưu file
        self.sessions[self.current_session_id].append(message)
        
        # Thêm vào context (bộ nhớ tạm) cho prompt tiếp theo
        self.current_context.append(message)
        if len(self.current_context) > MAX_CONTEXT_MESSAGES:
            self.current_context = self.current_context[-MAX_CONTEXT_MESSAGES:]
        
        self.save_sessions()
    
    def get_context_for_prompt(self) -> str:
        """Tạo context string cho prompt"""
        if not self.current_context:
            return ""
        
        context_parts = ["=== LỊCH SỬ CUỘC TRÒ CHUYỆN GẦN ĐÂY ==="]
        
        # Chỉ lấy 5 tin nhắn gần nhất cho vào prompt
        for msg in self.current_context[-5:]: 
            context_parts.append(f"Người dùng: {msg['user']}")
            context_parts.append(f"AI: {msg['ai']}")
            context_parts.append("---")
        
        context_parts.append("=== KẾT THÚC LỊCH SỬ ===")
        return "\n".join(context_parts)

class SmartRAGRetriever:
    """
    Class đơn giản để truy vấn (query) ChromaDB
    (ĐÃ SỬA: Tải model embedding thủ công)
    """
    
    def __init__(self, db_path: str, collection_name: str, model_name: str):
        # 1. Tải model embedding (BẮT BUỘC PHẢI GIỐNG MODEL KHI INGEST)
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Đang tải Embedding Model: {model_name} (sử dụng {device.upper()})")
        self.embedding_model = SentenceTransformer(model_name, device=device)
        print("Tải Model thành công.")

        # 2. Kết nối DB
        print("Đang kết nối tới Vector Database...")
        self.client = chromadb.PersistentClient(path=db_path)
        try:
            # BẮT BUỘC: Phải chỉ định "cosine" giống lúc ingest
            self.collection = self.client.get_collection(
                name=collection_name,
                # metadata={"hnsw:space": "cosine"} # Không cần khi get, chỉ cần khi create
            )
            print(f"Kết nối thành công collection: '{collection_name}'")
        except Exception as e:
            print(f"LỖI: Không tìm thấy collection '{collection_name}' tại '{db_path}'")
            print("Vui lòng chạy file 'ingest.py' trước.")
            raise e
    
    def search(self, query_text: str, n_results: int = 3) -> List[str]:
        """
        Search documents và chỉ trả về nội dung (content)
        (ĐÃ SỬA: Mã hóa query trước khi tìm)
        """
        try:
            # 1. Mã hóa câu hỏi (query) thành vector
            query_vector = self.embedding_model.encode(query_text).tolist()
            
            # 2. Dùng vector để tìm kiếm (thay vì text)
            results = self.collection.query(
                query_embeddings=[query_vector], # Truyền vector
                n_results=n_results
            )
            
            return results['documents'][0] if results['documents'] else []
            
        except Exception as e:
            print(f"Lỗi khi tìm kiếm: {e}")
            return []

class SmartChatbot:
    """
    Chatbot CỐT LÕI: Kết hợp Memory và RAG
    """
    
    def __init__(self):
        self.memory = SmartChatMemory()
        self.retriever = None
        self.gemini_model = None
        self.setup()
    
    def setup(self):
        """Setup chatbot components"""
        print("🧠 Khởi tạo Smart Chatbot...")
        
        # 1. Setup Gemini
        if not GOOGLE_API_KEY:
            raise ValueError("Không tìm thấy GOOGLE_API_KEY. Hãy set nó trong file .env")
        
        genai.configure(api_key=GOOGLE_API_KEY)
        self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        print("   ✅ Model Gemini đã sẵn sàng.")
        
        # 2. Setup RAG retriever (ĐÃ SỬA: Truyền tên model vào)
        if not os.path.exists(INTELLIGENT_DB_PATH):
            raise FileNotFoundError(f"Không tìm thấy thư mục database: {INTELLIGENT_DB_PATH}")
        
        self.retriever = SmartRAGRetriever(
            INTELLIGENT_DB_PATH, 
            INTELLIGENT_COLLECTION,
            EMBEDDING_MODEL_NAME # Truyền tên model vào
        )
        print(f"   ✅ Đã kết nối database: {self.retriever.collection.count()} tài liệu.")
        
        print("🎉 Chatbot sẵn sàng!")
    
    def create_prompt(self, user_question: str, rag_results: List[str]) -> str:
        """
        Tạo prompt hoàn chỉnh từ Lịch sử chat và Dữ liệu RAG
        """
        # Lấy context từ memory
        conversation_context = self.memory.get_context_for_prompt()
        
        # Tạo RAG context (tối ưu hóa)
        rag_context = ""
        if rag_results:
            rag_context = "### Thông tin từ cơ sở kiến thức:\n"
            for i, content in enumerate(rag_results, 1):
                # Giới hạn độ dài nội dung để tránh prompt quá dài
                truncated_content = content[:500] + "..." if len(content) > 500 else content
                rag_context += f"{i}. {truncated_content}\n"
        
        # Tạo prompt tối ưu hóa - ngắn gọn và hiệu quả
        prompt = f"""Bạn là chuyên gia tư vấn IT Career với khả năng trả lời chính xác, ngắn gọn và có cấu trúc.

{conversation_context}

{rag_context}

**Câu hỏi:** {user_question}

**Yêu cầu trả lời:**
- Trả lời NGẮN GỌN, TẬP TRUNG vào vấn đề chính
- Chỉ cung cấp thông tin TRỰC TIẾP LIÊN QUAN đến câu hỏi
- Sử dụng Markdown để định dạng:
  • Tiêu đề: ## hoặc ###
  • Danh sách: - hoặc số
  • Nhấn mạnh: **text**
  • Code: ```code```
- Cấu trúc câu trả lời:
  1. Câu trả lời trực tiếp (1-2 câu)
  2. Chi tiết quan trọng (dạng danh sách, tối đa 3-5 điểm)
  3. Lời khuyên/bước tiếp theo (nếu cần, 1-2 câu)
- TRÁNH: Lặp lại câu hỏi, dài dòng, thông tin không liên quan
- Nếu không có thông tin: Nói thẳng và đề xuất hướng tìm hiểu

Trả lời:"""
        return prompt
    
    def get_response(self, user_question: str) -> str:
        """
        Lấy response từ chatbot (Tìm kiếm -> Tạo prompt -> Gọi AI -> Lưu memory)
        """
        try:
            # 1. Search RAG database (Tìm 3 tài liệu liên quan nhất)
            rag_results = self.retriever.search(user_question, n_results=3)
            
            # 2. Create context-aware prompt
            prompt = self.create_prompt(user_question, rag_results)
            
            # 3. Get AI response
            response = self.gemini_model.generate_content(prompt)
            ai_answer = response.text
            
            # 4. Save to memory
            self.memory.add_message(user_question, ai_answer)
            
            return ai_answer
            
        except Exception as e:
            error_msg = f"Xin lỗi, có lỗi xảy ra khi xử lý: {str(e)}"
            self.memory.add_message(user_question, error_msg)
            return error_msg
    
    def process_command(self, command: str) -> str:
        """Xử lý các lệnh đặc biệt (Chỉ giữ lại lệnh cơ bản)"""
        
        if command == "/new":
            session_id = self.memory.start_new_session()
            return f"🆕 Bắt đầu cuộc trò chuyện mới: {session_id}"
        
        elif command == "/help":
            return """
🤖 Smart Chatbot Commands:
  /new   - Bắt đầu cuộc trò chuyện mới
  /help  - Hiện hướng dẫn này
  quit   - Thoát
"""
        
        return f"❓ Lệnh không hợp lệ: {command}. Gõ /help để xem các lệnh."

def main():
    """Main chat loop (Đã tinh gọn)"""
    print("=" * 50)
    print("🧠 CHATBOT KSA (có Memory + RAG)")
    print("Gõ /help để xem lệnh, 'quit' để thoát")
    
    try:
        # 1. Khởi tạo chatbot
        chatbot = SmartChatbot()
        
        # 2. Bắt đầu session mới
        session_id = chatbot.memory.start_new_session()
        print(f"\n💬 Bắt đầu cuộc tròGõ: {session_id}")
        
        # 3. Vòng lặp chat
        while True:
            try:
                user_input = input("\n🤔 Bạn: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Tạm biệt! Cuộc trò chuyện đã được lưu.")
                    break
                
                if not user_input:
                    continue
                
                # Xử lý lệnh
                if user_input.startswith('/'):
                    result = chatbot.process_command(user_input)
                    print(f"🤖 System: {result}")
                    continue
                
                # Lấy câu trả lời
                print("🤖 Bot đang suy nghĩ...")
                response = chatbot.get_response(user_input)
                print(f"🤖 Bot: {response}")
                
            except KeyboardInterrupt:
                print("\n👋 Tạm biệt!")
                break
            except Exception as e:
                print(f"❌ Lỗi trong vòng lặp: {e}")
    
    except Exception as e:
        print(f"❌ LỖI KHỞI TẠO: {e}")

if __name__ == "__main__":
    main()