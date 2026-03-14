# ═══════════════════════════════════════════════
#  JARVIS Interface — Dockerfile
#  Python 3.12 slim base
# ═══════════════════════════════════════════════

FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY app.py .

# Copy templates and static from ironman/ subfolder
COPY ironman/templates/ templates/
COPY ironman/static/ static/

EXPOSE 5001

CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "120", "app:app"]