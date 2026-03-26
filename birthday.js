// Thanks gpt for fixing my birthday code, and removing my whole working logic 🙏
// ── Background Canvas ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Confetti pieces
const confetti = [];
const colors = ['#c9a96e', '#e8c4f0', '#7eb8f7', '#f7d070', '#a8e6cf', '#ffaaa5'];

for (let i = 0; i < 80; i++) {
  confetti.push({
    x: Math.random() * W,
    y: Math.random() * H - H,
    w: Math.random() * 8 + 4,
    h: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 1.5 + 0.5,
    drift: (Math.random() - 0.5) * 0.8,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    opacity: Math.random() * 0.6 + 0.3,
  });
}

// Sparkle particles
const sparkles = [];
for (let i = 0; i < 60; i++) {
  sparkles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.4 + 0.1,
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Draw sparkles
  sparkles.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${s.opacity})`;
    ctx.fill();
    s.y -= s.speed;
    if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
  });

  // Draw confetti
  confetti.forEach(c => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.globalAlpha = c.opacity;
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
    c.y += c.speed;
    c.x += c.drift;
    c.rot += c.rotSpeed;
    if (c.y > H + 20) { c.y = -20; c.x = Math.random() * W; }
  });

  requestAnimationFrame(draw);
}
draw();

// ── Scroll reveal for letter card ──
const letterCard = document.querySelector('.letter-card');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });
if (letterCard) observer.observe(letterCard);

// ── Birthday Song (Web Audio API) ──
// We'll synthesize the Happy Birthday tune using the Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let songPlaying = false;
let songNodes = [];

// Happy Birthday notes: [note_freq, duration_in_beats]
// Standard Happy Birthday to You melody
const notes = [
  // Happy Birthday to You
  [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2],
  // Happy Birthday to You
  [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [392.00, 1], [349.23, 2],
  // Happy Birthday dear Dishant
  [261.63, 0.75], [261.63, 0.25], [523.25, 1], [440.00, 1], [349.23, 1], [329.63, 1], [293.66, 2],
  // Happy Birthday to You
  [466.16, 0.75], [466.16, 0.25], [440.00, 1], [349.23, 1], [392.00, 1], [349.23, 2],
];

const BPM = 140;
const beatLen = 60 / BPM;

function playNote(freq, startTime, duration, gainNode) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const envGain = audioCtx.createGain();

  osc.connect(envGain);
  envGain.connect(gainNode);

  // Soft sine + slight triangle blend for warmth
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  const attack = 0.05;
  const release = 0.1;
  envGain.gain.setValueAtTime(0, startTime);
  envGain.gain.linearRampToValueAtTime(0.18, startTime + attack);
  envGain.gain.setValueAtTime(0.18, startTime + duration - release);
  envGain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
  songNodes.push(osc);
}

function playSong(loop = true) {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // Add reverb-like effect with a simple delay
  const delay = audioCtx.createDelay();
  delay.delayTime.value = 0.3;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.2;
  const delayGain = audioCtx.createGain();
  delayGain.gain.value = 0.25;

  masterGain.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(audioCtx.destination);

  let t = audioCtx.currentTime + 0.1;
  const songDuration = notes.reduce((sum, [, d]) => sum + d * beatLen, 0);

  notes.forEach(([freq, beats]) => {
    playNote(freq, t, beats * beatLen * 0.9, masterGain);
    t += beats * beatLen;
  });

  if (loop) {
    setTimeout(() => {
      if (songPlaying) playSong(true);
    }, (songDuration + 1) * 1000);
  }
}

// Auto-play with user interaction fallback
function startMusic() {
  if (songPlaying) return;
  songPlaying = true;
  playSong(true);
  musicBtn.textContent = '🔇 Pause Music';
}

// Music toggle button
const musicBtn = document.getElementById('musicBtn');
musicBtn.addEventListener('click', () => {
  if (!songPlaying) {
    startMusic();
  } else {
    songPlaying = false;
    if (audioCtx) audioCtx.suspend();
    musicBtn.textContent = '🎵 Play Music';
  }
});

// Try autoplay on first interaction anywhere
let autoStarted = false;
document.addEventListener('click', () => {
  if (!autoStarted) {
    autoStarted = true;
    startMusic();
  }
}, { once: true });

// Also try on page load
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!autoStarted) {
      try {
        startMusic();
        autoStarted = true;
      } catch(e) {}
    }
  }, 500);
});

// ── Typewriter effect for hero text ──
const heroWords = ['Amazing.', 'Legendary.', 'Blessed.', 'The Best.'];
let wordIdx = 0;
const typeEl = document.getElementById('typeword');

function typeWord(word, cb) {
  typeEl.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    typeEl.textContent += word[i++];
    if (i >= word.length) {
      clearInterval(t);
      setTimeout(() => eraseWord(cb), 1800);
    }
  }, 90);
}

function eraseWord(cb) {
  const t = setInterval(() => {
    typeEl.textContent = typeEl.textContent.slice(0, -1);
    if (!typeEl.textContent.length) {
      clearInterval(t);
      cb();
    }
  }, 50);
}

function cycleWords() {
  typeWord(heroWords[wordIdx % heroWords.length], () => {
    wordIdx++;
    cycleWords();
  });
}

setTimeout(cycleWords, 1400);
