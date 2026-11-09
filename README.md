# 🌾 Pupuk Presisi Padi (Kabupaten Lampung Utara)

[![Deploy Web Demo to GitHub Pages](https://github.com/afifuddin212/pupuk-presisi-padi/actions/workflows/deploy.yml/badge.svg)](https://github.com/afifuddin212/pupuk-presisi-padi/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-emerald?style=flat&logo=github)](https://afifuddin212.github.io/pupuk-presisi-padi/)
[![Regulation](https://img.shields.io/badge/Dasar%20Regulasi-Permentan%20No.%2013%2F2022-amber)](rekomendasi_pemupukan_padi_berdasarkan_permentan_no_13_tahun_2022.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplikasi Web Progressive Web App (PWA) dan Native Android Container (*offline-first*) untuk **kalkulasi rekomendasi dosis pemupukan padi sawah presisi** dan **perekaman geospasial titik lahan survei lapangan** di **23 Kecamatan Kabupaten Lampung Utara, Provinsi Lampung**.

Aplikasi ini dikembangkan mengacu pada standar resmi **Peraturan Menteri Pertanian Republik Indonesia No. 13 Tahun 2022**, standar ergonomi lapangan **Material Design 3 (48×48dp touch targets)**, keterbacaan kontras tinggi luar ruangan (*outdoor high-contrast*), dan manajemen hemat daya baterai GPS perangkat.

---

## 📌 Tautan Penting
* **Live Demo Aplikasi (GitHub Pages)**: [https://afifuddin212.github.io/pupuk-presisi-padi/](https://afifuddin212.github.io/pupuk-presisi-padi/)
* **Repositori GitHub**: [https://github.com/afifuddin212/pupuk-presisi-padi](https://github.com/afifuddin212/pupuk-presisi-padi)
* **Ringkasan Regulasi Permentan**: [rekomendasi_pemupukan_padi_berdasarkan_permentan_no_13_tahun_2022.md](rekomendasi_pemupukan_padi_berdasarkan_permentan_no_13_tahun_2022.md)

---

## 🚀 Fitur Utama

### 1. Peta GIS Offline & Deteksi Kecamatan Otomatis
- **Peta Vektor Tematik & Label Nama Kecamatan**: Menampilkan batas 23 kecamatan di Kabupaten Lampung Utara beserta label nama kecamatan permanen yang mudah dibaca (*high-contrast pill label*), serta status rekomendasi hara awal dari file spasial `rekomendasi_pupuk_padi_lampura.geojson`.
- **Pemisahan Sumber Data InaSoilAgro vs Permentan 13/2022**: Layer peta spasial menampilkan data rekomendasi resmi **InaSoilAgro**, sedangkan formula perhitungan interaktif di kalkulator menggunakan acuan resmi **Permentan No. 13 Tahun 2022** untuk menjaga integritas kedua sumber data.
- **Deteksi Spasial Point-in-Polygon (Turf.js)**: Mendeteksi otomatis posisi kecamatan pengguna melalui GPS atau tap manual di peta, serta otomatis mengisi nilai baseline Urea rekomendasi Permentan 13/2022 ($250\text{ kg/ha}$).
- **Pop-up Informasi Multi-Layer Vektor**: Mengetuk poligon kecamatan menampilkan kartu rekomendasi pupuk InaSoilAgro yang bersih, status Fosfor (P) dan Kalium (K), paket tunggal dan majemuk, acuan tanaman jagung/kedelai, serta status layer vektor aktif lainnya (LBS, Kesesuaian Lahan, SPT).
- **Manual Field Location Pick**: Fitur pemilihan koordinat langsung di atas petak sawah dengan visual penanda beranimasi *bounce*.

### 2. Logika Kalkulator Dosis Pupuk Presisi (Permentan No. 13/2022)
- **Metode Kualitatif (PUTS dan PUTK)**: Pemilihan status hara Fosfor (P) dan Kalium (K) langsung (Rendah / Sedang / Tinggi) berdasarkan pengujian cepat bagan warna Perangkat Uji Tanah Sawah (PUTS) atau Perangkat Uji Tanah Kering (PUTK).
- **Metode Kuantitatif (Laboratorium)**: Konversi otomatis hasil analisis kimia tanah laboratorium ($\text{P}_2\text{O}_5$ dan $\text{K}_2\text{O}$ dalam $\text{mg}/100\text{ g}$ tanah) ke kelas hara baku Permentan.
- **Input Luas Petak Sawah Petani (Hektar)**: Petani/penyuluh dapat memasukkan luasan petak sawah riil (misal: 0.25 ha, 0.5 ha, 1.2 ha) dengan tombol pilihan cepat.
- **Pilihan Target Hasil / Urea**: $250\text{ kg/ha}$ (baseline kecamatan), $300\text{ kg/ha}$, atau $350\text{ kg/ha}$.
- **Output Dosis Ganda & Kebutuhan Riil Petak**:
  1. **Paket Pupuk Tunggal**: Urea, SP-36, dan KCl ditampilkan dalam kebutuhan riil petak petani ($\text{kg}$) dan dosis baku per hektar ($\text{kg/ha}$).
  2. **Paket Pupuk Majemuk**: NPK 15-10-12 dan Urea Tambahan ditampilkan dalam kebutuhan riil petak petani ($\text{kg}$) dan dosis baku per hektar ($\text{kg/ha}$).
- **Catatan Edukasi Wajib**: *"CATATAN PENTING: Rekomendasi di atas merupakan acuan resmi Permentan 13/2022. Konsultasikan dengan penyuluh (PPL) setempat."*

### 3. Manajemen Daya Perangkat & Ergonomi Lapangan (Outdoor UI/UX)
- **Tombol Kalkulator Kontras Tinggi (High-Visibility Gold/Amber)**: Tombol aksi utama Kalkulator Pemupukan Presisi diwarnai gradien emas/amber-oranye cerah dengan *beacon pulse* agar sangat mencolok dan mudah dikenali petani di bawah terik sinar matahari sawah.
- **GNSS Hardware Power Governance**: Tombol on/off sensor GPS di HUD atas untuk menghemat daya baterai ponsel saat survei lapangan di bawah terik matahari.
- **Indikator Akurasi Telemetri**: Menampilkan radius akurasi sensor GNSS secara *real-time* dalam satuan meter ($\pm 3.2\text{ m}$).
- **Kompas & Tombol "Lokasi Saya"**: Memusatkan kamera peta langsung ke titik GPS perangkat dengan transisi *flyTo* yang halus.
- **Ergonomi Sentuh Bebas Tumpang Tindih**: Seluruh tombol memenuhi standar target sentuh minimum $48\times 48\text{dp}$ dengan penataan kontrol di area jangkauan jempol (*thumb-zone*).
- **Mode Gelap / Terang**: Switch kontras tinggi untuk memudahkan pembacaan di bawah sinar matahari langsung maupun malam hari.

### 4. Penyimpanan Offline & Ekspor Data Survei Terpadu
- **Penyimpanan Lokal Persisten**: Menyimpan seluruh titik survei, nama pencatat, koordinat, dan waktu ke **IndexedDB** (`localforage`). Data tetap tersimpan meskipun aplikasi ditutup atau tanpa koneksi internet.
- **Dual-Pipeline "KIRIM DATA"**:
  1. **WhatsApp & Android Native Share Intent**: Mengirim seluruh rekapitulasi titik survei secara instan dengan melampirkan berkas **CSV** (buka di Excel) dan **GeoJSON** (buka di QGIS/ArcGIS).
  2. **Webhook Real-Time Google Sheets**: Sinkronisasi data titik survei baru secara otomatis ke Google Spreadsheet tim peneliti saat perangkat mendeteksi koneksi internet (URL webhook tersimpan permanen di `localStorage`).

---

## 🛠️ Stack Teknologi & Dependensi

| Layer | Pilihan Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite 6 | Kompilasi cepat, tipe data ketat, dan ukuran bundle ringan. |
| **CSS & Styling** | Tailwind CSS + Lucide Icons | Desain responsif berbasis utility class dan ikon vektor SVG tajam. |
| **GIS & Mapping** | Leaflet.js + Turf.js (`@turf/boolean-point-in-polygon`) | Rendering layer vektor GeoJSON ringan tanpa ketergantungan API Maps berbayar. |
| **Offline Storage** | LocalForage (IndexedDB fallback ke WebSQL/LocalStorage) | Penyimpanan data survei terstruktur tanpa batasan kuota sempit. |
| **Mobile Packaging** | Capacitor 6 (`@capacitor/core`, `@capacitor/android`) | Jembatan web ke aplikasi Android native APK/AAB. |
| **CI/CD Deployment** | GitHub Actions (`actions/configure-pages@v5`, Node 22) | Otomatisasi build dan publikasi ke GitHub Pages saat push ke branch `main`. |

---

## 📂 Struktur Direktori Proyek

```text
pupuk-presisi/
├── .agents/                      # Skill & instruksi agentic coding
│   └── skills/
│       ├── android-mobile-ui-ux/            # Audit ergonomi 48dp & safe area insets
│       └── capacitor-offline-gis-lifecycle/ # Praktik baterai GNSS & storage Android
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD otomatis ke GitHub Pages (Node 22, enablement)
├── assets/                       # Aset mentah & logo institusi
│   ├── base-data/                # File GeoJSON tematik Lampung Utara
│   └── logo/                     # Logo resmi Kementan, HITI, ICARE, app-icon
├── public/                       # Berkas statis publik untuk Vite
│   ├── app-icon.svg              # Ikon aplikasi vektor (padi emas & pin presisi)
│   ├── base-data/                # File GeoJSON Lampung Utara (di-fetch oleh Leaflet)
│   └── logo/                     # Logo PNG/JPG yang disajikan di header aplikasi
├── src/
│   ├── components/               # Komponen antarmuka pengguna (React)
│   │   ├── CalculatorSheet.tsx   # Lembar bawah kalkulator dosis Permentan 13/2022
│   │   ├── FloatingHUD.tsx       # Header, tombol GPS, kompas, zoom, dan FAB stack
│   │   ├── HelpModal.tsx         # Panduan penggunaan & pasal edukasi Permentan
│   │   ├── LayerManagerSheet.tsx # Checklist layer GeoJSON & cache tile satelit
│   │   ├── MapView.tsx           # Kanvas peta Leaflet & rendering poligon interaktif
│   │   ├── PolygonInfoPopup.tsx  # Pop-up detail informasi multi-layer poligon kecamatan
│   │   ├── SurveyExportModal.tsx # Dialog kirim data survei (WhatsApp & Google Sheets)
│   │   └── SurveyPointPopup.tsx  # Pop-up detail pin survei tersimpan di peta
│   ├── types/                    # Definisi tipe data TypeScript
│   │   └── index.ts              # HaraStatus, SurveyPoint, LayerItem, PolygonFeatureInfo
│   ├── utils/                    # Utilitas logika komputasi & data
│   │   ├── exportUtils.ts        # Generator CSV, GeoJSON, Web Share API & Webhook
│   │   ├── fertilizerCalculator.ts# Algoritma formula dosis pupuk Permentan 13/2022
│   │   ├── putsConverter.ts      # Konversi kuantitatif PUTS (mg/100g) ke kualitatif
│   │   ├── spatialUtils.ts       # Deteksi Point-in-Polygon (PIP) via Turf.js
│   │   └── storageUtils.ts       # Manajemen IndexedDB via localforage
│   ├── App.tsx                   # Komponen induk aplikasi & integrasi state
│   ├── index.css                 # Konfigurasi Tailwind & safe-area insets Android
│   └── main.tsx                  # Entry point React
├── .gitignore                    # Mengabaikan node_modules, dist, dan cache
├── IMPLEMENTATION_PLAN.md        # Dokumen master rencana implementasi sistem
├── package.json                  # Dependensi proyek & script build
├── tailwind.config.js            # Konfigurasi tema dan warna Tailwind
├── tsconfig.json                 # Konfigurasi compiler TypeScript
└── vite.config.ts                # Konfigurasi bundler Vite (base: './')
```

---

## 💻 Panduan Menjalankan di Komputer Lokal (*Local Development*)

### Prasyarat:
* Node.js versi 20 atau 22 (LTS)
* npm (Node Package Manager)

### Langkah-langkah:
1. **Clone Repositori**:
   ```powershell
   git clone https://github.com/afifuddin212/pupuk-presisi-padi.git
   cd pupuk-presisi-padi
   ```

2. **Instal Dependensi**:
   ```powershell
   npm install
   ```

3. **Jalankan Development Server**:
   > 💡 **Catatan untuk Windows PowerShell**: Jika menjalankan `npm run dev` dicegat oleh Execution Policy (`.ps1`), gunakan `npm.cmd`:
   ```powershell
   npm.cmd run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173/`. Buka di peramban dan aktifkan *Device Emulation (F12 ➔ Toggle Device Toolbar)* untuk menguji tampilan mobile responsif.

4. **Kompilasi Build Produksi**:
   ```powershell
   npm.cmd run build
   ```

5. **Audit Standar UI/UX Lapangan**:
   Jalankan skrip audit ergonomi Material Design 3 dan *touch target*:
   ```powershell
   node .agents/skills/android-mobile-ui-ux/scripts/audit_mobile_ui.cjs .
   ```

---

## 🌐 Panduan Deployment ke GitHub Pages

Proyek ini telah dikonfigurasi dengan alur kerja otomatis **GitHub Actions** di [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Pastikan repositori GitHub Anda berada dalam status **Public**.
2. Masuk ke menu **Settings** di repositori GitHub ➔ **Pages**.
3. Di bawah **Build and deployment**, pada dropdown **Source**, pilih **GitHub Actions**.
4. Setiap kali Anda melakukan `git push origin main`, GitHub Actions akan otomatis mem-build dan menerbitkan versi terbaru aplikasi ke:
   ```text
   https://<username-anda>.github.io/pupuk-presisi-padi/
   ```

---

## 📱 Panduan Pengemasan ke Android APK (Capacitor 6)

Untuk mengemas aplikasi menjadi berkas `.apk` mandiri yang siap di-*install* langsung di HP Android petani/penyuluh tanpa internet:

```powershell
# 1. Pastikan build web produksi terbaru sudah dibuat
npm.cmd run build

# 2. Tambahkan platform Android (hanya perlu dijalankan sekali)
npx.cmd cap add android

# 3. Sinkronisasikan berkas dist/ web ke project Android Capacitor
npx.cmd cap sync android

# 4. Buka proyek di Android Studio
npx.cmd cap open android
```

Di dalam Android Studio:
- Pilih menu **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)** untuk file `.apk` pengujian lapangan.
- Pilih menu **Build** ➔ **Generate Signed Bundle / APK** ➔ **Android App Bundle (`.aab`)** untuk rilis ke Google Play Store.

---

## 📊 Integrasi Webhook Google Sheets Peneliti

Agar seluruh data titik survei yang direkam oleh penyuluh lapangan langsung terkumpul otomatis ke satu file Google Sheets peneliti secara *real-time*:

1. Buat Google Spreadsheet baru di Google Drive Anda.
2. Klik menu **Extensions (Ekstensi)** ➔ **Apps Script**.
3. Tempel kode Google Apps Script berikut:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Buat baris judul otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID Titik", "Waktu Catat", "Nama Pencatat", "Latitude", "Longitude", 
        "Akurasi (m)", "Kecamatan", "Status P", "Status K", 
        "Target Urea (kg/ha)", "Urea Tunggal", "SP-36 Tunggal", "KCl Tunggal", 
        "NPK 15-10-12", "Urea Tambahan", "Sumber Koordinat", "Catatan Khusus"
      ]);
    }

    var data = JSON.parse(e.postData.contents);
    var features = data.features || [];

    features.forEach(function(f) {
      var p = f.properties;
      var geom = f.geometry;
      sheet.appendRow([
        p.id,
        p.waktu,
        p.surveyor,
        geom.coordinates[1], // Latitude
        geom.coordinates[0], // Longitude
        p.akurasi_m || "",
        p.kecamatan,
        p.p_status,
        p.k_status,
        p.target_urea,
        p.urea_tunggal,
        p.sp36_tunggal,
        p.kcl_tunggal,
        p.npk_majemuk,
        p.urea_majemuk,
        p.sumber,
        p.catatan || ""
      ]);
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", count: features.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Klik **Deploy** ➔ **New deployment** ➔ Pilih jenis **Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Penting agar aplikasi pengguna di lapangan dapat mengirim data tanpa perlu login akun Google).*
5. Salin URL Web App yang dihasilkan.
6. Buka aplikasi, klik ikon **Kirim Data** (kanan bawah) ➔ buka **"Pengaturan Webhook Google Sheets Peneliti"** ➔ tempel URL tersebut. *(URL ini otomatis tersimpan permanen di HP pengguna).*

---

## 🏛️ Institusi & Pemangku Kepentingan
Aplikasi ini dirancang untuk mendukung program pertanian terpadu di Kabupaten Lampung Utara yang melibatkan:
* **Kementerian Pertanian Republik Indonesia (Kementan RI)**
* **Himpunan Ilmu Tanah Indonesia (HITI)**
* **Integrated Corporation Agricultural Resources Empowerment (ICARE)**
* **Badan Penyuluhan Pertanian (BPP) & Penyuluh Pertanian Lapangan (PPL) Kabupaten Lampung Utara**

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Lihat berkas `LICENSE` untuk informasi lebih lanjut.

