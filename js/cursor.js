/* ==========================================================================
   MODULE: CUSTOM NEON GLOWING CURSOR
   ========================================================================== */

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
