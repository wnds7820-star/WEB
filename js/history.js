// ═══════════════════════════════════════════
//  DELY SEJARAH DUNIA — Main JS
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── PROGRESS BAR ──
  window.addEventListener('scroll', () => {
    const s = document.documentElement;
    const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
  });

  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── HAMBURGER ──
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  ham?.addEventListener('click', () => {
    menu.classList.toggle('open');
    ham.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link,.nav-cta').forEach(l => l.addEventListener('click', () => {
    menu.classList.remove('open');
    ham?.classList.remove('active');
  }));

  // ── REVEAL ON SCROLL ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ── LIVE DATE ──
  const dateEl = document.getElementById('live-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // ── NEWS TICKER ──
  const ticker = document.getElementById('etInner');
  if (ticker) { const clone = ticker.cloneNode(true); ticker.parentNode.appendChild(clone); }

  // ── ARTIKEL FILTER ──
  const filterBtns = document.querySelectorAll('.afil-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.art-card').forEach(card => {
        if (f === 'all' || card.dataset.era === f) {
          card.style.display = ''; card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => { card.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; card.style.opacity = '1'; card.style.transform = 'none'; });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── KUTIPAN CAROUSEL ──
  const quotes = [
    { text: "Barangsiapa tidak belajar dari sejarah, ia dikutuk untuk mengulanginya.", source: "— George Santayana" },
    { text: "Sejarah adalah saksi zaman, cahaya kebenaran, jiwa memori, guru kehidupan, dan kurir zaman kuno.", source: "— Marcus Tullius Cicero" },
    { text: "Kebangkitan dan kejatuhan peradaban bukan soal takdir, melainkan pilihan manusia.", source: "— Arnold J. Toynbee" },
    { text: "Kekuatan tidak datang dari kemenangan. Pergumulan Andalah yang membangun kekuatan.", source: "— Genghis Khan" },
    { text: "Roma tidak dibangun dalam sehari, dan tidak pula runtuh dalam sehari.", source: "— Anonim, Abad Pertengahan" },
    { text: "Ilmu pengetahuan adalah warisan seluruh umat manusia, bukan milik satu peradaban saja.", source: "— Al-Biruni, Ilmuwan Persia" },
  ];
  let qIdx = 0;
  const qText = document.getElementById('quoteText');
  const qSrc  = document.getElementById('quoteSource');
  function showQuote(i) {
    if (!qText) return;
    qText.style.opacity = '0'; qText.style.transform = 'translateY(10px)';
    qSrc.style.opacity  = '0';
    setTimeout(() => {
      qText.textContent = quotes[i].text;
      qSrc.textContent  = quotes[i].source;
      qText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      qText.style.opacity = '1'; qText.style.transform = 'none';
      qSrc.style.transition = 'opacity 0.5s ease 0.2s';
      qSrc.style.opacity = '1';
    }, 300);
  }
  showQuote(0);
  document.getElementById('qPrev')?.addEventListener('click', () => { qIdx = (qIdx - 1 + quotes.length) % quotes.length; showQuote(qIdx); });
  document.getElementById('qNext')?.addEventListener('click', () => { qIdx = (qIdx + 1) % quotes.length; showQuote(qIdx); });
  setInterval(() => { qIdx = (qIdx + 1) % quotes.length; showQuote(qIdx); }, 8000);

  // ── CAPTCHA ──
  let captchaAnswer = 0;
  function genCaptcha() {
    const a = Math.floor(Math.random()*15)+1, b = Math.floor(Math.random()*10)+1;
    captchaAnswer = a + b;
    const el = document.getElementById('captchaQ');
    if (el) el.textContent = `${a} + ${b}`;
  }
  genCaptcha();

  // ── FORM SUBMIT ──
  document.getElementById('kontakForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const ans = parseInt(document.getElementById('captchaAns')?.value);
    const ok  = document.getElementById('formOk');
    const err = document.getElementById('formErr');
    if (ans === captchaAnswer) {
      ok.style.display = 'block'; err.style.display = 'none';
      e.target.reset(); genCaptcha();
      setTimeout(() => ok.style.display = 'none', 5000);
    } else {
      err.style.display = 'block'; ok.style.display = 'none';
      genCaptcha(); document.getElementById('captchaAns').value = '';
    }
  });

  // ── COUNTER ANIMATION ──
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          let current = 0; const step = Math.ceil(target / 60);
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString();
            if (current >= target) clearInterval(interval);
          }, 25);
        });
        cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats-section').forEach(s => cObs.observe(s));

  // ── LOAD MORE ARTICLES ──
  document.getElementById('loadMoreBtn')?.addEventListener('click', function() {
    this.textContent = 'Memuat arsip...';
    setTimeout(() => { this.textContent = 'Semua artikel telah dimuat ✓'; this.disabled = true; this.style.opacity = '0.5'; }, 1000);
  });

  // ── PERADABAN CARD CLICK ──
  document.querySelectorAll('.perad-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.anchor;
      if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
