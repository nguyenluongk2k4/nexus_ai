# Hướng dẫn Deploy Backend

Tài liệu này mô tả hai phương án triển khai backend FastAPI của Nexus AI. Railway hiện là lựa chọn khuyến nghị vì quá trình build nhanh, có volume persist và tích hợp tốt với monorepo. Phần hướng dẫn Render.com được giữ lại ở cuối như tài liệu tham khảo.

## 🚀 Deploy lên Railway (Khuyến nghị)

### 1. Chuẩn bị trước

- Tài khoản Railway: https://railway.app
- Repository đã push lên GitHub (nhánh `main` hoặc nhánh bạn muốn deploy)
- Google API Key hợp lệ (`GOOGLE_API_KEY` hoặc `GEMINI_API_KEY`)
- (Tùy chọn) Cài Railway CLI: `npm i -g @railway/cli`

**Các file quan trọng**

- `railway.json` (ở repo root) – mô tả build/start command cho backend
- `backend/requirements.txt`
- `backend/Procfile`
- `backend/.env.example`
- `backend/runtime.txt`
- `backend/Dockerfile` (Railway sẽ ưu tiên Dockerfile nếu có)

### 2. Cấu hình project Railway

1. **Tạo project/service**
   - Vào Dashboard → `New Project`
   - Chọn **Deploy from GitHub repo**, liên kết repository `nexus_ai`
   - Railway sẽ tự phát hiện `railway.json` và cấu hình service `backend`

2. **Xác nhận build/start command**
   - Build: `pip install --upgrade pip && pip install -r requirements.txt`
   - Start: `uvicorn app.server:app --host 0.0.0.0 --port $PORT`
   - Healthcheck: `/health`

### 3. Environment variables

Thêm các biến trong tab **Variables** (UI) hoặc dùng CLI `railway variables set`:

```env
GOOGLE_API_KEY=<bắt buộc>
HOST=0.0.0.0
CORS_ORIGINS=https://your-frontend.app,https://your-frontend-on-railway.app
INTELLIGENT_COLLECTION=ksa_project
MAX_CONTEXT_MESSAGES=10
```

**Gợi ý cho Chroma & sessions:**

- Tạo volume mới (Size ≥ 1GB) và mount tại `/mnt/data`
- Railway tự cấp biến `RAILWAY_VOLUME_MOUNT_PATH`, backend sẽ tự động lưu
  - Vector DB: `<volume>/data/chroma`
  - Sessions: `<volume>/data/smart_chat_sessions.json`
- Nếu muốn tùy biến, set thêm:

```env
INTELLIGENT_DB_PATH=${RAILWAY_VOLUME_MOUNT_PATH}/data/chroma
CHAT_SESSIONS_FILE=${RAILWAY_VOLUME_MOUNT_PATH}/data/smart_chat_sessions.json
```

### 4. Deploy

- **Qua UI:** Bấm `Deploy` → Chọn branch/thời điểm build → Đợi log báo `Application startup complete`
- **Qua CLI:**

```bash
railway login
railway link --environment production
railway up --service backend
```

### 5. Kiểm tra

```powershell
curl https://<railway-domain>/health
curl -X POST https://<railway-domain>/session/new
# WebSocket: wscat -c wss://<railway-domain>/ws
```

### 6. Cập nhật frontend

- Đặt biến môi trường/ cấu hình frontend để trỏ tới URL Railway
- Ví dụ (Vite): `VITE_API_URL=https://<railway-domain>` và `VITE_WS_URL=wss://<railway-domain>/ws`

### 7. Checklist Railway

- [ ] Code đã push lên GitHub
- [ ] `railway.json` có trong repo root
- [ ] Volume Railway tạo & mount thành công
- [ ] GOOGLE_API_KEY thiết lập trong Variables
- [ ] CORS_ORIGINS chứa domain frontend production
- [ ] Deploy thành công (log báo `Application startup complete`)
- [ ] Healthcheck & WebSocket test pass

**Troubleshooting**

- `chromadb` lỗi path: kiểm tra volume mount và giá trị `INTELLIGENT_DB_PATH`
- Import lỗi: chạy `pip freeze > backend/requirements.txt` rồi redeploy
- CORS: xác nhận domain nằm trong `CORS_ORIGINS` (cách nhau bởi dấu phẩy, không khoảng trắng)

---

## 📦 Deploy lên Render.com (Tham khảo)

Hướng dẫn gốc được rút gọn, giữ lại cho team đang dùng Render.

1. **Chuẩn bị**
   - File cần thiết trong `backend/`: `render.yaml`, `requirements.txt`, `Procfile`, `.env.example`, `runtime.txt`
   - Push code lên GitHub

2. **Tạo service**
   - Dashboard Render → `New +` → `Web Service`
   - Chọn repo và branch
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.server:app --host 0.0.0.0 --port $PORT`

3. **Environment**

```env
GOOGLE_API_KEY=<key>
HOST=0.0.0.0
CORS_ORIGINS=https://frontend.onrender.com,http://localhost:3000
INTELLIGENT_DB_PATH=./chroma
INTELLIGENT_COLLECTION=ksa_project
CHAT_SESSIONS_FILE=smart_chat_sessions.json
MAX_CONTEXT_MESSAGES=10
```

4. **ChromaDB**
   - Dùng Render Disk (mount `/app/chroma`) hoặc commit data/ingest lại

5. **Kiểm tra**

```powershell
curl https://<render-domain>/health
```

6. **Checklist Render**

- [ ] Service tạo thành công
- [ ] Disk mount hoặc data đã commit
- [ ] Env vars đúng
- [ ] Auto Deploy bật (nếu cần)
- [ ] Healthcheck pass

---

**🎉 Chúc bạn deploy thành công!** Nếu gặp lỗi, xem log trên Railway/Render và kiểm tra lại env vars.
