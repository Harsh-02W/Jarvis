"""
JARVIS Interface — Flask Backend
Groq LLM integration for real AI responses
"""
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import random, datetime, math, os

load_dotenv()

from groq import Groq

app = Flask(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

conversation_history = []

JARVIS_SYSTEM_PROMPT = """You are JARVIS (Just A Rather Very Intelligent System), Tony Stark's highly advanced AI assistant.

Your personality:
- Speak in a precise, calm, slightly formal British-influenced tone
- Be highly intelligent, analytical and efficient
- Occasionally show dry wit and subtle sarcasm like the real JARVIS
- Address the user as "Sir" or "Ma'am"
- Keep responses concise but informative
- Use technical language naturally
- Sometimes reference suit systems, arc reactor, or Stark Industries naturally
- Never break character

Examples of your style:
- "Certainly, Sir. Shall I proceed with the analysis?"
- "I've completed the scan. Results are... concerning."
- "If I may say so, Sir, that plan has a 94.7% chance of failure."
"""

BOOT_SEQUENCE = [
    "JARVIS ONLINE. INITIALIZING SUBSYSTEMS...",
    "ARC REACTOR OUTPUT: 3.00 GIGAJOULES",
    "SCANNING ENVIRONMENT... THREAT LEVEL: MINIMAL",
    "NEURAL INTERFACE CALIBRATED",
    "WEAPON SYSTEMS: STANDBY",
    "SATELLITE UPLINK: ESTABLISHED",
    "BIOMETRIC SCAN COMPLETE — STARK, TONY",
    "ALL SYSTEMS NOMINAL. READY FOR DEPLOYMENT.",
]

SYSTEM_ALERTS = [
    "ENERGY SIGNATURE DETECTED — SECTOR 7G",
    "SUIT INTEGRITY: 98.7%",
    "REPULSOR CHARGE: OPTIMAL",
    "TARGETING SYSTEM LOCKED",
    "ALTITUDE CEILING: UNLIMITED",
    "COMM FREQUENCY ENCRYPTED",
    "STEALTH MODE: AVAILABLE",
    "HEAT SIGNATURE MASKED",
    "PROXIMITY ALERT CLEARED",
    "POWER CELL RECHARGING...",
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/boot-sequence")
def boot_sequence():
    return jsonify({"messages": BOOT_SEQUENCE, "timestamp": datetime.datetime.now().isoformat(), "system": "JARVIS v7.3.1"})

@app.route("/api/system-status")
def system_status():
    return jsonify({
        "arc_reactor": round(random.uniform(97.2, 100.0), 1),
        "suit_integrity": round(random.uniform(94.0, 99.9), 1),
        "repulsor_left": round(random.uniform(88.0, 100.0), 1),
        "repulsor_right": round(random.uniform(88.0, 100.0), 1),
        "altitude": random.randint(0, 42000),
        "speed": random.randint(0, 1842),
        "threat_level": random.choice(["MINIMAL", "MINIMAL", "MINIMAL", "ELEVATED", "LOW"]),
        "timestamp": datetime.datetime.now().isoformat(),
    })

@app.route("/api/alert")
def get_alert():
    return jsonify({"message": random.choice(SYSTEM_ALERTS), "level": random.choice(["INFO", "INFO", "WARN", "CRITICAL"]), "timestamp": datetime.datetime.now().isoformat()})

@app.route("/api/coordinates")
def get_coordinates():
    t = datetime.datetime.now().timestamp()
    lat = 40.7128 + math.sin(t * 0.001) * 0.05
    lon = -74.0060 + math.cos(t * 0.001) * 0.05
    return jsonify({"lat": round(lat, 6), "lon": round(lon, 6), "location": "NEW YORK CITY — STARK TOWER", "status": "TRACKING"})

@app.route("/api/jarvis-chat", methods=["POST"])
def jarvis_chat():
    global conversation_history
    try:
        user_message = request.json.get("message", "").strip()
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        conversation_history.append({"role": "user", "content": user_message})

        if len(conversation_history) > 20:
            conversation_history = conversation_history[-20:]

        messages = [{"role": "system", "content": JARVIS_SYSTEM_PROMPT}] + conversation_history

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=300,
            temperature=0.7,
        )

        reply = response.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": reply})

        return jsonify({"reply": reply, "timestamp": datetime.datetime.now().isoformat(), "model": "llama-3.3-70b-versatile"})

    except Exception as e:
        return jsonify({"reply": f"SYSTEM ERROR: {str(e)}", "error": True}), 500

@app.route("/api/clear-chat", methods=["POST"])
def clear_chat():
    global conversation_history
    conversation_history = []
    return jsonify({"status": "Conversation memory cleared."})

if __name__ == "__main__":
    print("\n  JARVIS Interface running at http://localhost:5001\n")
    app.run(debug=True, host='0.0.0.0', port=5001)