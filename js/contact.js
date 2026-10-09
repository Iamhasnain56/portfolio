/* ==========================================================================
   MODULE: CONTACT FORM, MODALS & TOAST NOTIFICATIONS
   ========================================================================== */

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('senderName').value;
  const submitBtn = document.getElementById('submitBtn');
  const banner = document.getElementById('formSuccessMsg');

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
    if (banner) banner.classList.remove('hidden');
    document.getElementById('contactForm').reset();
    if (typeof playSound === 'function') playSound('powerup');
    showToast(`🚀 Message from ${name} received! Thanks!`);
  }, 1200);
}

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

function openInteractiveDemo(title, description) {
  const modal = document.getElementById('infoModal');
  const titleEl = document.getElementById('infoModalTitle');
  const contentEl = document.getElementById('infoModalContent');

  if (titleEl) titleEl.textContent = title;
  if (contentEl) contentEl.textContent = description;
  if (modal) modal.classList.add('active');
  if (typeof playSound === 'function') playSound('beep');
}

function closeInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) modal.classList.remove('active');
  if (typeof playSound === 'function') playSound('click');
}

/* Photo Switcher for Hero Photo */
function switchHeroPhoto(imgSrc, el) {
  const heroImg = document.getElementById('heroProfileImg');
  if (!heroImg) return;

  // Fade out effect
  heroImg.style.opacity = '0';
  heroImg.style.transform = 'scale(0.95)';

  setTimeout(() => {
    heroImg.src = imgSrc;
    heroImg.style.opacity = '1';
    heroImg.style.transform = 'scale(1)';
  }, 200);

  // Update active thumb
  document.querySelectorAll('.selector-thumb').forEach(thumb => thumb.classList.remove('active'));
  if (el) el.classList.add('active');

  if (typeof playSound === 'function') playSound('beep');
}

/* Image Lightbox Modal Viewer */
function openImageModal(imgSrc, title, description) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalDesc = document.getElementById('lightboxDesc');

  if (modalImg) modalImg.src = imgSrc;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = description;
  if (modal) modal.classList.add('active');

  if (typeof playSound === 'function') playSound('powerup');
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('active');
  if (typeof playSound === 'function') playSound('click');
}

