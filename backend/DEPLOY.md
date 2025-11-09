# Hướng dẫn Deploy lên Render.com

## 📋 Yêu cầu trước khi Deploy

1. **Tài khoản Render.com**
   - Đăng ký tại: https://render.com
   - Liên kết với GitHub account

2. **Google API Key**
   - Lấy API key từ: https://makersuite.google.com/app/apikey
   - Hoặc từ Google Cloud Console

3. **ChromaDB Vector Database**
   - Cần chạy ingest script để tạo database trước
   - Upload folder `chroma/` lên repository hoặc sử dụng Render Disk

## 🚀 Các bước Deploy

### Bước 1: Chuẩn bị Repository

1. **Commit code lên GitHub:**
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. **Đảm bảo các file sau tồn tại trong folder `backend/`:**
   - ✅ `requirements.txt` - Dependencies
   - ✅ `render.yaml` - Render configuration
   - ✅ `runtime.txt` - Python version
   - ✅ `Procfile` - Start command (optional)
   - ✅ `.env.example` - Environment variables template
   - ✅ `.gitignore` - Ignore sensitive files

### Bước 2: Tạo Web Service trên Render

1. **Đăng nhập vào Render Dashboard**
   - Truy cập: https://dashboard.render.com

2. **Tạo New Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Chọn repository GitHub của bạn
   - Hoặc sử dụng **"Blueprint"** và chọn `render.yaml`

3. **Cấu hình Service:**
   - **Name:** `nexus-ai-backend` (hoặc tên tùy chọn)
   - **Region:** Singapore (hoặc gần nhất)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.server:app --host 0.0.0.0 --port $PORT`

4. **Instance Type:**
   - **Free Tier:** Đủ cho testing (512MB RAM, sleep sau 15 phút không hoạt động)
   - **Starter:** $7/month (Recommended cho production)

### Bước 3: Cấu hình Environment Variables

Trong phần **Environment** của Render Dashboard, thêm các biến sau:

```env
GOOGLE_API_KEY=your_actual_google_api_key_here
HOST=0.0.0.0
CORS_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:3000
INTELLIGENT_DB_PATH=./chroma
INTELLIGENT_COLLECTION=ksa_project
CHAT_SESSIONS_FILE=smart_chat_sessions.json
MAX_CONTEXT_MESSAGES=10
```

**⚠️ Lưu ý quan trọng:**
- `GOOGLE_API_KEY`: Phải điền API key thật
- `CORS_ORIGINS`: Thêm URL frontend của bạn (phân cách bằng dấu phẩy)
- `PORT`: Render tự động set, không cần khai báo

### Bước 4: Xử lý ChromaDB (Vector Database)

**Option 1: Sử dụng Render Disk (Recommended)**

1. Trong Render Dashboard, vào **"Disks"** tab
2. Tạo **New Disk:**
   - Name: `chroma-storage`
   - Mount Path: `/app/chroma`
   - Size: 1GB (Free)

3. Upload database:
```bash
# Compress local chroma folder
tar -czf chroma.tar.gz chroma/

# Upload to Render (sau khi disk được mount)
# Sử dụng SCP hoặc upload qua Render Shell
```

**Option 2: Embed trong Repository (Nếu nhỏ < 100MB)**

1. Remove `chroma/` từ `.gitignore`
2. Commit database:
```bash
git add chroma/
git commit -m "Add ChromaDB database"
git push
```

**Option 3: Recreate Database khi Deploy (Nếu có raw data)**

1. Thêm script `ingest.py` vào repository
2. Sửa Build Command:
```bash
pip install -r requirements.txt && python ingest.py
```

### Bước 5: Deploy

1. Click **"Create Web Service"**
2. Render sẽ tự động:
   - Clone repository
   - Chạy build command
   - Start service
   - Cấp URL: `https://your-service.onrender.com`

