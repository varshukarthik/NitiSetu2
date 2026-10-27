# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend runtime
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (for PDF parsing and OCR)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    tesseract-ocr \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend /app/backend

# Copy built frontend assets to static distribution folder
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose FastAPI port
EXPOSE 8000

ENV PYTHONPATH=/app/backend
ENV NIDHISETU_ENVIRONMENT=demo
ENV NIDHISETU_STORAGE_BACKEND=filesystem

# Start Uvicorn server
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
