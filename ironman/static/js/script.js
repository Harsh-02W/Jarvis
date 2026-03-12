/* ═══════════════════════════════════════════════════
   JARVIS INTERFACE — JavaScript
   Real data: system metrics, weather, IP location
═══════════════════════════════════════════════════ */
'use strict';

// ── PARTICLE SYSTEM ─────────────────────────────────
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [], energyLines = [];

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.2 + 0.3, alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.7 ? '#00cfff' : '#cc2222',
    });
  }
  energyLines = [];
  for (let i = 0; i < 6; i++) {
    energyLines.push({
      x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height,
      angle: Math.random() * Math.PI * 2, speed: Math.random() * 0.5 + 0.2,
      length: Math.random() * 150 + 50, alpha: Math.random() * 0.3 + 0.05,
      color: Math.random() > 0.5 ? '#cc2222' : '#005577',
    });
  }
}

function drawGrid() {
  const gSize = 60;
  bgCtx.strokeStyle = 'rgba(80,5,5,0.07)';
  bgCtx.lineWidth = 0.5;
  for (let x = 0; x < bgCanvas.width; x += gSize) {
    bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, bgCanvas.height); bgCtx.stroke();
  }
  for (let y = 0; y < bgCanvas.height; y += gSize) {
    bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(bgCanvas.width, y); bgCtx.stroke();
  }
}

function animateParticles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgCtx.fillStyle = '#000000';
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
  const vg = bgCtx.createRadialGradient(bgCanvas.width/2, bgCanvas.height/2, bgCanvas.height*0.2, bgCanvas.width/2, bgCanvas.height/2, bgCanvas.height);
  vg.addColorStop(0, 'transparent'); vg.addColorStop(1, 'rgba(0,0,0,0.7)');
  bgCtx.fillStyle = vg; bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
  drawGrid();
  energyLines.forEach(l => {
    bgCtx.save(); bgCtx.globalAlpha = l.alpha; bgCtx.strokeStyle = l.color; bgCtx.lineWidth = 0.8;
    bgCtx.beginPath(); bgCtx.moveTo(l.x, l.y);
    bgCtx.lineTo(l.x + Math.cos(l.angle)*l.length, l.y + Math.sin(l.angle)*l.length);
    bgCtx.stroke(); bgCtx.restore();
    l.x += Math.cos(l.angle)*l.speed; l.y += Math.sin(l.angle)*l.speed; l.angle += 0.005;
    if (l.x < -200 || l.x > bgCanvas.width+200 || l.y < -200 || l.y > bgCanvas.height+200) {
      l.x = Math.random()*bgCanvas.width; l.y = Math.random()*bgCanvas.height;
    }
  });
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = bgCanvas.width; if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height; if (p.y > bgCanvas.height) p.y = 0;
    bgCtx.beginPath(); bgCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    bgCtx.fillStyle = p.color; bgCtx.globalAlpha = p.alpha; bgCtx.fill(); bgCtx.globalAlpha = 1;
    for (let j = i+1; j < particles.length; j++) {
      const o = particles[j], dx = p.x-o.x, dy = p.y-o.y, dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 80) {
        bgCtx.beginPath(); bgCtx.moveTo(p.x,p.y); bgCtx.lineTo(o.x,o.y);
        bgCtx.strokeStyle = p.color; bgCtx.globalAlpha = (1-dist/80)*0.12;
        bgCtx.lineWidth = 0.5; bgCtx.stroke(); bgCtx.globalAlpha = 1;
      }
    }
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
resizeCanvas(); createParticles(); animateParticles();

// ── RADAR ───────────────────────────────────────────
const radarCanvas = document.getElementById('radar-canvas');
const radarCtx = radarCanvas.getContext('2d');
let radarAngle = 0, radarBlips = [];
for (let i = 0; i < 5; i++) {
  const angle = Math.random()*Math.PI*2, dist = Math.random()*75+15;
  radarBlips.push({ x: 100+Math.cos(angle)*dist, y: 100+Math.sin(angle)*dist, age: Math.random()*100, size: Math.random()*2+1.5 });
}

