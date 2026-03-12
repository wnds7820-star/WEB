// =============================================
//  features.js — Cuaca, Grafik, Background
// =============================================

// ════════════════════════════════════════════
//  1. CUACA REAL-TIME SEMARANG
// ════════════════════════════════════════════
async function loadWeather() {
  const widget = document.getElementById('weatherWidget');
  if (!widget) return;

  try {
    // Open-Meteo API — gratis, no key, akurat
    // Semarang: lat=-6.9667, lon=110.4167
    const url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=-6.9667&longitude=110.4167' +
      '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature' +
      '&hourly=temperature_2m,precipitation_probability' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
      '&timezone=Asia%2FBangkok&forecast_days=5';

    const res  = await fetch(url);
    const data = await res.json();
    const c    = data.current;
    const d    = data.daily;

    const icon  = weatherIcon(c.weather_code);
    const desc  = weatherDesc(c.weather_code);
    const now   = new Date();
    const jam   = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const tgl   = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

    widget.innerHTML = `
      <div class="ww-main">
        <div class="ww-top">
          <div class="ww-loc">
            <span class="ww-city">📍 Semarang</span>
            <span class="ww-time">${tgl} · ${jam}</span>
          </div>
          <div class="ww-live-dot"></div>
        </div>
        <div class="ww-center">
          <div class="ww-icon">${icon}</div>
          <div class="ww-temp-wrap">
            <span class="ww-temp">${Math.round(c.temperature_2m)}°C</span>
            <span class="ww-feel">Terasa ${Math.round(c.apparent_temperature)}°C</span>
            <span class="ww-desc">${desc}</span>
          </div>
        </div>
        <div class="ww-details">
          <div class="ww-detail"><span>💧</span><span>${c.relative_humidity_2m}%</span><span>Kelembapan</span></div>
          <div class="ww-detail"><span>💨</span><span>${Math.round(c.wind_speed_10m)} km/h</span><span>Angin</span></div>
          <div class="ww-detail"><span>🌡️</span><span>${Math.round(d.temperature_2m_min[0])}–${Math.round(d.temperature_2m_max[0])}°C</span><span>Hari ini</span></div>
        </div>
        <div class="ww-forecast">
          ${d.temperature_2m_max.slice(1,5).map((max, i) => {
            const day = new Date();
            day.setDate(day.getDate() + i + 1);
            const nama = day.toLocaleDateString('id-ID', { weekday: 'short' });
            return `<div class="ww-day">
              <span>${nama}</span>
              <span>${weatherIcon(0)}</span>
              <span>${Math.round(d.temperature_2m_min[i+1])}–${Math.round(max)}°</span>
            </div>`;
          }).join('')}
        </div>
      </div>`;

    // Update grafik cuaca
    renderWeatherChart(data.hourly);

  } catch (e) {
    widget.innerHTML = `
      <div class="ww-error">
        <span>🌤️</span>
        <p>Semarang, Jawa Tengah</p>
        <small>Data cuaca tidak tersedia saat ini</small>
      </div>`;
  }
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2)  return '⛅';
  if (code <= 3)  return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌧️';
  if (code <= 67) return '🌨️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}
function weatherDesc(code) {
  if (code === 0)  return 'Cerah';
  if (code <= 2)   return 'Sebagian Berawan';
  if (code <= 3)   return 'Mendung';
  if (code <= 49)  return 'Berkabut';
  if (code <= 59)  return 'Gerimis';
  if (code <= 67)  return 'Hujan';
  if (code <= 77)  return 'Hujan Salju';
  if (code <= 82)  return 'Hujan Deras';
  if (code <= 86)  return 'Salju Lebat';
  if (code <= 99)  return 'Badai Petir';
  return 'Cerah';
}

// Auto-refresh cuaca setiap 10 menit
setInterval(loadWeather, 10 * 60 * 1000);


// ════════════════════════════════════════════
//  2. GRAFIK (Chart.js via CDN)
// ════════════════════════════════════════════

function loadChartJS(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  s.onload = cb;
  document.head.appendChild(s);
}

// -- GRAFIK CUACA (12 jam ke depan)
function renderWeatherChart(hourly) {
  loadChartJS(() => {
    const canvas = document.getElementById('weatherChartCanvas');
    if (!canvas) return;
    const now = new Date().getHours();
    const labels = hourly.time.slice(now, now + 12).map(t =>
      new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    );
    const temps = hourly.temperature_2m.slice(now, now + 12);
    const precs = hourly.precipitation_probability.slice(now, now + 12);

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    new Chart(canvas, {
      data: {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Suhu (°C)',
            data: temps,
            borderColor: '#c0392b',
            backgroundColor: 'rgba(192,57,43,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'Peluang Hujan (%)',
            data: precs,
            backgroundColor: 'rgba(13,27,42,0.5)',
            borderColor: 'rgba(201,168,76,0.7)',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } } }
        },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y:  { position: 'left',  ticks: { color: 'rgba(192,57,43,0.8)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y1: { position: 'right', ticks: { color: 'rgba(201,168,76,0.7)', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });
  });
}

// -- GRAFIK STATISTIK ARTIKEL
function renderArticleChart() {
  loadChartJS(() => {
    const canvas = document.getElementById('articleChartCanvas');
    if (!canvas) return;
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Asia Tenggara','Eropa','Indo-Pasifik','Timur Tengah','Afrika','Amerika Latin'],
        datasets: [{
          data: [67, 55, 42, 38, 31, 29],
          backgroundColor: ['#c0392b','#c9a84c','#0f3460','#2d6a4f','#7b2d00','#533483'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 }, padding: 12 }
          }
        }
      }
    });
  });
}

