# Reuni Akbar

Aplikasi registrasi peserta reuni untuk tampilan mobile.

## Fitur

- Form nama lengkap, angkatan, dan nomor HP
- Validasi data singkat
- Nomor undian otomatis
- Kirim pesan WhatsApp berisi nomor undian
- Penyimpanan peserta di browser
- Integrasi opsional ke Google Sheets

## Jalankan secara lokal

```powershell
python -m http.server 4173
```

Buka `http://localhost:4173`.

## Publikasi GitHub Pages

1. Push semua file ke branch `main`.
2. Buka repository di GitHub.
3. Masuk ke **Settings > Pages**.
4. Pada **Source**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`.
6. Simpan. Website akan tersedia melalui URL GitHub Pages repository.

## Penyimpanan ke Google Sheets

Buka `config.js` dan isi `googleScriptUrl` dengan URL Web App dari Google Apps Script. Apps Script dapat menyimpan data ke spreadsheet dan dapat dikembangkan untuk mengirim nomor undian melalui WhatsApp API resmi.

Catatan: form saat ini menyimpan data peserta ke `localStorage` browser. Penyimpanan tersebut bersifat lokal pada perangkat yang membuka halaman dan bukan database bersama.