function drawRadar() {
  const cx=100,cy=100,r=90;
  radarCtx.clearRect(0,0,200,200);
  radarCtx.fillStyle='rgba(5,0,0,0.95)'; radarCtx.fillRect(0,0,200,200);
  for (let i=1;i<=3;i++) {
    radarCtx.beginPath(); radarCtx.arc(cx,cy,r*i/3,0,Math.PI*2);
    radarCtx.strokeStyle='rgba(180,20,20,0.25)'; radarCtx.lineWidth=0.8; radarCtx.stroke();
  }
  radarCtx.strokeStyle='rgba(180,20,20,0.2)'; radarCtx.lineWidth=0.5;
  radarCtx.beginPath(); radarCtx.moveTo(10,cy); radarCtx.lineTo(190,cy); radarCtx.stroke();
  radarCtx.beginPath(); radarCtx.moveTo(cx,10); radarCtx.lineTo(cx,190); radarCtx.stroke();
  radarCtx.save(); radarCtx.translate(cx,cy); radarCtx.rotate(radarAngle);
  const grad=radarCtx.createLinearGradient(0,0,r,0);
  grad.addColorStop(0,'rgba(200,20,20,0.5)'); grad.addColorStop(1,'transparent');
  radarCtx.beginPath(); radarCtx.moveTo(0,0); radarCtx.arc(0,0,r,0,1.2);
  radarCtx.fillStyle=grad; radarCtx.fill(); radarCtx.restore();
  radarCtx.save(); radarCtx.translate(cx,cy); radarCtx.rotate(radarAngle);
  radarCtx.beginPath(); radarCtx.moveTo(0,0); radarCtx.lineTo(r,0);
  radarCtx.strokeStyle='rgba(255,50,50,0.9)'; radarCtx.lineWidth=1.5; radarCtx.stroke(); radarCtx.restore();
  radarBlips.forEach(b => {
    b.age++;
    if (b.age>200) { b.age=0; const a=Math.random()*Math.PI*2,d=Math.random()*75+15; b.x=cx+Math.cos(a)*d; b.y=cy+Math.sin(a)*d; }
    const fade=Math.min(1,(200-b.age)/60);
    radarCtx.beginPath(); radarCtx.arc(b.x,b.y,b.size,0,Math.PI*2);
    radarCtx.fillStyle=`rgba(255,100,0,${fade*0.9})`; radarCtx.fill();
    if (b.age<20) {
      radarCtx.beginPath(); radarCtx.arc(b.x,b.y,b.size+b.age*0.5,0,Math.PI*2);
      radarCtx.strokeStyle=`rgba(255,100,0,${(1-b.age/20)*0.5})`; radarCtx.lineWidth=0.8; radarCtx.stroke();
    }
  });
  radarCtx.beginPath(); radarCtx.arc(cx,cy,r,0,Math.PI*2);
  radarCtx.strokeStyle='rgba(180,20,20,0.5)'; radarCtx.lineWidth=1.5; radarCtx.stroke();
  radarAngle+=0.025;
  requestAnimationFrame(drawRadar);
}
drawRadar();

// ── BOOT SEQUENCE ───────────────────────────────────
async function runBoot() {
  let data;
  try {
    const resp = await fetch('/api/boot-sequence');
    data = await resp.json();
  } catch {
    data = { messages: ["JARVIS ONLINE.", "ARC REACTOR: ONLINE", "ALL SYSTEMS NOMINAL."] };
  }
  const logEl = document.getElementById('boot-log');
  const barEl = document.getElementById('boot-bar');
  const msgs = data.messages;
  for (let i = 0; i < msgs.length; i++) {
    await sleep(300 + Math.random()*200);
    const line = document.createElement('div');
    line.textContent = '> ' + msgs[i];
    logEl.appendChild(line); logEl.scrollTop = logEl.scrollHeight;
    barEl.style.width = ((i+1)/msgs.length*100) + '%';
  }
  await sleep(600);
  document.getElementById('boot-overlay').classList.add('fade-out');
  await sleep(800);
  document.getElementById('boot-overlay').style.display = 'none';
  document.getElementById('main-nav').classList.add('visible');
  showSection('home');
  startLiveUpdates();
}

// ── SECTION NAVIGATION ──────────────────────────────
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => { s.style.display='none'; s.classList.remove('active','visible'); });
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById(name);
  if (!target) return;
  target.style.display = 'flex'; target.classList.add('active');
  setTimeout(() => target.classList.add('visible'), 10);
  const link = document.querySelector(`.nav-link[data-section="${name}"]`);
  if (link) link.classList.add('active');
}
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); showSection(link.dataset.section); });
});