3. Kiểm tra logs:
   - Vào tab **"Logs"** để xem quá trình deploy
   - Chờ đến khi thấy: `Application startup complete`

### Bước 6: Test API

```bash
# Health check
curl https://your-service.onrender.com/health

# Tạo session mới
curl -X POST https://your-service.onrender.com/session/new

# Test WebSocket (sử dụng tool như wscat)
wscat -c wss://your-service.onrender.com/ws
```

## 🔧 Cấu hình Frontend để kết nối Backend

Cập nhật URL backend trong frontend:

```typescript
// frontend/src/config.ts (hoặc file tương tự)
const API_URL = import.meta.env.PROD 
  ? 'https://your-backend.onrender.com'
  : 'http://localhost:8000';

const WS_URL = import.meta.env.PROD
  ? 'wss://your-backend.onrender.com/ws'
  : 'ws://localhost:8000/ws';

export { API_URL, WS_URL };
```

## ⚡ Tối ưu hóa

### 1. Giữ Service luôn chạy (Free Tier)

Free tier sleep sau 15 phút. Sử dụng cron job để ping:

```bash
# Sử dụng cron-job.org hoặc UptimeRobot
# Ping mỗi 10 phút:
curl https://your-service.onrender.com/health
```

### 2. Tăng Performance

- Upgrade lên **Starter plan** ($7/month)
- Tăng RAM nếu model lớn
- Sử dụng Redis cho session management

### 3. Enable Auto-Deploy

Trong Render Settings:
- Enable **"Auto-Deploy"**
- Mỗi khi push code, Render tự động deploy

## 🐛 Troubleshooting

### Lỗi: "Application failed to respond"

**Nguyên nhân:** Port không đúng

**Giải pháp:**
```python
# Đảm bảo sử dụng $PORT từ Render
port = int(os.environ.get("PORT", 8000))
uvicorn.run("app.server:app", host="0.0.0.0", port=port)
```

### Lỗi: "Module not found"

**Nguyên nhân:** Dependencies thiếu

**Giải pháp:**
```bash
# Cập nhật requirements.txt
pip freeze > requirements.txt
```

### Lỗi: "ChromaDB not found"

**Nguyên nhân:** Database chưa được upload

**Giải pháp:** 
- Sử dụng một trong 3 options ở Bước 4

### Lỗi: "CORS policy"

**Nguyên nhân:** Frontend URL chưa được thêm vào CORS_ORIGINS

**Giải pháp:**
```env
CORS_ORIGINS=https://your-frontend.com,https://your-frontend.onrender.com
```

## 📊 Monitoring

1. **Logs:** Xem real-time logs trong Render Dashboard
2. **Metrics:** CPU, Memory, Request count
3. **Alerts:** Setup email alerts cho downtime

## 💰 Chi phí

- **Free Tier:**
  - 750 giờ/tháng
  - 512MB RAM
  - Sleep sau 15 phút inactive
  - 100GB bandwidth/tháng

- **Starter:**
  - $7/tháng
  - 512MB RAM
  - Luôn chạy
  - Không giới hạn bandwidth

## 🔗 Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [ChromaDB Documentation](https://docs.trychroma.com/)

## ✅ Checklist Deploy

- [ ] Code đã được push lên GitHub
- [ ] File `render.yaml` đã được tạo
- [ ] File `.env.example` đã có đầy đủ biến
- [ ] `requirements.txt` đã đầy đủ dependencies
- [ ] Google API Key đã được tạo
- [ ] ChromaDB database đã sẵn sàng
- [ ] Render service đã được tạo
- [ ] Environment variables đã được config
- [ ] CORS origins đã bao gồm frontend URL
- [ ] API đã được test (health check)
- [ ] WebSocket đã được test
- [ ] Frontend đã được cập nhật backend URL

---

**🎉 Chúc bạn deploy thành công!**

Nếu gặp vấn đề, kiểm tra logs trong Render Dashboard hoặc liên hệ support.
