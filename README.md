# 🌾 Rekomendasi Pemupukan Presisi Padi (Kabupaten Lampung Utara)

[![Deploy Web Demo to GitHub Pages](https://github.com/afifuddin212/pupuk-presisi-padi/actions/workflows/deploy.yml/badge.svg)](https://github.com/afifuddin212/pupuk-presisi-padi/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-emerald?style=flat&logo=github)](https://afifuddin212.github.io/pupuk-presisi-padi/)
[![Regulation](https://img.shields.io/badge/Dasar%20Regulasi-Permentan%20No.%2013%2F2022-amber)](rekomendasi_pemupukan_presisi_padi_terpadu.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplikasi Web Progressive Web App (PWA) dan Native Android Container (*offline-first*) untuk **kalkulasi rekomendasi dosis pemupukan presisi tanaman padi (Padi Sawah & Padi Gogo)**, **analisis kesesuaian lahan**, **karakteristik tanah (SPT)**, serta **perekaman geospasial titik survei lahan pertanian** di **23 Kecamatan Kabupaten Lampung Utara, Provinsi Lampung**.

Aplikasi ini dikembangkan mengacu pada standar resmi **Peraturan Menteri Pertanian Republik Indonesia No. 13 Tahun 2022**, pedoman teknis **Perangkat Uji Tanah Sawah (PUTS)**, pedoman **Perangkat Uji Tanah Kering (PUTK / BRMP)**, peta kesesuaian lahan **BBSDLP**, standar ergonomi **Material Design 3 (48×48dp touch targets)**, keterbacaan kontras tinggi luar ruangan (*outdoor high-contrast*), dan manajemen hemat daya baterai GPS perangkat.

---

## 📌 Tautan & Dokumen Acuan Resmi
* **Live Demo Aplikasi (GitHub Pages)**: [https://afifuddin212.github.io/pupuk-presisi-padi/](https://afifuddin212.github.io/pupuk-presisi-padi/)
* **Repositori GitHub**: [https://github.com/afifuddin212/pupuk-presisi-padi](https://github.com/afifuddin212/pupuk-presisi-padi)
* **Dokumen Acuan Terpadu**: [rekomendasi_pemupukan_presisi_padi_terpadu.md](rekomendasi_pemupukan_presisi_padi_terpadu.md)
* **Tabel Baku Per-Kecamatan**: [rekomendasi-pemupukan-kecamatan-permentan13_2022.md](rekomendasi-pemupukan-kecamatan-permentan13_2022.md)
* **Legenda Kesesuaian Lahan**: [public/base-data/LEGENDA_KESESUAIAN_LAHAN.md](public/base-data/LEGENDA_KESESUAIAN_LAHAN.md)

---

## 🚀 Fitur Utama Sistem

### 1. Manajemen Multi-Layer Geospasial & Peta Tematik Terpadu
Aplikasi mengintegrasikan 5 layer spasial terstandarisasi dengan arsitektur pop-up cerdas agar tidak tumpang tindih (*uncluttered & non-crowded*):
1. **Batas Administrasi Kecamatan**: Garis batas wilayah 23 kecamatan di Lampung Utara yang ditampilkan sebagai outline tipis tanpa fill (`fill: false`) untuk menjaga kejernihan citra satelit dan jalan.
2. **Peta Rekomendasi Pemupukan Padi**: Menampilkan sebaran rekomendasi 23 kecamatan. Data makro spasial InaSoilAgro Lampung Utara memiliki status hara makro yang seragam (P: Rendah, K: Tinggi) sehingga ditampilkan dengan warna transparan lembut beraksen hijau zamrud, serta highlight emas saat kecamatan dipilih.
3. **Peta Kesesuaian Lahan Padi (BBSDLP)**: Menampilkan tingkat kesesuaian lahan untuk 3 sub-komoditas padi (*Padi Sawah Irigasi, Padi Sawah Tadah Hujan, Padi Gogo*) berdasarkan kriteria FAO/Kementan:
   - `S1`: Sangat Sesuai (`#1a9850`)
   - `S2`: Cukup Sesuai (`#a6d96a`)
   - `S3`: Sesuai Marginal (`#fee08b`)
   - `N`: Tidak Sesuai (`#d73027`)
   - Dilengkapi rincian faktor pembatas biofisik (*temperatur `tc`, retensi hara `nr`, ketersediaan hara `na`, media perakaran `rc`, bahaya erosi `eh`*) dan saran tindakan agronomis.
4. **Peta Lahan Baku Sawah (LBS)**: Menampilkan sebaran petak sawah baku riil dengan 4 kelas simbologi (`Irigasi`, `Tadah Hujan`, `Rawa/Lebak`, `Non Irigasi`).
5. **Peta Satuan Peta Tanah (Jenis Tanah / SPT)**: Menggunakan simbologi ilmiah berdasarkan **Jenis Tanah Utama (`TANAH_1`)** (*Latosol Umbrik/Kromik/Haplik/Oksik, Kambisol Gleik/Distrik/Kromik, Litosol*) dan menguraikan kode SPT, taksonomi USDA, tekstur tanah, pH, KTK, KB, relief, lereng, dan drainase saat diklik.

### 2. Lembar Informasi Terpadu (Unified Contextual Sheet)
- **Bebas Crowding**: Klik pada peta memicu lembar informasi terpadu yang dapat beralih cepat antar mode (*Rekomendasi Pemupukan*, *Kesesuaian Lahan*, *Jenis Tanah SPT*) tanpa memunculkan banyak dialog yang saling bertumpuk.
- **Deteksi Petak Sawah LBS**: Jika titik berada di dalam petak sawah baku, informasi jenis sawah dan luas petak langsung disematkan sebagai chip ringkas di bagian atas.
- **4 Opsi Rekomendasi Pemupukan Per-Kecamatan**:
  1. **InaSoilAgro**: Rekomendasi bawaan atribut spasial.
  2. **Permentan 13/2022 (Baku Kecamatan)**: Ketetapan baku tabel Lampiran A Permentan 13/2022.
  3. **PUTS (Padi Sawah)**: Formula uji tanah sawah presisi.
  4. **PUTK (Padi Gogo)**: Formula pemupukan lahan kering masam dengan kebutuhan fosfat tinggi.
- **Tabel Perbandingan Langsung (*Bandingkan Semua*)**: Menampilkan matriks komparasi 4 metode dalam satu tampilan ringkas.

### 3. Kalkulator Pemupukan Presisi Multi-Metode
- **Pilihan Komoditas / Lahan**: Padi Sawah (Irigasi/Basah) vs Padi Gogo (Kering Masam).
- **Pilihan Metode**: Permentan 13/2022, PUTS, PUTK.
- **Wajib SP-36 Tambahan pada Padi Gogo (Paket Majemuk)**:
  - Tanah kering masam memiliki tingkat fiksasi fosfat yang sangat tinggi oleh ion Al³⁺ dan Fe³⁺, sedangkan pupuk subsidi NPK 15-10-12 hanya mengandung 10% fosfat.
  - Sistem menampilkan kotak dosis output: **SP-36 Tambahan** dengan keterangan yang tegas:  
    *"Petani harus memberikan SP-36 Tambahan: [X] kg untuk menutup defisit fosfat tanah masam."*
- **Kalkulasi Luas Petak Bebas (Hektar)**: Menghasilkan output kebutuhan riil petak petani ($\text{kg}$) dan dosis baku per hektar ($\text{kg/ha}$).

### 4. Perekaman Titik Survei & Dual-Pipeline Pengiriman Data
- **Penyimpanan Lokal Persisten (IndexedDB)**: Bekerja 100% offline di tengah pematang sawah tanpa sinyal seluler.
- **KIRIM DATA SURVEI**:
  - Berbagi instan via **WhatsApp & Android Native Share** (melampirkan CSV dan GeoJSON).
  - Sinkronisasi instan via **Webhook Google Apps Script** langsung ke spreadsheet tim peneliti.

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
