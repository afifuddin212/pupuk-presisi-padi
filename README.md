# 🌾 Rekomendasi Pemupukan Presisi Padi (Kabupaten Lampung Utara)

[![Deploy Web Demo to GitHub Pages](https://github.com/afifuddin212/pupuk-presisi-padi/actions/workflows/deploy.yml/badge.svg)](https://github.com/afifuddin212/pupuk-presisi-padi/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-emerald?style=flat&logo=github)](https://afifuddin212.github.io/pupuk-presisi-padi/)
[![Regulation](https://img.shields.io/badge/Dasar%20Regulasi-Permentan%20No.%2013%2F2022-amber)](rekomendasi_pemupukan_presisi_padi_terpadu.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplikasi Web Progressive Web App (PWA) dan Native Android Container (*offline-first*) untuk **kalkulasi rekomendasi dosis pemupukan presisi tanaman padi (Padi Sawah & Padi Gogo)** serta **perekaman geospasial titik survei lahan pertanian** di **23 Kecamatan Kabupaten Lampung Utara, Provinsi Lampung**.

Aplikasi ini dikembangkan mengacu pada standar resmi **Peraturan Menteri Pertanian Republik Indonesia No. 13 Tahun 2022**, pedoman teknis **Perangkat Uji Tanah Sawah (PUTS)**, pedoman **Perangkat Uji Tanah Kering (PUTK / BRMP)**, standar ergonomi **Material Design 3 (48×48dp touch targets)**, keterbacaan kontras tinggi luar ruangan (*outdoor high-contrast*), dan manajemen hemat daya baterai GPS perangkat.

---

## 📌 Tautan & Dokumen Acuan Resmi
* **Live Demo Aplikasi (GitHub Pages)**: [https://afifuddin212.github.io/pupuk-presisi-padi/](https://afifuddin212.github.io/pupuk-presisi-padi/)
* **Repositori GitHub**: [https://github.com/afifuddin212/pupuk-presisi-padi](https://github.com/afifuddin212/pupuk-presisi-padi)
* **Dokumen Acuan Terpadu**: [rekomendasi_pemupukan_presisi_padi_terpadu.md](rekomendasi_pemupukan_presisi_padi_terpadu.md)
* **Tabel Baku Per-Kecamatan**: [rekomendasi-pemupukan-kecamatan-permentan13_2022.md](rekomendasi-pemupukan-kecamatan-permentan13_2022.md)

---

## 🚀 Fitur Utama Sistem

### 1. Peta GIS Offline & 4 Opsi Rekomendasi Pemupukan Per-Kecamatan
- **Layer 'Peta Rekomendasi Pemupukan Padi'**: Menampilkan batas 23 kecamatan di Lampung Utara dengan label nama kecamatan yang adaptif (otomatis disembunyikan saat zoom out agar tidak menumpuk, dan aktif saat zoom in).
- **Pop-up Multi-Rekomendasi Berbasis Tab**: Saat pengguna mengetuk suatu kecamatan, aplikasi menyajikan **4 opsi rekomendasi pemupukan berimbang** secara ringkas dan tidak membebani (*unoverwhelmed*):
  1. **InaSoilAgro**: Rekomendasi pemupukan bawaan dari atribut data spasial InaSoilAgro.
  2. **Permentan 13/2022 (Baku Kecamatan)**: Ketetapan baku tabel Lampiran A Permentan 13/2022 untuk kecamatan terkait.
  3. **PUTS (Padi Sawah)**: Formula uji tanah sawah presisi dengan referensi status hara P & K dari data spasial kecamatan.
  4. **PUTK (Padi Gogo / Lahan Kering)**: Formula pemupukan lahan kering masam dengan kebutuhan fosfat tinggi.
- **Tabel Perbandingan Langsung (*Bandingkan Semua*)**: Tombol untuk membandingkan keempat opsi dalam tabel komparasi ringkas satu layar.
- **Tombol Pintas ke Kalkulator**: Tombol *"Hitung dengan Luas Petak"* untuk langsung memuat konteks kecamatan, jenis padi, metode, dan hara ke kalkulator.

### 2. Kalkulator Pemupukan Presisi Multi-Metode
- **Pilihan Jenis Tanaman / Lahan**:
  - **Padi Sawah (Lahan Basah / Irigasi)**
  - **Padi Gogo (Lahan Kering Masam)**
- **Filter Pilihan Metode Rekomendasi**:
  - **Permentan 13/2022**: Menggunakan dosis baku tabel per-kecamatan.
  - **PUTS (Perangkat Uji Tanah Sawah)**: Menggunakan status hara P & K (kualitatif atau kuantitatif) + target hasil Urea (250 / 300 / 350 kg/ha) + faktor daur ulang jerami ($\ge 5$ ton/ha).
  - **PUTK (Perangkat Uji Tanah Kering / BRMP)**: Khusus Padi Gogo untuk tanah kering masam.
- **Wajib SP-36 Tambahan pada Padi Gogo (Paket Majemuk)**:
  - Tanah kering masam memiliki tingkat fiksasi fosfat yang sangat tinggi oleh ion Al³⁺ dan Fe³⁺, sedangkan pupuk subsidi NPK 15-10-12 hanya mengandung 10% fosfat.
  - Sistem menampilkan kotak dosis output ketiga: **SP-36 Tambahan** dengan keterangan yang tegas:  
    *"Petani harus memberikan SP-36 Tambahan: [X] kg untuk menutup defisit fosfat tanah masam."*
- **Input Luas Petak Sawah Petani (Hektar)**:
  - Input angka bebas dengan tombol cepat (0.25 ha, 0.5 ha, 0.75 ha, 1 ha, 2 ha).
  - Sistem menyajikan output ganda: **kebutuhan riil petak petani ($\text{kg}$)** dan **dosis baku per hektar ($\text{kg/ha}$)**.

### 3. Perekaman Titik Survei & Dual-Pipeline Pengiriman Data
- **Penyimpanan Lokal Persisten (IndexedDB)**: Bekerja 100% offline di tengah pematang sawah tanpa sinyal seluler.
- **KIRIM DATA SURVEI**:
  - Berbagi instan via **WhatsApp & Android Native Share** (melampirkan CSV dan GeoJSON).
  - Sinkronisasi instan via **Webhook Google Apps Script** langsung ke spreadsheet tim peneliti.
  - Skema data ekspor mencakup: `Jenis Padi`, `Metode Rekomendasi`, `Luas Petak (ha)`, `Urea Tunggal`, `SP-36 Tunggal`, `KCl Tunggal`, `NPK 15-10-12`, `Urea Tambahan`, dan `SP-36 Tambahan`.

---

## 🛠️ Stack Teknologi & Dependensi

| Layer | Pilihan Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite 6 | Kompilasi kilat, pengetikan ketat, dan bundle teroptimasi. |
| **Styling & Ikon** | Tailwind CSS + Lucide Icons | Material Design 3, tema Gelap/Terang, outdoor high-contrast. |
| **GIS & Geospasial** | Leaflet.js + Turf.js | Rendering poligon GeoJSON lokal dan deteksi Point-in-Polygon. |
| **Penyimpanan Offline** | LocalForage (IndexedDB) | Persistensi data survei tanpa batas kuota LocalStorage. |
| **Integrasi Ekspor** | Web Share API & Fetch Webhook | Berbagi data lapangan langsung ke Google Sheets peneliti. |
| **Mobile Runtime** | Capacitor 6 | Siap dibungkus menjadi paket instalasi Android APK mandiri. |

---

## 💻 Panduan Menjalankan Proyek Secara Lokal

```powershell
# 1. Clone repositori
git clone https://github.com/afifuddin212/pupuk-presisi-padi.git
cd pupuk-presisi-padi

# 2. Instal dependensi
npm.cmd install

# 3. Jalankan server pengembangan lokal
npm.cmd run dev

# 4. Bangun berkas produksi
npm.cmd run build
```

---

## 📄 Lisensi & Tim Peneliti
Dikembangkan untuk Tim Peneliti & Penyuluh Pertanian Kabupaten Lampung Utara.  
Lisensi: **MIT License**.
