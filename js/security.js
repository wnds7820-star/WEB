// =============================================
//  security.js — Frontend Security Layer
//  DELY Pengamat Politik Dunia
// =============================================

(function() {
  'use strict';

  // ── 1. CONTENT SECURITY HEADERS (via meta injection) ──
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; ');
  document.head.appendChild(cspMeta);

  // ── 2. CLICKJACKING PROTECTION ──
  if (window.self !== window.top) {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:#c0392b;font-size:18px;">⚠️ Akses tidak diizinkan dalam frame.</div>';
    window.top.location = window.self.location;
  }

  // ── 3. RIGHT-CLICK / DEVTOOLS BASIC PROTECTION ──
  // Menonaktifkan klik kanan dan inspeksi pada halaman publik
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Detect DevTools (basic)
  let devToolsOpen = false;
  const devCheck = setInterval(() => {
    const threshold = 160;
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
      if (!devToolsOpen) {
        devToolsOpen = true;
        logSecurityEvent('DevTools terbuka terdeteksi');
      }
    } else {
      devToolsOpen = false;
    }
  }, 1000);

  // ── 4. XSS SANITIZER ──
  window.sanitize = function(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  };

  // ── 5. RATE LIMITER (untuk form submit) ──
  const rateLimits = {};
  window.checkRateLimit = function(key, maxAttempts, windowMs) {
    const now = Date.now();
    if (!rateLimits[key]) rateLimits[key] = [];
    rateLimits[key] = rateLimits[key].filter(t => now - t < windowMs);
    if (rateLimits[key].length >= maxAttempts) return false;
    rateLimits[key].push(now);
    return true;
  };

  // ── 6. SESSION TOKEN (halaman admin) ──
  window.generateSessionToken = function() {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  };

  window.validateSession = function() {
    const token = sessionStorage.getItem('dely_session');
    const expiry = sessionStorage.getItem('dely_expiry');
    if (!token || !expiry) return false;
    if (Date.now() > parseInt(expiry)) {
      sessionStorage.clear();
      return false;
    }
    return true;
  };

  // ── 7. SECURITY EVENT LOGGER ──
  const securityLog = JSON.parse(localStorage.getItem('sec_log') || '[]');

  window.logSecurityEvent = function(event, level = 'info') {
    const entry = {
      time: new Date().toLocaleString('id-ID'),
      event,
      level,
      page: window.location.pathname,
      ua: navigator.userAgent.substring(0, 80)
    };
    securityLog.unshift(entry);
    if (securityLog.length > 50) securityLog.pop();
    localStorage.setItem('sec_log', JSON.stringify(securityLog));
  };

  window.getSecurityLog = function() {
    return JSON.parse(localStorage.getItem('sec_log') || '[]');
  };

  // ── 8. INPUT VALIDATOR ──
  window.validateEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  window.validatePhone = str => /^[\+\d\s\-]{8,15}$/.test(str);
  window.validateName  = str => str.trim().length >= 2 && str.trim().length <= 100;

  // ── 9. ANTI-SPAM (honeypot helper) ──
  window.isSpam = function(formData) {
    // If honeypot field is filled, it's spam
    if (formData.honeypot && formData.honeypot !== '') return true;
    // If submitted too fast (< 2 seconds)
    if (formData.submitTime && Date.now() - formData.formLoadTime < 2000) return true;
    return false;
  };

  // ── 10. SESSION AUTO-EXPIRE ──
  let inactivityTimer;
  function resetInactivity() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (window.location.pathname.includes('admin')) {
        if (validateSession()) {
          sessionStorage.clear();
          logSecurityEvent('Sesi admin berakhir karena tidak aktif', 'warn');
          alert('Sesi Anda telah berakhir karena tidak aktif. Silakan login kembali.');
          window.location.reload();
        }
      }
    }, 15 * 60 * 1000); // 15 menit
  }
  ['mousemove', 'keypress', 'click', 'touchstart'].forEach(e =>
    document.addEventListener(e, resetInactivity, { passive: true })
  );
  resetInactivity();

  // ── 11. KEYBOARD SHORTCUT BLOCK (admin area) ──
  if (window.location.pathname.includes('admin')) {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && ['u', 's', 'i'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'F12') e.preventDefault();
    });
  }

  // ── LOG PAGE VISIT ──
  logSecurityEvent(`Halaman dimuat: ${document.title}`);

})();
