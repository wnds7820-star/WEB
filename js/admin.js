// =============================================
//  admin.js — Login System & Dashboard
// =============================================

// ── CREDENTIALS (di produksi nyata: hash di server) ──
// Password: Dely@Admin2025! (di-hash SHA-256 simulasi)
const ADMIN_CREDENTIALS = {
  username: 'dely_admin',
  // SHA-256 dari "Dely@Admin2025!" — simulasi client-side
  passHash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'
};

const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 30000; // 30 detik
const SESSION_MS    = 15 * 60 * 1000; // 15 menit

let captchaAnswer = 0;

// ── SIMPLE HASH SIMULATION ──
async function hashString(str) {
  if (crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2,'0')).join('');
  }
  // fallback: simple scramble (tidak aman, hanya demo)
  return str.split('').reverse().join('') + '_fallback';
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {

  // Jika sudah login, tampilkan dashboard
  if (validateSession()) {
    showDashboard(sessionStorage.getItem('dely_user') || 'Admin');
    return;
  }

  // Tampilkan waktu
  const loginTime = document.getElementById('loginTime');
  if (loginTime) {
    loginTime.textContent = new Date().toLocaleTimeString('id-ID');
    setInterval(() => loginTime.textContent = new Date().toLocaleTimeString('id-ID'), 1000);
  }

  // Session ID display
  const sidEl = document.getElementById('sessionId');
  if (sidEl) {
    const sid = generateSessionToken().substring(0, 12).toUpperCase();
    sidEl.textContent = 'SID: ' + sid;
  }

  // Generate CAPTCHA
  generateCaptcha();

  // ── LOGIN FORM ──
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('loginErr');
    const btnEl = document.getElementById('loginBtn');

    // Check rate limit / lockout
    const lockoutUntil = parseInt(localStorage.getItem('admin_lockout') || '0');
    if (Date.now() < lockoutUntil) {
      showLockout(lockoutUntil); return;
    }

    const attempts = parseInt(localStorage.getItem('admin_attempts') || '0');

    const user     = sanitize(document.getElementById('adminUser').value.trim());
    const pass     = document.getElementById('adminPass').value;
    const capInput = parseInt(document.getElementById('capAns').value);

    // Captcha check
    if (capInput !== captchaAnswer) {
      errEl.textContent = '✗ Jawaban verifikasi salah.';
      logSecurityEvent(`Login gagal — captcha salah (user: ${user})`, 'warn');
      generateCaptcha();
      return;
    }

    btnEl.disabled = true;
    btnEl.textContent = 'Memverifikasi...';

    // Simulate server delay
    await new Promise(r => setTimeout(r, 800));

    const passHash = await hashString(pass);
    const usernameOk = user === ADMIN_CREDENTIALS.username;
    // Demo: accept "Dely@Admin2025!" or simple demo password "admin123"
    const passOk = pass === 'Dely@Admin2025!' || pass === 'admin123';

    if (usernameOk && passOk) {
      // SUCCESS
      localStorage.removeItem('admin_attempts');
      localStorage.removeItem('admin_lockout');

      const token = generateSessionToken();
      sessionStorage.setItem('dely_session', token);
      sessionStorage.setItem('dely_user', user);
      sessionStorage.setItem('dely_expiry', Date.now() + SESSION_MS);

      logSecurityEvent(`Login berhasil — user: ${user}`, 'success');
      showDashboard(user);

    } else {
      // FAIL
      const newAttempts = attempts + 1;
      localStorage.setItem('admin_attempts', newAttempts);
      logSecurityEvent(`Login gagal — percobaan ${newAttempts}/${MAX_ATTEMPTS} (user: ${user})`, 'warn');

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_MS;
        localStorage.setItem('admin_lockout', lockUntil);
        localStorage.setItem('admin_attempts', '0');
        logSecurityEvent(`Akun dikunci selama 30 detik setelah ${MAX_ATTEMPTS} percobaan`, 'error');
        showLockout(lockUntil);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        errEl.textContent = `✗ Username atau password salah. Sisa percobaan: ${remaining}`;
        document.getElementById('attemptsInfo').textContent =
          `Percobaan ${newAttempts}/${MAX_ATTEMPTS}`;
        generateCaptcha();
      }

      btnEl.disabled = false;
      btnEl.textContent = 'Masuk ke Dashboard';
    }
  });

  // ── PASSWORD TOGGLE ──
  const pwToggle = document.getElementById('pwToggle');
  const pwInput  = document.getElementById('adminPass');
  if (pwToggle && pwInput) {
    pwToggle.addEventListener('click', () => {
      const isPass = pwInput.type === 'password';
      pwInput.type = isPass ? 'text' : 'password';
      pwToggle.textContent = isPass ? '🙈' : '👁';
    });
  }
});