// -- GRAFIK TREN PENGUNJUNG
function renderVisitorChart() {
  loadChartJS(() => {
    const canvas = document.getElementById('visitorChartCanvas');
    if (!canvas) return;
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const months = ['Okt','Nov','Des','Jan','Feb','Mar'];
    const visitors = [4200, 5800, 7100, 6500, 8900, 11200];
    const reads    = [1800, 2400, 3100, 2700, 4100, 5600];

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Pengunjung',
            data: visitors,
            borderColor: '#c9a84c',
            backgroundColor: 'rgba(201,168,76,0.12)',
            fill: true, tension: 0.5, pointRadius: 4
          },
          {
            label: 'Pembaca Artikel',
            data: reads,
            borderColor: '#c0392b',
            backgroundColor: 'rgba(192,57,43,0.08)',
            fill: true, tension: 0.5, pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } } }
        },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
        }
      }
    });
  });
}

// -- GRAFIK KAWASAN BAR
function renderRegionBarChart() {
  loadChartJS(() => {
    const canvas = document.getElementById('regionBarCanvas');
    if (!canvas) return;
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['ASEAN','Eropa','Indo-Pasifik','Timur Tengah','Afrika','Am. Latin'],
        datasets: [{
          label: 'Jumlah Artikel',
          data: [67, 55, 42, 38, 31, 29],
          backgroundColor: [
            'rgba(192,57,43,0.8)','rgba(201,168,76,0.8)','rgba(15,52,96,0.8)',
            'rgba(45,106,79,0.8)','rgba(123,45,0,0.8)','rgba(83,52,131,0.8)'
          ],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } }, grid: { display: false } },
          y: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  });
}

// Render semua grafik saat section terlihat
const chartObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      renderArticleChart();
      renderVisitorChart();
      renderRegionBarChart();
      chartObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
  const sec = document.getElementById('grafik');
  if (sec) chartObs.observe(sec);
  loadWeather();
});


// ════════════════════════════════════════════
//  3. BACKGROUND SELECTOR (Video + Image)
// ════════════════════════════════════════════

const BG_PRESETS = [
  { id: 'default',    label: 'Default Navy',   type: 'color', value: '#0d1b2a' },
  { id: 'midnight',   label: 'Midnight',       type: 'color', value: 'linear-gradient(135deg,#0a0a0a,#1a1a2e)' },
  { id: 'forest',     label: 'Forest Dark',    type: 'color', value: 'linear-gradient(135deg,#0b3d0b,#1a2f1a)' },
  { id: 'deep-red',   label: 'Deep Red',       type: 'color', value: 'linear-gradient(135deg,#2d0000,#1a0a0a)' },
  { id: 'ocean',      label: 'Deep Ocean',     type: 'color', value: 'linear-gradient(135deg,#001a33,#003366)' },
  { id: 'upload-img', label: '🖼️ Upload Foto', type: 'upload-img' },
  { id: 'upload-vid', label: '🎬 Upload Video', type: 'upload-vid' },
  { id: 'youtube',    label: '▶️ Link YouTube', type: 'youtube' },
];

let bgVideoEl = null;

