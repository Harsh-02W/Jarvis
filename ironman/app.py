"""
JARVIS Interface — Flask Backend
Real data: IP geolocation, weather, system info + Groq AI
"""
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import random, datetime, math, os, urllib.request, json, platform, psutil

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

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/boot-sequence")
def boot_sequence():
    return jsonify({"messages": BOOT_SEQUENCE, "timestamp": datetime.datetime.now().isoformat(), "system": "JARVIS v7.3.1"})

@app.route("/api/system-status")
def system_status():
    """Real system metrics using psutil"""
    try:
        cpu = psutil.cpu_percent(interval=0.3)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        battery = psutil.sensors_battery()
        net = psutil.net_io_counters()

        battery_pct = round(battery.percent, 1) if battery else 100.0
        battery_charging = battery.power_plugged if battery else True

        return jsonify({
            "arc_reactor": battery_pct,
            "suit_integrity": round(100 - cpu, 1),
            "repulsor_left": round(100 - mem.percent, 1),
            "repulsor_right": round(100 - disk.percent, 1),
            "cpu": cpu,
            "memory_used": round(mem.used / (1024**3), 2),
            "memory_total": round(mem.total / (1024**3), 2),
            "memory_percent": mem.percent,
            "disk_used": round(disk.used / (1024**3), 1),
            "disk_total": round(disk.total / (1024**3), 1),
            "disk_percent": disk.percent,
            "battery": battery_pct,
            "charging": battery_charging,
            "net_sent": round(net.bytes_sent / (1024**2), 1),
            "net_recv": round(net.bytes_recv / (1024**2), 1),
            "altitude": 0,
            "speed": 0,
            "threat_level": "ELEVATED" if cpu > 80 else "MINIMAL",
            "os": platform.system() + " " + platform.release(),
            "hostname": platform.node(),
            "timestamp": datetime.datetime.now().isoformat(),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/location")
def get_location():
    """Real IP-based geolocation using free ip-api.com"""
    try:
        with urllib.request.urlopen("http://ip-api.com/json/", timeout=5) as resp:
            data = json.loads(resp.read().decode())
        return jsonify({
            "lat": data.get("lat", 0),
            "lon": data.get("lon", 0),
            "city": data.get("city", "UNKNOWN"),
            "country": data.get("country", "UNKNOWN"),
            "isp": data.get("isp", "UNKNOWN"),
            "ip": data.get("query", "UNKNOWN"),
            "timezone": data.get("timezone", "UNKNOWN"),
            "status": "TRACKING"
        })
    except Exception as e:
        return jsonify({"lat": 0, "lon": 0, "city": "OFFLINE", "country": "N/A", "ip": "N/A", "status": "ERROR"})

@app.route("/api/weather")
def get_weather():
    """Real weather using open-meteo.com (completely free, no key needed)"""
    try:
        # First get location
        with urllib.request.urlopen("http://ip-api.com/json/", timeout=5) as resp:
            loc = json.loads(resp.read().decode())
        lat = loc.get("lat", 40.7128)
        lon = loc.get("lon", -74.0060)
        city = loc.get("city", "Unknown")

        # Then get weather
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=mph&temperature_unit=celsius"
        with urllib.request.urlopen(url, timeout=5) as resp:
            weather = json.loads(resp.read().decode())

        current = weather.get("current", {})
        temp = current.get("temperature_2m", 0)
        humidity = current.get("relative_humidity_2m", 0)
        wind = current.get("wind_speed_10m", 0)
        code = current.get("weather_code", 0)

        # Weather code to condition
        if code == 0: condition = "CLEAR"
        elif code in [1,2,3]: condition = "PARTLY CLOUDY"
        elif code in [45,48]: condition = "FOGGY"
        elif code in [51,53,55,61,63,65]: condition = "RAIN"
        elif code in [71,73,75]: condition = "SNOW"
        elif code in [80,81,82]: condition = "SHOWERS"
        elif code in [95,96,99]: condition = "THUNDERSTORM"
        else: condition = "UNKNOWN"

        return jsonify({
            "temp": round(temp, 1),
            "humidity": humidity,
            "wind": round(wind, 1),
            "condition": condition,
            "city": city,
            "status": "LIVE"
        })
    except Exception as e:
        return jsonify({"temp": "N/A", "humidity": "N/A", "wind": "N/A", "condition": "OFFLINE", "city": "N/A", "status": "ERROR"})

@app.route("/api/alert")
def get_alert():
    """Generate alerts based on real system data"""
    try:
        cpu = psutil.cpu_percent(interval=0.1)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        battery = psutil.sensors_battery()

        alerts = []
        if cpu > 80:
            alerts.append(("CPU OVERLOAD: {}%".format(round(cpu,1)), "CRITICAL"))
        if mem.percent > 85:
            alerts.append(("MEMORY CRITICAL: {}% USED".format(round(mem.percent,1)), "CRITICAL"))
        if disk.percent > 90:
            alerts.append(("DISK SPACE LOW: {}% USED".format(round(disk.percent,1)), "WARN"))
        if battery and battery.percent < 20 and not battery.power_plugged:
            alerts.append(("BATTERY LOW: {}%".format(round(battery.percent,1)), "CRITICAL"))
        if battery and battery.power_plugged:
            alerts.append(("POWER SUPPLY: CONNECTED", "INFO"))

        # Fallback
        if not alerts:
            fallbacks = [
                ("ALL SYSTEMS NOMINAL", "INFO"),
                ("CPU: {}% | RAM: {}%".format(round(cpu,1), round(mem.percent,1)), "INFO"),
                ("NETWORK: ONLINE", "INFO"),
                ("DISK USAGE: {}%".format(round(disk.percent,1)), "INFO"),
            ]
            alerts.append(random.choice(fallbacks))

        msg, level = random.choice(alerts)
        return jsonify({"message": msg, "level": level, "timestamp": datetime.datetime.now().isoformat()})
    except Exception as e:
        return jsonify({"message": "SYSTEM SCAN COMPLETE", "level": "INFO", "timestamp": datetime.datetime.now().isoformat()})

@app.route("/api/coordinates")
def get_coordinates():
    """Real coordinates from IP"""
    try:
        with urllib.request.urlopen("http://ip-api.com/json/", timeout=5) as resp:
            data = json.loads(resp.read().decode())
        return jsonify({
            "lat": data.get("lat", 0),
            "lon": data.get("lon", 0),
            "location": "{}, {}".format(data.get("city","?"), data.get("country","?")),
            "status": "TRACKING"
        })
    except:
        return jsonify({"lat": 0, "lon": 0, "location": "OFFLINE", "status": "ERROR"})

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