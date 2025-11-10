# 1. Base image
FROM python:3.11

# 2. Working dir inside container
WORKDIR /app

# 3. Copy only backend folder into container
COPY backend/ ./

# 4. Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 5. Expose port (Railway sẽ inject PORT)
EXPOSE 8000

# 6. Start uvicorn
CMD ["uvicorn", "app_server:app", "--host", "0.0.0.0", "--port", "8000"]
