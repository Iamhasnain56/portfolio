/* ==========================================================================
   MODULE: NEON CYBER DODGER MINI GAME
   ========================================================================== */

let miniGameLoop = null;
let gameActive = false;
let gameScore = 0;
let gameBestScore = 0;

function openMiniGameModal() {
  const modal = document.getElementById('gameModal');
  if (modal) modal.classList.add('active');
  if (typeof playSound === 'function') playSound('beep');
  initMiniGameCanvas();
}

function closeMiniGameModal() {
  const modal = document.getElementById('gameModal');
  if (modal) modal.classList.remove('active');
  if (miniGameLoop) cancelAnimationFrame(miniGameLoop);
  gameActive = false;
  if (typeof playSound === 'function') playSound('click');
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
  if (scoreEl) scoreEl.textContent = '0';

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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

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
        gameActive = false;
        if (typeof playSound === 'function') playSound('gameover');
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRASHED! GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = '#fff';
        ctx.font = '13px Outfit, sans-serif';
        ctx.fillText(`Final Score: ${gameScore}`, canvas.width / 2, canvas.height / 2 + 25);
        return;
      }

      if (ast.y > canvas.height + 20) {
        asteroids.splice(i, 1);
        gameScore += 10;
        if (scoreEl) scoreEl.textContent = gameScore;
        if (gameScore > gameBestScore) {
          gameBestScore = gameScore;
          if (bestScoreEl) bestScoreEl.textContent = gameBestScore;
        }
      }
    }

    miniGameLoop = requestAnimationFrame(loop);
  }

  if (typeof playSound === 'function') playSound('powerup');
  loop();
}
