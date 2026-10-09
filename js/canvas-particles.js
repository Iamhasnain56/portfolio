/* ==========================================================================
   MODULE: CYBER PARTICLE CONSTELLATION & SHOCKWAVE CANVAS
   ========================================================================== */

let triggerParticleBurstFunc = null;

function initCyberCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width / 2,
    y: height / 2,
    radius: 130
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor(x, y, isSpark = false) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.size = isSpark ? Math.random() * 3 + 2 : Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 1;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.isSpark = isSpark;
      this.color = isSpark 
        ? '#00f0ff' 
        : Math.random() > 0.6 ? '#38bdf8' : '#1d4ed8';
      this.alpha = Math.random() * 0.6 + 0.2;
      this.life = isSpark ? 60 : Infinity;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = this.isSpark ? 10 : 0;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    update() {
      if (this.isSpark) {
        this.x += this.vx * 2;
        this.y += this.vy * 2;
        this.alpha -= 0.015;
        this.life--;
        return;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        this.x -= directionX;
        this.y -= directionY;
      }
    }
  }

  let particles = [];
  let sparks = [];

  function createParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 12000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  createParticles();

  function burstAt(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const spark = new Particle(x, y, true);
      spark.vx = (Math.random() - 0.5) * 6;
      spark.vy = (Math.random() - 0.5) * 6;
      sparks.push(spark);
    }
  }

  window.addEventListener('click', (e) => {
    if (!e.target.closest('button, a, input, textarea, .modal-container')) {
      burstAt(e.clientX, e.clientY, 15);
      if (typeof playSound === 'function') playSound('click');
    }
  });

  triggerParticleBurstFunc = () => {
    burstAt(window.innerWidth / 2, window.innerHeight / 2, 60);
    if (typeof showToast === 'function') showToast('✨ Cyber Neon Shockwave triggered!');
    if (typeof playSound === 'function') playSound('powerup');
  };

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacityValue = 1 - dist / 110;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].draw();
      if (sparks[i].life <= 0 || sparks[i].alpha <= 0) {
        sparks.splice(i, 1);
      }
    }

    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

function triggerParticleBurst() {
  if (triggerParticleBurstFunc) triggerParticleBurstFunc();
}