function initBgSelector() {
  const panel = document.getElementById('bgPanel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="bgp-header">
      <span>🎨 Latar Belakang</span>
      <button class="bgp-close" onclick="toggleBgPanel()">✕</button>
    </div>
    <div class="bgp-grid">
      ${BG_PRESETS.map(p => `
        <button class="bgp-item" data-id="${p.id}" title="${p.label}">
          <div class="bgp-preview" style="${p.type === 'color' ? `background:${p.value}` : 'background:#333'}">
            ${p.type !== 'color' ? `<span>${p.label.split(' ')[0]}</span>` : ''}
          </div>
          <span>${p.label}</span>
        </button>
      `).join('')}
    </div>
    <div class="bgp-opacity">
      <label>Kecerahan Overlay: <span id="opacityVal">60</span>%</label>
      <input type="range" id="overlayOpacity" min="0" max="90" value="60">
    </div>
    <div class="bgp-extra" id="bgExtra"></div>
  `;

  // Preset click
  panel.querySelectorAll('.bgp-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = BG_PRESETS.find(p => p.id === btn.dataset.id);
      if (!preset) return;

      panel.querySelectorAll('.bgp-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (preset.type === 'color') {
        setHeroBg({ type: 'color', value: preset.value });
        document.getElementById('bgExtra').innerHTML = '';
      } else if (preset.type === 'upload-img') {
        showUploadPrompt('img');
      } else if (preset.type === 'upload-vid') {
        showUploadPrompt('vid');
      } else if (preset.type === 'youtube') {
        showYoutubePrompt();
      }
    });
  });

  // Opacity slider
  document.getElementById('overlayOpacity').addEventListener('input', e => {
    document.getElementById('opacityVal').textContent = e.target.value;
    const overlay = document.querySelector('#hero .hero-overlay');
    if (overlay) overlay.style.opacity = e.target.value / 100;
  });
}

function showUploadPrompt(type) {
  const extra = document.getElementById('bgExtra');
  if (type === 'img') {
    extra.innerHTML = `
      <div class="bgp-upload-area" id="imgUploadArea">
        <input type="file" id="bgImgInput" accept="image/*" style="display:none">
        <label for="bgImgInput" class="bgp-upload-label">
          🖼️ Klik atau seret foto di sini<br>
          <small>JPG, PNG, WebP — maks 10MB</small>
        </label>
      </div>`;
    document.getElementById('bgImgInput').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { alert('File terlalu besar (maks 10MB)'); return; }
      const url = URL.createObjectURL(file);
      setHeroBg({ type: 'image', value: url });
    });
  } else {
    extra.innerHTML = `
      <div class="bgp-upload-area">
        <input type="file" id="bgVidInput" accept="video/*" style="display:none">
        <label for="bgVidInput" class="bgp-upload-label">
          🎬 Klik atau seret video di sini<br>
          <small>MP4, WebM — maks 100MB</small>
        </label>
      </div>`;
    document.getElementById('bgVidInput').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 100 * 1024 * 1024) { alert('File terlalu besar (maks 100MB)'); return; }
      const url = URL.createObjectURL(file);
      setHeroBg({ type: 'video', value: url });
    });
  }
}

function showYoutubePrompt() {
  const extra = document.getElementById('bgExtra');
  extra.innerHTML = `
    <div class="bgp-yt-wrap">
      <label>ID atau URL YouTube:</label>
      <div class="bgp-yt-row">
        <input type="text" id="ytInput" placeholder="Contoh: dQw4w9WgXcQ atau https://youtu.be/...">
        <button id="ytApplyBtn">Terapkan</button>
      </div>
      <small>Video YouTube tidak bisa diputar langsung. Gunakan sebagai embed iframe.</small>
    </div>`;
  document.getElementById('ytApplyBtn').addEventListener('click', () => {
    let val = document.getElementById('ytInput').value.trim();
    // Extract ID from URL
    const match = val.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (match) val = match[1];
    if (val.length !== 11) { alert('ID YouTube tidak valid (harus 11 karakter)'); return; }
    setHeroBg({ type: 'youtube', value: val });
  });
}

function setHeroBg(config) {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Remove existing video
  if (bgVideoEl) { bgVideoEl.remove(); bgVideoEl = null; }
  const existYt = hero.querySelector('.yt-bg-frame');
  if (existYt) existYt.remove();

  hero.style.background = '';

  if (config.type === 'color') {
    hero.style.background = config.value;
  } else if (config.type === 'image') {
    hero.style.background = `url(${config.value}) center/cover no-repeat`;
  } else if (config.type === 'video') {
    bgVideoEl = document.createElement('video');
    bgVideoEl.src = config.value;
    bgVideoEl.autoplay = true;
    bgVideoEl.muted = true;
    bgVideoEl.loop = true;
    bgVideoEl.playsInline = true;
    bgVideoEl.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;';
    hero.insertBefore(bgVideoEl, hero.firstChild);
  } else if (config.type === 'youtube') {
    const iframe = document.createElement('iframe');
    iframe.className = 'yt-bg-frame';
    iframe.src = `https://www.youtube.com/embed/${config.value}?autoplay=1&mute=1&loop=1&playlist=${config.value}&controls=0&showinfo=0&rel=0&enablejsapi=1`;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.style.cssText = 'position:absolute;inset:-60px -100px;width:calc(100%+200px);height:calc(100%+120px);border:none;z-index:0;pointer-events:none;';
    hero.insertBefore(iframe, hero.firstChild);
  }

  // Ensure overlay still on top
  const overlay = hero.querySelector('.hero-overlay');
  if (overlay) overlay.style.zIndex = '1';
  const heroBgEl = hero.querySelector('.hero-bg-world');
  if (heroBgEl) heroBgEl.style.zIndex = '1';
}

window.toggleBgPanel = function() {
  const panel = document.getElementById('bgPanel');
  if (!panel) return;
  panel.classList.toggle('open');
};

document.addEventListener('DOMContentLoaded', () => {
  initBgSelector();

  // Drag & drop on hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('dragover', e => e.preventDefault());
    hero.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video/')) {
        setHeroBg({ type: 'video', value: url });
      } else if (file.type.startsWith('image/')) {
        setHeroBg({ type: 'image', value: url });
      }
    });
  }
});
