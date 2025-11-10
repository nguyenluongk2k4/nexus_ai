# 1. Base image Python
FROM python:3.10-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy backend code
COPY . .

# 4. Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 5. Expose port
EXPOSE 8000

# 6. Start server
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
