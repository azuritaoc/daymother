/* ═══════════════════════════════════════════
   CURSOR PERSONALIZADO
═══════════════════════════════════════════ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  cursor.style.left     = e.clientX + 'px';
  cursor.style.top      = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

/* ═══════════════════════════════════════════
   ABRIR PANTALLA PRINCIPAL
═══════════════════════════════════════════ */
function openMain() {
  document.getElementById('intro').classList.add('hidden');
  const main = document.getElementById('main');
  main.style.display = 'block';
  setTimeout(() => {
    main.classList.add('visible');
    observeReveal();
    spawnPetals();
    startMusic();
  }, 600);
}

/* ═══════════════════════════════════════════
   SCROLL A DEDICATORIA
═══════════════════════════════════════════ */
function scrollToDedicatoria() {
  const seccion = document.getElementById('dedicatoria');
  if (seccion) seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════════════════
   AUDIO / REPRODUCTOR
═══════════════════════════════════════════ */
const audio = document.getElementById('audio');
let isPlaying   = false;
let simProgress = 0;
let simInterval = null;
let audioReady  = false;

audio.addEventListener('canplay', () => {
  audioReady = true;
});

audio.addEventListener('error', () => {
  console.warn('⚠️ No se pudo cargar el audio. Verifica que cancion-mama.mp3 esté en la misma carpeta.');
});

/* Inicia música al abrir */
function startMusic() {
  const btn = document.getElementById('play-btn');
  if (audioReady || audio.readyState >= 2) {
    audio.play()
      .then(() => {
        isPlaying = true;
        btn.innerHTML = "<svg width='18' height='18' viewBox='0 0 24 24' fill='white'><rect x='5' y='3' width='4' height='18'/><rect x='15' y='3' width='4' height='18'/></svg>";
      })
      .catch(() => {
        isPlaying = true;
        btn.innerHTML = "<svg width='18' height='18' viewBox='0 0 24 24' fill='white'><rect x='5' y='3' width='4' height='18'/><rect x='15' y='3' width='4' height='18'/></svg>";
        simulateProgress();
      });
  } else {
    // Modo demo sin audio
    isPlaying = true;
    btn.innerHTML = "<svg width='18' height='18' viewBox='0 0 24 24' fill='white'><rect x='5' y='3' width='4' height='18'/><rect x='15' y='3' width='4' height='18'/></svg>";
    simulateProgress();
  }
}

/* Play / Pausa */
function togglePlay() {
  const btn = document.getElementById('play-btn');
  if (audioReady || audio.readyState >= 2) {
    if (isPlaying) {
      audio.pause();
      btn.innerHTML = "<svg width='18' height='18' viewBox='0 0 24 24' fill='white'><polygon points='5,3 19,12 5,21'/></svg>";
    } else {
      audio.play();
      btn.innerHTML = "<svg width='18' height='18' viewBox='0 0 24 24' fill='white'><rect x='5' y='3' width='4' height='18'/><rect x='15' y='3' width='4' height='18'/></svg>";
    }
    isPlaying = !isPlaying;
  } else {
    isPlaying = !isPlaying;
    btn.innerHTML = isPlaying ? '<span style="letter-spacing:-2px">❙❙</span>' : '&#9654;';
    if (isPlaying) simulateProgress();
    else clearInterval(simInterval);
  }
}

/* Progreso simulado (modo demo) */
function simulateProgress() {
  clearInterval(simInterval);
  simInterval = setInterval(() => {
    if (!isPlaying) { clearInterval(simInterval); return; }
    simProgress += 0.5;
    if (simProgress >= 149) simProgress = 0;
    const pct = (simProgress / 149) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    const m = Math.floor(simProgress / 60);
    const s = Math.floor(simProgress % 60).toString().padStart(2, '0');
    document.getElementById('time-current').textContent = m + ':' + s;
  }, 500);
}

/* Actualizar barra con audio real */
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  const m  = Math.floor(audio.currentTime / 60);
  const s  = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  document.getElementById('time-current').textContent = m + ':' + s;
  const tm = Math.floor(audio.duration / 60);
  const ts = Math.floor(audio.duration % 60).toString().padStart(2, '0');
  document.getElementById('time-total').textContent = tm + ':' + ts;
});

/* Clic en barra de progreso */
function seekAudio(e) {
  const bar = document.getElementById('progress-bar');
  const pct = e.offsetX / bar.offsetWidth;
  if (audio.duration) audio.currentTime = pct * audio.duration;
  else simProgress = pct * 149;
}

function prevTrack() {
  if (audio.duration) audio.currentTime = 0;
  else simProgress = 0;
}

function nextTrack() {
  if (audio.duration) audio.currentTime = 0;
  else simProgress = 0;
}

/* ═══════════════════════════════════════════
   PÉTALOS / CORAZONES (Canvas)
═══════════════════════════════════════════ */
const canvas = document.getElementById('petals-canvas');
const ctx    = canvas.getContext('2d');
let petals      = [];
let petalActive = false;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createPetal() {
  return {
    x:        Math.random() * canvas.width,
    y:        -20,
    size:     Math.random() * 12 + 6,
    speed:    Math.random() * 1.5 + 0.6,
    drift:    (Math.random() - 0.5) * 1.2,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.06,
    alpha:    Math.random() * 0.6 + 0.4,
    color:    ['#C0364A', '#D4607A', '#8B0020', '#F0C4CC', '#C9A96E', '#4A90D9', '#ff40dfff'][
                Math.floor(Math.random() * 7)
              ]
  };
}

function drawHeart(x, y, size, rotation, alpha, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle   = color;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.25);
  ctx.bezierCurveTo( size * 0.5, -size * 0.6,  size,       size * 0.1, 0, size * 0.5);
  ctx.bezierCurveTo(-size,        size * 0.1, -size * 0.5, -size * 0.6, 0, -size * 0.25);
  ctx.fill();
  ctx.restore();
}

function animatePetals() {
  if (!petalActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (petals.length < 80 && Math.random() < 0.18) petals.push(createPetal());
  petals.forEach((p, i) => {
    p.y        += p.speed;
    p.x        += p.drift + Math.sin(p.y * 0.015) * 0.6;
    p.rotation += p.rotSpeed;
    drawHeart(p.x, p.y, p.size, p.rotation, p.alpha, p.color);
    if (p.y > canvas.height + 30) petals.splice(i, 1);
  });
  requestAnimationFrame(animatePetals);
}

function spawnPetals() {
  petalActive = true;
  animatePetals();
}

/* ═══════════════════════════════════════════
   REVEAL AL HACER SCROLL
═══════════════════════════════════════════ */
function observeReveal() {
  const elements = document.querySelectorAll('.reveal, .dedi-text');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  elements.forEach(el => observer.observe(el));
}
