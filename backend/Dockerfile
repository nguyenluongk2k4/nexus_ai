# 1. Base image
FROM python:3.11-slim AS runtime

# 2. Prevent Python from writing .pyc & flush stdout immediately
ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_NO_CACHE_DIR=1 \
	PORT=8000

# Allow overriding application directory when build context is not repository root
ARG APP_DIR=backend

# 3. App working directory
WORKDIR /app

# 4. System dependencies for torch/sentence-transformers
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential libglib2.0-0 libsm6 libxext6 libxrender-dev git \
	&& rm -rf /var/lib/apt/lists/*

# 5. Install requirements first for better build caching
COPY ${APP_DIR}/requirements.txt ./requirements.txt
RUN pip install --upgrade pip \
	&& pip install -r requirements.txt

# 6. Copy application source
COPY ${APP_DIR}/ .

# 7. Ensure default data directories exist (overridden by Railway volume if provided)
RUN mkdir -p /app/data/chroma

# 8. Expose service port (Railway overrides PORT env when running)
EXPOSE ${PORT}

# 9. Launch FastAPI via Uvicorn
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "${PORT}"]
