# JARVIS Interface — Iron Man HUD

A futuristic Iron Man-style web interface powered by Flask + Groq AI + real system data.

## Features
- 🤖 **Real AI** — Talk to JARVIS powered by Llama 3.3 70B via Groq
- 📊 **Real System Metrics** — Live CPU, RAM, disk, battery via psutil
- 🌍 **Real Location** — IP-based geolocation via ip-api.com
- 🌤️ **Real Weather** — Live weather via open-meteo.com (no API key needed)
- ⚡ **Smart Alerts** — Based on actual CPU/RAM/disk thresholds
- 🎯 **HUD Interface** — Particles, radar, boot sequence, animated panels

## Run Locally

```bash
# 1. Install dependencies
pip install flask python-dotenv groq psutil --break-system-packages

# 2. Create .env file with your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env

# 3. Start the server
python3 app.py

# 4. Open in browser
http://localhost:5001
```

## Get a Free Groq API Key
1. Go to https://console.groq.com
2. Sign up (free, no credit card)
3. Create an API key
4. Paste it in your `.env` file

## Deploy on EC2

```bash
# Copy project to EC2
scp -i your-key.pem -r ~/ironman ubuntu@your-ec2-ip:~/ironman

# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt install python3-flask -y
pip install python-dotenv groq psutil --break-system-packages

# Create .env on EC2
echo "GROQ_API_KEY=your_key_here" > ~/ironman/.env

# Run
cd ~/ironman && python3 app.py

# Keep running after SSH disconnect
screen -S jarvis
python3 app.py
# Ctrl+A then D to detach
```

Then open port 5001 in your EC2 Security Group (Inbound Rules → Custom TCP → 5001 → 0.0.0.0/0).

Access at: `http://your-ec2-public-ip:5001`

## Project Structure

```
ironman/
├── app.py                  ← Flask server + Groq AI + real data APIs
├── requirements.txt
├── .env                    ← API keys (never commit this)
├── templates/
│   └── index.html          ← Full HUD layout
└── static/
    ├── css/style.css        ← All animations & styles
    └── js/script.js         ← Particles, radar, AI console, boot
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/boot-sequence` | GET | Boot messages array |
| `GET /api/system-status` | GET | Real CPU, RAM, disk, battery |
| `GET /api/alert` | GET | Smart alerts based on real metrics |
| `GET /api/location` | GET | Real IP geolocation |
| `GET /api/weather` | GET | Live weather for your location |
| `GET /api/coordinates` | GET | Real lat/lon coordinates |
| `POST /api/jarvis-chat` | POST | Talk to JARVIS AI |
| `POST /api/clear-chat` | POST | Clear conversation memory |

## Terminal Commands

| Command | Description |
|---------|-------------|
| `status` | Real system diagnostics (CPU, RAM, disk, battery) |
| `weather` | Live weather for your current location |
| `location` | Your real IP, city, country, timezone |
| `help` | Show all commands |
| `clear` | Clear terminal |
| `reset` | Clear JARVIS conversation memory |
| `boot` | Replay boot sequence |
| *anything else* | Ask JARVIS AI directly |

## Tech Stack
- **Backend** — Python / Flask
- **AI** — Groq API (Llama 3.3 70B) — free tier
- **System Metrics** — psutil
- **Geolocation** — ip-api.com (free, no key)
- **Weather** — open-meteo.com (free, no key)
- **Frontend** — Vanilla JS, HTML5 Canvas, CSS animations

## Important Notes
- Never commit your `.env` file — it contains your API key
- The `.env` file is already in `.gitignore`
- Groq free tier allows 14,400 requests/day
- Weather and location use completely free APIs with no key required