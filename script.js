// ── Particles ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function Particle() {
  this.reset();
}
Particle.prototype.reset = function() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.r = Math.random() * 1.2 + 0.3;
  this.speed = Math.random() * 0.3 + 0.1;
  this.opacity = Math.random() * 0.5 + 0.1;
  this.drift = (Math.random() - 0.5) * 0.2;
};

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${p.opacity})`;
    ctx.fill();
    p.y -= p.speed;
    p.x += p.drift;
    if (p.y < -5) p.reset(), p.y = H + 5;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

const envelopeWrap = document.getElementById('envelopeWrap');
const permModal = document.getElementById('permModal');
const allowBtn = document.getElementById('allowBtn');
const denyBtn = document.getElementById('denyBtn');

let tabsGranted = false;
let hasClickedEnvelope = false;

envelopeWrap.addEventListener('click', () => {
  if (hasClickedEnvelope) return;
  hasClickedEnvelope = true;

  envelopeWrap.classList.add('opening');

  setTimeout(() => {
    permModal.classList.add('active');
  }, 500);
});

allowBtn.addEventListener('click', () => {
  tabsGranted = true;
  permModal.classList.remove('active');
  doRickroll();
});

denyBtn.addEventListener('click', () => {
  permModal.classList.remove('active');

  showLetterMessage();
});

function doRickroll() {
  showLetterMessage();
  setTimeout(() => {
    const url = 'https://www.pornhub.com';
    let count = 0;
    const interval = setInterval(() => {
      window.open(url, '_blank');
      count++;
      if (count >= 10) clearInterval(interval);
    }, 300);
  }, 3000);
}

function showLetterMessage() {
  const hint = document.querySelector('.envelope-hint');
  if (hint) {
    hint.textContent = '🎉 Happy Birthday Dishant!';
    hint.style.color = '#c9a96e';
    hint.style.opacity = '1';
    hint.style.animation = 'none';
    hint.style.fontSize = '15px';
    hint.style.fontFamily = "'Playfair Display', serif";
    hint.style.fontStyle = 'italic';
  }
}
