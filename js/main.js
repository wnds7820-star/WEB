// =============================================
//  main.js — Navbar, Cursor, Scroll
// =============================================
document.addEventListener('DOMContentLoaded', () => {

  // ── LIVE DATE ──
  const el = document.getElementById('live-date');
  if (el) {
    el.textContent = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // ── SCROLL PROGRESS ──
  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight) * 100;
    const pb = document.getElementById('progress-bar');
    if (pb) pb.style.width = pct + '%';
  }, { passive: true });

  // ── NAVBAR ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      highlightNav();
    }, { passive: true });
  }

  function highlightNav() {
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop - 100;
      const bot = top + sec.offsetHeight;
      const lnk = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (lnk) lnk.classList.toggle('active', window.scrollY >= top && window.scrollY < bot);
    });
  }

  // ── HAMBURGER ──
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('navMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open'); menu.classList.remove('open');
    }));
  }

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── ADMIN LINK (show if logged in) ──
  const adminLink = document.getElementById('adminLink');
  if (adminLink && typeof validateSession === 'function' && validateSession()) {
    adminLink.style.display = 'block';
  }

});
