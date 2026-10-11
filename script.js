/* ==========================================================================
   MUHAMMAD HASNAIN - OFFICIAL PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive systems
  initTypewriter();
  initCyberCanvas();
  initCustomCursor();
  initPhotoTilt();
  initScrollAnimations();
  initNavbar();
  initCounters();
  initProjectFilters();
  initAudioSystem();
  initBackToTop();
});

/* --- 1. DYNAMIC TYPEWRITER EFFECT --- */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const roles = [
    '8th Grade Student @ KIPS School',
    'Continuous Class Topper & Position Holder 🏆',
    'Fakhar Zaman Fan & Cricket Lover 🏏',
    'Nature & Mountain Explorer 🏔️',
    'Khazar Umar Fan & Media Lover 🎥',
    '14-Year-Old Ambitious Learner'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new text
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --- 2. INTERACTIVE CYBER PARTICLE CANVAS --- */
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

  // Particle Class
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

      // Mouse collision repulsion
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

  // Burst function on click or button trigger
  function burstAt(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const spark = new Particle(x, y, true);
      spark.vx = (Math.random() - 0.5) * 6;
      spark.vy = (Math.random() - 0.5) * 6;
      sparks.push(spark);
    }
  }

  window.addEventListener('click', (e) => {
    // Only if not clicking buttons/inputs
    if (!e.target.closest('button, a, input, textarea, .modal-container')) {
      burstAt(e.clientX, e.clientY, 15);
      playSound('click');
    }
  });

  triggerParticleBurstFunc = () => {
    burstAt(window.innerWidth / 2, window.innerHeight / 2, 60);
    showToast('✨ Cyber Neon Shockwave triggered!');
    playSound('powerup');
  };

  // Connect lines between close particles
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

  // Animation Loop
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

/* --- 3. CUSTOM GLOWING CURSOR --- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderGlow() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderGlow);
  }
  renderGlow();

  // Hover states on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card, .tool-tag');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      glow.style.width = '55px';
      glow.style.height = '55px';
      glow.style.borderColor = 'var(--primary-cyan)';
      glow.style.backgroundColor = 'rgba(0, 240, 255, 0.15)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.width = '38px';
      glow.style.height = '38px';
      glow.style.borderColor = 'var(--accent-cyan)';
      glow.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
    });
  });
}

/* --- 4. 3D PHOTO CARD MOUSE TILT --- */
function initPhotoTilt() {
  const card = document.getElementById('photoTiltCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --- 5. SCROLL PROGRESS & REVEAL OBSERVER --- */
function initScrollAnimations() {
  const progressBar = document.getElementById('scrollProgressBar');
  const revealElements = document.querySelectorAll('[data-reveal]');

  // Scroll progress updater
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }
  });

  // Intersection Observer for Scroll Reveals
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* --- 6. NAVBAR & ACTIVE NAVIGATION LINK TRACKING --- */
function initNavbar() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      playSound('beep');
    });

    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        playSound('beep');
      });
    });
  }

  // Active section tracking on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --- 7. ANIMATED NUMBER COUNTERS --- */
function initCounters() {
  const counterCards = document.querySelectorAll('.counter-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counterCards.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const isGrade = counter.textContent.includes('8th');
            const isPlus = counter.textContent.includes('+');
            const isPercent = counter.textContent.includes('%');

            let current = 0;
            const duration = 1500;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }

              if (isGrade) {
                counter.textContent = `${Math.floor(current)}th`;
              } else if (isPlus) {
                counter.textContent = `${Math.floor(current)}+`;
              } else if (isPercent) {
                counter.textContent = `${Math.floor(current)}%`;
              } else {
                counter.textContent = Math.floor(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.counters-row');
  if (statsSection) observer.observe(statsSection);
}

/* --- 8. PROJECT FILTER TABS --- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playSound('beep');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --- 9. SYNTHESIZED WEB AUDIO SYSTEM (ZERO EXTERNAL FILES) --- */
let audioCtx = null;
let soundEnabled = false;

function initAudioSystem() {
  const soundBtn = document.getElementById('soundToggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      soundBtn.classList.add('active');
      soundBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span class="sound-label">SFX ON</span>`;
      playSound('powerup');
      showToast('🔊 Cyber Sound Effects Enabled!');
    } else {
      soundBtn.classList.remove('active');
      soundBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> <span class="sound-label">SFX OFF</span>`;
      showToast('🔇 Sound Effects Muted');
    }
  });
}

function playSound(type) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    // Audio context error handle silently
  }
}

/* --- 10. BACK TO TOP BUTTON --- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('beep');
  });
}

/* --- 11. MODALS & INTERACTIVE DEMOS --- */
function openInteractiveDemo(title, description) {
  const modal = document.getElementById('infoModal');
  const titleEl = document.getElementById('infoModalTitle');
  const contentEl = document.getElementById('infoModalContent');

  if (titleEl) titleEl.textContent = title;
  if (contentEl) contentEl.textContent = description;
  if (modal) modal.classList.add('active');
  playSound('beep');
}

function closeInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) modal.classList.remove('active');
  playSound('click');
}

/* --- 12. MINI GAME: NEON CYBER DODGER --- */
let miniGameLoop = null;
let gameActive = false;
let gameScore = 0;
let gameBestScore = 0;

function openMiniGameModal() {
  const modal = document.getElementById('gameModal');
  if (modal) modal.classList.add('active');
  playSound('beep');
  initMiniGameCanvas();
}

function closeMiniGameModal() {
  const modal = document.getElementById('gameModal');
  if (modal) modal.classList.remove('active');
  if (miniGameLoop) cancelAnimationFrame(miniGameLoop);
  gameActive = false;
  playSound('click');
}

function initMiniGameCanvas() {
  const canvas = document.getElementById('miniGameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#030718';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '14px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Press "Start Game" to launch Cyber Drone!', canvas.width / 2, canvas.height / 2);
}

function startMiniGame() {
  const canvas = document.getElementById('miniGameCanvas');
  const scoreEl = document.getElementById('gameScore');
  const bestScoreEl = document.getElementById('gameBestScore');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (miniGameLoop) cancelAnimationFrame(miniGameLoop);

  gameActive = true;
  gameScore = 0;
  scoreEl.textContent = '0';

  const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 35,
    width: 30,
    height: 18,
    speed: 6,
    color: '#00f0ff'
  };

  let asteroids = [];
  let keys = { left: false, right: false };

  // Key handlers
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

  // Touch handlers
  const touchLeft = document.getElementById('touchLeftBtn');
  const touchRight = document.getElementById('touchRightBtn');

  if (touchLeft && touchRight) {
    touchLeft.onmousedown = touchLeft.ontouchstart = () => { keys.left = true; };
    touchLeft.onmouseup = touchLeft.ontouchend = () => { keys.left = false; };
    touchRight.onmousedown = touchRight.ontouchstart = () => { keys.right = true; };
    touchRight.onmouseup = touchRight.ontouchend = () => { keys.right = false; };
  }

  let frameCount = 0;

  function loop() {
    if (!gameActive) return;

    ctx.fillStyle = 'rgba(3, 7, 24, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update Player
    if (keys.left && player.x > 5) player.x -= player.speed;
    if (keys.right && player.x < canvas.width - player.width - 5) player.x += player.speed;

    // Draw Player Drone
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Spawn Asteroids
    frameCount++;
    if (frameCount % 35 === 0) {
      asteroids.push({
        x: Math.random() * (canvas.width - 20) + 10,
        y: -15,
        radius: Math.random() * 8 + 6,
        speed: Math.random() * 2.5 + 2.5,
        color: Math.random() > 0.5 ? '#f43f5e' : '#fbbf24'
      });
    }

    // Update & Draw Asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const ast = asteroids[i];
      ast.y += ast.speed;

      ctx.fillStyle = ast.color;
      ctx.beginPath();
      ctx.arc(ast.x, ast.y, ast.radius, 0, Math.PI * 2);
      ctx.fill();

      // Collision Detection
      const distX = Math.abs(ast.x - (player.x + player.width / 2));
      const distY = Math.abs(ast.y - (player.y + player.height / 2));

      if (distX < player.width / 2 + ast.radius && distY < player.height / 2 + ast.radius) {
        // Game Over
        gameActive = false;
        playSound('gameover');
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRASHED! GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = '#fff';
        ctx.font = '13px Outfit, sans-serif';
        ctx.fillText(`Final Score: ${gameScore}`, canvas.width / 2, canvas.height / 2 + 25);
        return;
      }

      // Passed screen
      if (ast.y > canvas.height + 20) {
        asteroids.splice(i, 1);
        gameScore += 10;
        scoreEl.textContent = gameScore;
        if (gameScore > gameBestScore) {
          gameBestScore = gameScore;
          bestScoreEl.textContent = gameBestScore;
        }
      }
    }

    miniGameLoop = requestAnimationFrame(loop);
  }

  playSound('powerup');
  loop();
}

/* --- 13. CONTACT FORM SIMULATOR --- */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('senderName').value;
  const email = document.getElementById('senderEmail').value;
  const submitBtn = document.getElementById('submitBtn');
  const banner = document.getElementById('formSuccessMsg');

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
    if (banner) banner.classList.remove('hidden');
    document.getElementById('contactForm').reset();
    playSound('powerup');
    showToast(`🚀 Message from ${name} received! Thanks!`);
  }, 1200);
}

/* --- 14. TOAST NOTIFICATION UTILITY --- */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
