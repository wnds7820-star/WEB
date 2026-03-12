# 🌐 DELY — Pengamat Politik Dunia
Website resmi pengamat politik dunia DELY dengan sistem keamanan lengkap.

---

## 📁 Struktur Folder Lengkap

```
dely-politik/
│
├── index.html                ← Halaman utama
│
├── css/
│   ├── style.css             ← Styling utama (warna, layout, komponen)
│   ├── animations.css        ← Animasi scroll reveal & hero
│   ├── responsive.css        ← Layout mobile & tablet
│   ├── admin.css             ← Styling halaman admin & dashboard
│   └── artikel.css           ← Styling halaman artikel detail
│
├── js/
│   ├── security.js           ← 🛡️ Layer keamanan frontend (XSS, CSP, dll)
│   ├── main.js               ← Navbar, cursor, scroll, animasi umum
│   ├── animations.js         ← Scroll reveal IntersectionObserver
│   ├── filter.js             ← Filter artikel berdasarkan kawasan
│   ├── counter.js            ← Animasi angka statistik
│   ├── form.js               ← Form kontak + CAPTCHA + validasi
│   └── admin.js              ← Sistem login admin + dashboard
│
├── pages/
│   ├── admin.html            ← 🔐 Halaman login & dashboard admin
│   ├── artikel.html          ← Halaman detail artikel
│   ├── privacy.html          ← Kebijakan privasi
│   ├── 404.html              ← Halaman error 404
│   └── (terms.html)          ← [Bisa ditambahkan]
│
├── data/
│   └── articles.json         ← Data artikel dalam format JSON
│
├── security/
│   ├── .htaccess             ← Aturan keamanan server Apache
│   └── config.json           ← Referensi konfigurasi keamanan
│
├── assets/
│   ├── img/                  ← Foto & gambar
│   └── icons/                ← Ikon-ikon website
│
└── README.md                 ← Dokumentasi ini
```

---

## 🛡️ Sistem Keamanan yang Diterapkan

### Frontend (js/security.js)
| Fitur | Keterangan |
|-------|-----------|
| **XSS Sanitizer** | Membersihkan semua input dari karakter berbahaya |
| **Clickjacking Protection** | Blokir website dimuat dalam iframe orang lain |
| **Content Security Policy** | Batasi sumber script, style, dan font |
| **Rate Limiter** | Batasi pengiriman form (maks 3x per 5 menit) |
| **Anti-Spam** | Deteksi pengiriman terlalu cepat (honeypot waktu) |
| **Session Token** | Token unik per sesi login (crypto.getRandomValues) |
| **Auto Session Expiry** | Logout otomatis setelah 15 menit tidak aktif |
| **DevTools Detection** | Deteksi pembukaan DevTools browser |
| **Security Event Logger** | Catat semua aktivitas mencurigakan |
| **Input Validator** | Validasi email, nomor HP, nama |

### Admin (js/admin.js)
| Fitur | Keterangan |
|-------|-----------|
| **Max Login Attempts** | Maks 5 percobaan sebelum dikunci 30 detik |
| **Account Lockout** | Kunci akun otomatis jika melebihi batas |
| **CAPTCHA Aritmatika** | Verifikasi manusia sebelum login |
| **SHA-256 Hashing** | Password di-hash via Web Crypto API |
| **Session Management** | Token sesi + waktu kedaluwarsa |
| **Dashboard Navigasi** | Panel: Overview, Artikel, Pesan, Keamanan, SEO |

### Server (.htaccess)
| Fitur | Keterangan |
|-------|-----------|
| **Block Sensitive Files** | Larang akses langsung ke .json, .log, .sql |
| **Directory Listing OFF** | Sembunyikan daftar file di server |
| **Security Headers** | X-Frame-Options, HSTS, X-XSS-Protection |
| **Force HTTPS** | Redirect otomatis HTTP → HTTPS |
| **Block Bad Bots** | Blokir scanner seperti Nikto, SQLmap |
| **SQLi Pattern Block** | Blokir query string berbahaya |
| **Anti Hotlinking** | Cegah gambar dibajak situs lain |

---

## 🚀 Cara Buka di VS Code

1. Extract ZIP → buka folder `dely-politik`
2. **File → Open Folder** di VS Code
3. Install extension **Live Server**
4. Klik kanan `index.html` → **Open with Live Server**

---

## 🔐 Cara Login Admin

1. Buka `pages/admin.html`
2. Username: `dely_admin`
3. Password: `admin123` (demo) atau `Dely@Admin2025!`
4. Jawab CAPTCHA aritmatika
5. Klik "Masuk ke Dashboard"

> ⚠️ **Ganti password sebelum deploy ke internet!**

---

## ✏️ Ganti Konten DELY

Buka `index.html`, cari dan ganti:

| Teks Lama | Ganti Dengan |
|-----------|-------------|
| `dely@politikdunia.id` | Email kamu |
| `+62 812 0000 0001` | Nomor HP kamu |
| `Jakarta, Indonesia` | Kota kamu |
| `politikdunia.id` | Domain website kamu |

---

## 🎨 Ganti Warna Tema

Di `css/style.css`, ubah variabel:
```css
:root {
  --navy:  #0d1b2a;   /* Biru gelap utama */
  --red:   #c0392b;   /* Merah aksen      */
  --gold:  #c9a84c;   /* Emas aksen       */
}
```

---

© 2025 DELY — Pengamat Politik Dunia
