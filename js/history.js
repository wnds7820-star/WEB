// ═══════════════════════════════════════════
//  DELY SEJARAH DUNIA — Main JS  (clean)
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {

  // ── PROGRESS BAR ──
  var progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', function () {
    if (!progressBar) return;
    var s   = document.documentElement;
    var pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  // ── NAVBAR SCROLL ──
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── HAMBURGER MENU ──
  var ham  = document.getElementById('hamburger');
  var menu = document.getElementById('navMenu');

  function toggleMenu(forceOpen) {
    var open = (forceOpen !== undefined) ? forceOpen : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    if (ham) ham.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (ham) ham.addEventListener('click', function () { toggleMenu(); });

  // Close when any nav link is clicked
  document.querySelectorAll('.nav-link, .nav-cta').forEach(function (l) {
    l.addEventListener('click', function () { toggleMenu(false); });
  });

  // Close on tap outside navbar
  document.addEventListener('click', function (e) {
    if (menu && menu.classList.contains('open') && navbar && !navbar.contains(e.target)) {
      toggleMenu(false);
    }
  });
  document.addEventListener('touchstart', function (e) {
    if (menu && menu.classList.contains('open') && navbar && !navbar.contains(e.target)) {
      toggleMenu(false);
    }
  }, { passive: true });

  // Close on swipe-up inside menu
  var touchStartY = 0;
  if (menu) {
    menu.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    menu.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientY - touchStartY < -50) toggleMenu(false);
    }, { passive: true });
  }

  // ── REVEAL ON SCROLL ──
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  } else {
    // Fallback: langsung tampilkan semua (browser lama)
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  // ── LIVE DATE ──
  var dateEl = document.getElementById('live-date');
  if (dateEl) {
    try {
      dateEl.textContent = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) {
      dateEl.textContent = new Date().toDateString();
    }
  }

  // ── NEWS TICKER (duplicate once) ──
  var ticker = document.getElementById('etInner');
  if (ticker && !ticker.dataset.duped) {
    ticker.dataset.duped = '1';
    ticker.parentNode.appendChild(ticker.cloneNode(true));
  }

  // ── ARTIKEL FILTER ──
  var filterBtns = document.querySelectorAll('.afil-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      document.querySelectorAll('.art-card').forEach(function (card) {
        if (f === 'all' || card.dataset.era === f) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(function () {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'none';
          });
        } else {
          card.style.display = 'none';
          card.style.transition = '';
        }
      });
      // Fix: reset grid untuk featured card saat filter aktif
      var featured = document.querySelector('.art-card.featured');
      if (featured) {
        featured.style.gridColumn = (f === 'all') ? '' : 'span 1';
      }
    });
  });

  // ── KUTIPAN CAROUSEL ──
  var quotes = [
    { text: "Barangsiapa tidak belajar dari sejarah, ia dikutuk untuk mengulanginya.", source: "— George Santayana" },
    { text: "Sejarah adalah saksi zaman, cahaya kebenaran, jiwa memori, guru kehidupan, dan kurir zaman kuno.", source: "— Marcus Tullius Cicero" },
    { text: "Kebangkitan dan kejatuhan peradaban bukan soal takdir, melainkan pilihan manusia.", source: "— Arnold J. Toynbee" },
    { text: "Kekuatan tidak datang dari kemenangan. Pergumulan Andalah yang membangun kekuatan.", source: "— Genghis Khan" },
    { text: "Roma tidak dibangun dalam sehari, dan tidak pula runtuh dalam sehari.", source: "— Anonim, Abad Pertengahan" },
    { text: "Ilmu pengetahuan adalah warisan seluruh umat manusia, bukan milik satu peradaban saja.", source: "— Al-Biruni, Ilmuwan Persia" },
  ];
  var qIdx   = 0;
  var qText  = document.getElementById('quoteText');
  var qSrc   = document.getElementById('quoteSource');
  var qTimer = null;

  function showQuote(i) {
    if (!qText || !qSrc) return;
    qText.style.opacity = '0';
    qText.style.transform = 'translateY(10px)';
    qSrc.style.opacity = '0';
    setTimeout(function () {
      qText.textContent = quotes[i].text;
      qSrc.textContent  = quotes[i].source;
      qText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      qSrc.style.transition  = 'opacity 0.5s ease 0.15s';
      qText.style.opacity = '1';
      qText.style.transform = 'none';
      qSrc.style.opacity = '1';
    }, 280);
  }

  function restartTimer() {
    clearInterval(qTimer);
    qTimer = setInterval(function () {
      qIdx = (qIdx + 1) % quotes.length;
      showQuote(qIdx);
    }, 8000);
  }

  showQuote(0);
  restartTimer();

  var qPrev = document.getElementById('qPrev');
  var qNext = document.getElementById('qNext');
  if (qPrev) qPrev.addEventListener('click', function () {
    qIdx = (qIdx - 1 + quotes.length) % quotes.length;
    showQuote(qIdx);
    restartTimer();
  });
  if (qNext) qNext.addEventListener('click', function () {
    qIdx = (qIdx + 1) % quotes.length;
    showQuote(qIdx);
    restartTimer();
  });

  // ── COUNTER ANIMATION ──
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('[data-count]').forEach(function (el) {
          var target  = parseInt(el.dataset.count);
          var current = 0;
          var step    = Math.max(1, Math.ceil(target / 60));
          var iv = setInterval(function () {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString('id-ID');
            if (current >= target) clearInterval(iv);
          }, 25);
        });
        cObs.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stats-section').forEach(function (s) { cObs.observe(s); });
  }

  // ── PERADABAN CARD CLICK ──
  document.querySelectorAll('.perad-card').forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      var target = card.dataset.anchor;
      if (target) {
        var el = document.getElementById(target);
        if (el) {
          var offset = (navbar ? navbar.offsetHeight : 70) + 16;
          var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // ── LOAD MORE BUTTON ──
  var loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      this.textContent = 'Memuat arsip...';
      var self = this;
      setTimeout(function () {
        self.textContent = 'Semua artikel telah dimuat ✓';
        self.disabled = true;
        self.style.opacity = '0.5';
      }, 1000);
    });
  }

  // ── SMOOTH SCROLL untuk semua anchor link (offset navbar) ──
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = (navbar ? navbar.offsetHeight : 70) + 8;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

});
