# Railway-compatible Docker image for FastAPI backend
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install system deps required by torch / sentence-transformers
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libglib2.0-0 libsm6 libxext6 libxrender-dev git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . .

# Ensure default data directories exist for volume mounts
RUN mkdir -p /app/data/chroma

EXPOSE ${PORT}

CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "${PORT}"]