// ── CLOCK ───────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const dd = String(now.getDate()).padStart(2,'0');
  const mo = String(now.getMonth()+1).padStart(2,'0');
  const yy = now.getFullYear();
  const clk = document.getElementById('clock-display');
  const dat = document.getElementById('date-display');
  if (clk) clk.textContent = `${hh}:${mm}:${ss}`;
  if (dat) dat.textContent = `${dd}/${mo}/${yy}`;
}
setInterval(updateClock, 1000); updateClock();

// ── LIVE DATA POLLING ───────────────────────────────
function startLiveUpdates() {
  pollStatus();
  pollAlert();
  pollLocation();
  pollWeather();
  setInterval(pollStatus, 3000);
  setInterval(pollAlert, 8000);   // less frequent — no terminal spam
  setInterval(pollLocation, 30000);
  setInterval(pollWeather, 60000);
}

async function pollStatus() {
  try {
    const resp = await fetch('/api/system-status');
    const d = await resp.json();

    // Arc reactor = battery
    const arcLabel = d.charging ? `${d.battery}% ⚡` : `${d.battery}%`;
    setText('hp-arc', arcLabel);
    setText('hp-suit', `CPU: ${d.cpu}%`);
    setText('hp-alt', `RAM: ${d.memory_percent}%`);
    setText('hp-vel', `DISK: ${d.disk_percent}%`);
    setText('rep-l-val', `${d.repulsor_left}%`);
    setText('rep-r-val', `${d.repulsor_right}%`);

    setWidth('hp-arc-bar', d.battery + '%');
    setWidth('hp-suit-bar', (100 - d.cpu) + '%');
    setWidth('rep-l', (100 - d.memory_percent) + '%');
    setWidth('rep-r', (100 - d.disk_percent) + '%');

    const tv = document.getElementById('threat-val');
    if (tv) {
      tv.textContent = d.threat_level;
      tv.className = 'threat-val';
      if (d.threat_level === 'ELEVATED') tv.classList.add('elevated');
      if (d.threat_level === 'CRITICAL') tv.classList.add('critical');
    }

    addMiniLog(`CPU:${d.cpu}% RAM:${d.memory_percent}% DISK:${d.disk_percent}%`);
  } catch {}
}

async function pollAlert() {
  try {
    const resp = await fetch('/api/alert');
    const d = await resp.json();
    // Only goes to side alerts panel — NOT terminal
    addAlert(d.message, d.level);
  } catch {}
}

async function pollLocation() {
  try {
    const resp = await fetch('/api/location');
    const d = await resp.json();
    setText('coord-lat', d.lat);
    setText('coord-lon', d.lon);
    // Update location display if elements exist
    const locEl = document.getElementById('location-city');
    if (locEl) locEl.textContent = `${d.city}, ${d.country}`;
    const ipEl = document.getElementById('location-ip');
    if (ipEl) ipEl.textContent = d.ip;
  } catch {}
}

async function pollWeather() {
  try {
    const resp = await fetch('/api/weather');
    const d = await resp.json();
    const wEl = document.getElementById('weather-display');
    if (wEl) {
      wEl.innerHTML = `
        <div class="coord-line">${d.city}: ${d.condition}</div>
        <div class="coord-line">TEMP: ${d.temp}°C | HUM: ${d.humidity}%</div>
        <div class="coord-line">WIND: ${d.wind} MPH</div>
      `;
    }
    addAlert(`${d.city}: ${d.condition} ${d.temp}°C`, 'INFO');
  } catch {}
}

