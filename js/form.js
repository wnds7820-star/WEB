// form.js — Contact form with CAPTCHA & validation
document.addEventListener('DOMContentLoaded', () => {
  // ── GENERATE CAPTCHA ──
  let captchaAns = 0;
  function genCap() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    captchaAns = a + b;
    const q = document.getElementById('captchaQ');
    if (q) q.textContent = `${a} + ${b}`;
    const inp = document.getElementById('captchaAns');
    if (inp) inp.value = '';
  }
  genCap();

  // ── FORM SUBMIT ──
  const form = document.getElementById('kontakForm');
  if (!form) return;

  const formLoadTime = Date.now();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok  = document.getElementById('formOk');
    const err = document.getElementById('formErr');

    // Rate limit: max 3 per 5 menit
    if (typeof checkRateLimit === 'function') {
      if (!checkRateLimit('contact_form', 3, 5 * 60 * 1000)) {
        err.textContent = '✗ Terlalu banyak pengiriman. Coba lagi dalam beberapa menit.';
        err.style.display = 'block';
        setTimeout(() => err.style.display = 'none', 5000);
        return;
      }
    }

    // Anti-spam: too fast
    if (Date.now() - formLoadTime < 3000) {
      err.textContent = '✗ Pengiriman terlalu cepat. Mohon isi form dengan lengkap.';
      err.style.display = 'block';
      setTimeout(() => err.style.display = 'none', 4000);
      return;
    }

    // Captcha
    const capInput = parseInt(document.getElementById('captchaAns').value);
    if (capInput !== captchaAns) {
      err.textContent = '✗ Jawaban verifikasi salah. Coba lagi.';
      err.style.display = 'block';
      ok.style.display  = 'none';
      genCap();
      if (typeof logSecurityEvent === 'function')
        logSecurityEvent('Form kontak: captcha salah', 'warn');
      setTimeout(() => err.style.display = 'none', 4000);
      return;
    }

    // Validation
    const name    = sanitize ? sanitize(form.querySelector('input[type="text"]').value) : form.querySelector('input[type="text"]').value;
    const email   = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    if (typeof validateName === 'function' && !validateName(name)) {
      err.textContent = '✗ Nama tidak valid.'; err.style.display = 'block';
      setTimeout(() => err.style.display = 'none', 3000); return;
    }
    if (typeof validateEmail === 'function' && !validateEmail(email)) {
      err.textContent = '✗ Email tidak valid.'; err.style.display = 'block';
      setTimeout(() => err.style.display = 'none', 3000); return;
    }
    if (message.trim().length < 10) {
      err.textContent = '✗ Pesan terlalu pendek (min. 10 karakter).'; err.style.display = 'block';
      setTimeout(() => err.style.display = 'none', 3000); return;
    }

    // SUCCESS
    const btn = form.querySelector('.btn-kirim span');
    if (btn) { btn.textContent = 'Mengirim...'; }
    setTimeout(() => {
      ok.style.display  = 'block';
      err.style.display = 'none';
      if (btn) btn.textContent = 'Kirim Pesan';
      form.reset();
      genCap();
      if (typeof logSecurityEvent === 'function')
        logSecurityEvent(`Pesan kontak dikirim oleh: ${email}`);
      setTimeout(() => ok.style.display = 'none', 7000);
    }, 1000);
  });
});
