/* ═══════════════════════════════════════════════
   BAILANDO EL CAOS · Catálogo Premium
   catalog.js
═══════════════════════════════════════════════ */

// ── Background particles (vino tones) ──
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, bubbles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = [
  'rgba(107,26,42,',  'rgba(139,34,53,',  'rgba(169,51,71,',
  'rgba(196,104,122,','rgba(196,149,58,',  'rgba(80,15,30,',
];

function makeBubble() {
  return {
    x: Math.random() * W,
    y: H + Math.random() * 80,
    r: 3 + Math.random() * 22,
    speed: 0.25 + Math.random() * 0.65,
    drift: (Math.random() - 0.5) * 0.3,
    alpha: 0.04 + Math.random() * 0.12,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.004 + Math.random() * 0.012,
  };
}

for (let i = 0; i < 50; i++) {
  const b = makeBubble();
  b.y = Math.random() * H;
  bubbles.push(b);
}

function drawBubble(b) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.strokeStyle = b.color + (b.alpha * 1.3) + ')';
  ctx.lineWidth = 1;
  ctx.stroke();
  const g = ctx.createRadialGradient(b.x - b.r * .3, b.y - b.r * .3, b.r * .05, b.x, b.y, b.r);
  g.addColorStop(0, b.color + (b.alpha * .7) + ')');
  g.addColorStop(1, b.color + '0)');
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

function animBg() {
  ctx.clearRect(0, 0, W, H);
  for (let b of bubbles) {
    b.wobble += b.wobbleSpeed;
    b.x += b.drift + Math.sin(b.wobble) * .25;
    b.y -= b.speed;
    if (b.y < -b.r * 2) Object.assign(b, makeBubble());
    drawBubble(b);
  }
  requestAnimationFrame(animBg);
}
animBg();

// ── Book navigation ──
const spreads = document.querySelectorAll('.spread');
const total   = spreads.length;
let current   = 0;
let animating = false;

const labels = [
  "Portada",
  "Bienvenida",
  "Seduce · Portada",
  "Seduce · Brasier",
  "Seduce · Tanga & Conjunto",
  "Luxe · Portada",
  "Luxe · Brasier",
  "Luxe · Conjunto & Tanga",
  "Secret · Portada",
  "Secret · Brasier",
  "Brillos · Portada",
  "Brillos · Tangas Brillos",
  "Encaje · Portada",
  "Encaje · Productos",
  "Essentials · Portada",
  "Essentials · Tangas & Propiedad Tóxico",
  "Contacto",
];

const dotsContainer = document.getElementById('dots');
for (let i = 0; i < total; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => { if (i !== current) goToSpread(i); };
  dotsContainer.appendChild(d);
}

function updateUI() {
  const label = labels[current] || ('Página ' + (current + 1));
  document.getElementById('pageLabel').innerText = label + ' · ' + (current + 1) + ' / ' + total;
  document.getElementById('prevBtn').disabled = (current === 0);
  document.getElementById('nextBtn').disabled = (current === total - 1);
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

function goToSpread(target) {
  if (animating) return;
  animating = true;
  const isForward = target > current;
  spreads[current].classList.remove('active', 'anim-forward', 'anim-backward');
  spreads[target].classList.add('active', isForward ? 'anim-forward' : 'anim-backward');
  current = target;
  updateUI();
  setTimeout(() => { animating = false; }, 600);
}

function navigate(dir) {
  const t = current + dir;
  if (t >= 0 && t < total) goToSpread(t);
}

// Touch swipe support
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   navigate(-1);
});
