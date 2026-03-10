# JARVIS Interface — Iron Man HUD

A futuristic Iron Man-style web interface powered by Flask + vanilla JS.

## Run locally

```bash
# 1. Install Flask
pip install flask

# 2. Start the server
python app.py

# 3. Open in browser
http://localhost:5000
```

## Structure
```
ironman/
├── app.py                  ← Flask server + API endpoints
├── requirements.txt
├── templates/
│   └── index.html          ← Full HUD layout
└── static/
    ├── css/style.css        ← All animations & styles
    └── js/script.js         ← Particles, radar, console, boot
```

## API Endpoints
- `GET /api/status`  → live system message + metrics
- `GET /api/alert`   → random alert (INFO/WARN/CRITICAL)
- `GET /api/boot`    → boot message array