async function pollCoords() {
  try {
    const resp = await fetch('/api/coordinates');
    const d = await resp.json();
    setText('coord-lat', d.lat);
    setText('coord-lon', d.lon);
  } catch {}
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setWidth(id, val) {
  const el = document.getElementById(id);
  if (el) el.style.width = val;
}

function addMiniLog(msg) {
  const mc = document.getElementById('mini-console');
  if (!mc) return;
  const line = document.createElement('div');
  line.textContent = '> ' + msg;
  mc.appendChild(line);
  while (mc.children.length > 4) mc.removeChild(mc.firstChild);
}

function addAlert(msg, level) {
  const feed = document.getElementById('alerts-feed');
  if (!feed) return;
  const item = document.createElement('div');
  item.className = 'alert-item ' + (level === 'WARN' ? 'warn' : level === 'CRITICAL' ? 'crit' : 'info');
  item.textContent = msg;
  feed.insertBefore(item, feed.firstChild);
  while (feed.children.length > 6) feed.removeChild(feed.lastChild);
}

// ── TERMINAL CONSOLE ─────────────────────────────────

function addTerminalLine(text, cls = '') {
  const tb = document.getElementById('terminal-body');
  if (!tb) return;
  const line = document.createElement('div');
  line.className = 'term-line ' + cls;
  line.textContent = text;
  tb.appendChild(line);
  tb.scrollTop = tb.scrollHeight;
}

async function typeLines(lines) {
  for (const l of lines) {
    await sleep(40);
    addTerminalLine(l.text, l.cls);
  }
}

async function typewriterLine(text, cls = '') {
  const tb = document.getElementById('terminal-body');
  if (!tb) return;
  const line = document.createElement('div');
  line.className = 'term-line ' + cls;
  tb.appendChild(line);
  for (let i = 0; i < text.length; i++) {
    line.textContent += text[i];
    tb.scrollTop = tb.scrollHeight;
    await sleep(12);
  }
}

const LOCAL_COMMANDS = {
  clear: () => { document.getElementById('terminal-body').innerHTML = ''; return null; },
  boot: () => { setTimeout(() => runBoot(), 500); return [{ text: 'REBOOTING JARVIS...', cls: 'warn' }]; },
  help: () => [
    { text: '╔══ JARVIS AI CONSOLE ═══════════════════╗', cls: 'system' },
    { text: '  Powered by Llama 3.3 70B via Groq      ', cls: 'system' },
    { text: '╠════════════════════════════════════════╣', cls: 'system' },
    { text: '  Type anything to talk to JARVIS        ', cls: '' },
    { text: '  status — real system metrics           ', cls: '' },
    { text: '  weather — live weather data            ', cls: '' },
    { text: '  location — your IP location            ', cls: '' },
    { text: '  clear   — clear terminal               ', cls: '' },
    { text: '  reset   — clear conversation memory    ', cls: '' },
    { text: '╚════════════════════════════════════════╝', cls: 'system' },
  ],
  status: async () => {
    try {
      const resp = await fetch('/api/system-status');
      const d = await resp.json();
      return [
        { text: '══ REAL SYSTEM DIAGNOSTICS ══', cls: 'system' },
        { text: `OS:       ${d.os}`, cls: '' },
        { text: `HOST:     ${d.hostname}`, cls: '' },
        { text: `CPU:      ${d.cpu}%`, cls: d.cpu > 80 ? 'error' : 'success' },
        { text: `RAM:      ${d.memory_used}GB / ${d.memory_total}GB (${d.memory_percent}%)`, cls: d.memory_percent > 85 ? 'error' : 'success' },
        { text: `DISK:     ${d.disk_used}GB / ${d.disk_total}GB (${d.disk_percent}%)`, cls: d.disk_percent > 90 ? 'error' : 'success' },
        { text: `BATTERY:  ${d.battery}% ${d.charging ? '(CHARGING ⚡)' : '(ON BATTERY)'}`, cls: d.battery < 20 ? 'error' : 'success' },
        { text: `NET SENT: ${d.net_sent} MB | RECV: ${d.net_recv} MB`, cls: '' },
        { text: '══ STATUS: NOMINAL ══', cls: 'system' },
      ];
    } catch {
      return [{ text: 'ERROR: Could not fetch system data.', cls: 'error' }];
    }
  },
  weather: async () => {
    try {
      const resp = await fetch('/api/weather');
      const d = await resp.json();
      return [
        { text: '══ ATMOSPHERIC CONDITIONS ══', cls: 'system' },
        { text: `LOCATION:  ${d.city}`, cls: '' },
        { text: `CONDITION: ${d.condition}`, cls: 'success' },
        { text: `TEMP:      ${d.temp}°C`, cls: '' },
        { text: `HUMIDITY:  ${d.humidity}%`, cls: '' },
        { text: `WIND:      ${d.wind} MPH`, cls: '' },
        { text: '══ SCAN COMPLETE ══', cls: 'system' },
      ];
    } catch {
      return [{ text: 'ERROR: Weather data unavailable.', cls: 'error' }];
    }
  },
  location: async () => {
    try {
      const resp = await fetch('/api/location');
      const d = await resp.json();
      return [
        { text: '══ GEOLOCATION DATA ══', cls: 'system' },
        { text: `CITY:     ${d.city}, ${d.country}`, cls: '' },
        { text: `LAT/LON:  ${d.lat} / ${d.lon}`, cls: '' },
        { text: `IP:       ${d.ip}`, cls: 'success' },
        { text: `ISP:      ${d.isp}`, cls: '' },
        { text: `TIMEZONE: ${d.timezone}`, cls: '' },
        { text: '══ TRACKING ACTIVE ══', cls: 'system' },
      ];
    } catch {
      return [{ text: 'ERROR: Location data unavailable.', cls: 'error' }];
    }
  },
  reset: async () => {
    try {
      await fetch('/api/clear-chat', { method: 'POST' });
      return [{ text: 'CONVERSATION MEMORY CLEARED.', cls: 'warn' }];
    } catch {
      return [{ text: 'ERROR: Could not clear memory.', cls: 'error' }];
    }
  },
};

async function askJarvis(message) {
  const tb = document.getElementById('terminal-body');
  const thinking = document.createElement('div');
  thinking.className = 'term-line system';
  thinking.id = 'jarvis-thinking';
  thinking.textContent = 'JARVIS > Processing request...';
  if (tb) { tb.appendChild(thinking); tb.scrollTop = tb.scrollHeight; }
  try {
    const resp = await fetch('/api/jarvis-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await resp.json();
    const el = document.getElementById('jarvis-thinking');
    if (el) el.remove();
    if (data.error) {
      addTerminalLine('JARVIS > ' + data.reply, 'error');
    } else {
      await typewriterLine('JARVIS > ' + data.reply, 'success');
    }
  } catch (e) {
    const el = document.getElementById('jarvis-thinking');
    if (el) el.remove();
    addTerminalLine('JARVIS > COMMUNICATION LINK SEVERED. CHECK NETWORK.', 'error');
  }
}

async function initTerminal() {
  await sleep(200);
  addTerminalLine('JARVIS SYSTEM CONSOLE — STARK INDUSTRIES', 'system');
  addTerminalLine('══════════════════════════════════════════', 'system');
  await sleep(300);
  addTerminalLine('AI CORE: ONLINE  |  MODEL: LLAMA 3.3 70B', 'success');
  addTerminalLine('Type anything to talk to JARVIS. Type "help" for commands.', '');
  addTerminalLine('', '');
}

const termInput = document.getElementById('term-input');
if (termInput) {
  termInput.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const raw = termInput.value.trim();
    termInput.value = '';
    if (!raw) return;
    addTerminalLine('YOU > ' + raw, 'cmd');
    const cmd = raw.toLowerCase().split(' ')[0];
    if (LOCAL_COMMANDS[cmd]) {
      const result = await LOCAL_COMMANDS[cmd](raw);
      if (result && result.length) await typeLines(result);
      return;
    }
    await askJarvis(raw);
  });
}

// ── DIAG CARD HOVER ──────────────────────────────────
document.querySelectorAll('.diag-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const ring = card.querySelector('.ring-progress');
    if (ring) {
      ring.style.filter += ' brightness(1.4)';
      setTimeout(() => { if (ring) ring.style.filter = ''; }, 400);
    }
  });
});

// ── CURSOR TRACKER ───────────────────────────────────
const homeSection = document.getElementById('home');
if (homeSection) {
  homeSection.addEventListener('mousemove', e => {
    const hud = homeSection.querySelector('.hud-center');
    const reticle = document.getElementById('target-reticle');
    if (!hud || !reticle) return;
    const hudRect = hud.getBoundingClientRect();
    const cx = hudRect.left + hudRect.width/2;
    const cy = hudRect.top + hudRect.height/2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const maxR = hudRect.width * 0.35;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const clamp = Math.min(1, maxR / Math.max(dist, 1));
    reticle.style.transform = `translate(calc(-50% + ${dx*clamp*0.3}px), calc(-50% + ${dy*clamp*0.3}px))`;
  });
}

// ── UTILITY ──────────────────────────────────────────
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// ── INIT ─────────────────────────────────────────────
window.addEventListener('load', async () => {
  initTerminal();
  runBoot();
});