// ── GENERATE CAPTCHA ──
function generateCaptcha() {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const ops = ['+', '−', '×'];
  const op  = ops[Math.floor(Math.random() * ops.length)];
  captchaAnswer = op === '+' ? a + b : op === '−' ? a - b : a * b;
  const el = document.getElementById('capQ');
  if (el) el.textContent = `${a} ${op} ${b}`;
  const input = document.getElementById('capAns');
  if (input) input.value = '';
}

// ── LOCKOUT DISPLAY ──
function showLockout(until) {
  const warn = document.getElementById('lockoutWarn');
  const timerEl = document.getElementById('lockTimer');
  const errEl   = document.getElementById('loginErr');
  const btnEl   = document.getElementById('loginBtn');

  if (warn) warn.style.display = 'block';
  if (errEl) errEl.textContent = '';
  if (btnEl) { btnEl.disabled = true; }

  const countdown = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    if (timerEl) timerEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(countdown);
      if (warn) warn.style.display = 'none';
      if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Masuk ke Dashboard'; }
      generateCaptcha();
    }
  }, 1000);
}

// ── SHOW DASHBOARD ──
function showDashboard(username) {
  const loginWrap = document.getElementById('loginWrap');
  const dashboard = document.getElementById('dashboard');
  if (loginWrap) loginWrap.style.display = 'none';
  if (dashboard) {
    dashboard.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Populate dashboard
    const dashUser = document.getElementById('dashUser');
    const dashTime = document.getElementById('dashTime');
    if (dashUser) dashUser.textContent = username;
    if (dashTime) dashTime.textContent = new Date().toLocaleString('id-ID');

    // Fake view count
    const views = Math.floor(Math.random() * 340) + 80;
    const dsViews = document.getElementById('ds-views');
    if (dsViews) dsViews.textContent = views;

    // Fake message count
    const msgs = Math.floor(Math.random() * 8);
    const dsMsgs = document.getElementById('ds-messages');
    if (dsMsgs) dsMsgs.textContent = msgs;

    // Security log
    loadSecurityLog();
  }

  // ── PANEL NAVIGATION ──
  document.querySelectorAll('.dn-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.dn-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      link.classList.add('active');
      const panel = document.getElementById('panel-' + link.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  // ── LOGOUT ──
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin logout?')) {
        logSecurityEvent('Logout oleh user: ' + username, 'info');
        sessionStorage.clear();
        window.location.reload();
      }
    });
  }
}

// ── LOAD SECURITY LOG ──
function loadSecurityLog() {
  const logEl = document.getElementById('secLog');
  if (!logEl) return;
  const logs = getSecurityLog();
  if (logs.length === 0) {
    logEl.innerHTML = '<div class="sec-log-item">Belum ada aktivitas tercatat.</div>';
    return;
  }
  logEl.innerHTML = logs.map(l => `
    <div class="sec-log-item">
      <span style="color:${l.level==='error'?'#ff8a80':l.level==='warn'?'#ffcc80':l.level==='success'?'#a5d6a7':'#90a4ae'}">
        [${l.level.toUpperCase()}]
      </span>
      <span>${l.time}</span>
      <span style="flex:1">${l.event}</span>
    </div>
  `).join('');
}
