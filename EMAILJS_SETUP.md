# CARA MENGAKTIFKAN KIRIM PESAN OTOMATIS KE EMAIL

Form kontak sudah terhubung ke EmailJS. Ikuti langkah-langkah berikut:

## 1. Daftar di EmailJS
Buka: https://www.emailjs.com/
Daftar gratis (200 email/bulan gratis)

## 2. Buat Email Service
- Dashboard → "Email Services" → "Add New Service"
- Pilih "Gmail"
- Hubungkan akun Gmail: wnds7820@gmail.com
- Catat **Service ID** (contoh: service_abc123)

## 3. Buat Email Template
- Dashboard → "Email Templates" → "Create New Template"
- Isi template seperti ini:
  - Subject: `[DELY Sejarah] {{subject}} - dari {{from_name}}`
  - Konten:
    ```
    Pesan baru dari website DELY Sejarah Dunia:
    
    Nama     : {{from_name}}
    Email    : {{reply_to}}
    Keperluan: {{subject}}
    
    Pesan:
    {{message}}
    ```
- Pastikan "To Email" diset ke: wnds7820@gmail.com
- Catat **Template ID** (contoh: template_xyz789)

## 4. Ambil Public Key
- Dashboard → Account → "Public Key"
- Catat kuncinya

## 5. Isi ke index.html
Buka `index.html`, cari baris berikut (sekitar baris 855):

```javascript
const EMAILJS_SERVICE_ID  = 'service_dely';      // ← Ganti dengan Service ID Anda
const EMAILJS_TEMPLATE_ID = 'template_dely';     // ← Ganti dengan Template ID Anda
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← Ganti dengan Public Key Anda
```

Ganti nilainya dengan ID yang didapat dari langkah di atas.

## Catatan
- Sebelum dikonfigurasi, form tetap berfungsi via fallback mailto:
  (akan membuka aplikasi email default pengguna)
- Setelah dikonfigurasi dengan benar, pesan langsung masuk ke inbox Gmail
