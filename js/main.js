/* ==========================================================================
   MUHAMMAD HASNAIN - MASTER APPLICATION COORDINATOR
   Initializes all interactive modules on DOM Ready
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Muhammad Hasnain Cyber Portfolio...');

  // 1. Dynamic Typing Effect
  if (typeof initTypewriter === 'function') initTypewriter();

  // 2. Cyber Canvas Background & Constellation Particles
  if (typeof initCyberCanvas === 'function') initCyberCanvas();

  // 3. Custom Glowing Follower Cursor
  if (typeof initCustomCursor === 'function') initCustomCursor();

  // 4. 3D Card Parallax Tilt
  if (typeof initPhotoTilt === 'function') initPhotoTilt();

  // 5. Scroll Animations & Reveal Observer
  if (typeof initScrollAnimations === 'function') initScrollAnimations();

  // 6. Navigation Bar & Active Links
  if (typeof initNavbar === 'function') initNavbar();

  // 7. Animated Numbers Counters
  if (typeof initCounters === 'function') initCounters();

  // 8. Project Filtering
  if (typeof initProjectFilters === 'function') initProjectFilters();

  // 9. Web Audio Synthesizer
  if (typeof initAudioSystem === 'function') initAudioSystem();

  // 10. Back to Top Floating Button
  if (typeof initBackToTop === 'function') initBackToTop();

  console.log('✨ All systems loaded successfully!');
});
