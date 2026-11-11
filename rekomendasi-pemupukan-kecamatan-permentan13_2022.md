# Rekomendasi Pemupukan Padi Sawah Per-Kecamatan
## Kabupaten Lampung Utara, Provinsi Lampung
**Acuan Resmi: Peraturan Menteri Pertanian Republik Indonesia Nomor 13 Tahun 2022**  
*Tentang Penggunaan Dosis Pupuk N, P, K untuk Padi, Jagung, dan Kedelai pada Lahan Sawah (Lampiran Bagian A)*

---

### 1. Ketentuan Umum & Formula Dosis

Dosis yang tercantum di bawah ini merupakan takaran pupuk tunggal dan majemuk untuk **1 (satu) hektar per musim tanam**:
* **Opsi Dosis Pupuk Tunggal**: Menggunakan kombinasi Urea, SP-36 ($36\% \text{ P}_2\text{O}_5$), dan KCl ($60\% \text{ K}_2\text{O}$).
* **Opsi Dosis Pupuk Majemuk**: Menggunakan formula substitusi pupuk majemuk **NPK 15-10-12** ditambah pupuk **Urea** untuk memenuhi kekurangan hara Nitrogen sesuai target per wilayah kecamatan.
* **Korelasi Status Hara**:
  * SP-36 $100\text{ kg/ha}$ / NPK $375\text{ kg/ha}$ $\rightarrow$ Status P Rendah ($< 20\text{ mg } \text{P}_2\text{O}_5/100\text{ g}$ tanah).
  * SP-36 $75\text{ kg/ha}$ / NPK $300\text{ kg/ha}$ $\rightarrow$ Status P Sedang ($20 - 40\text{ mg } \text{P}_2\text{O}_5/100\text{ g}$ tanah).
  * SP-36 $50\text{ kg/ha}$ / NPK $250\text{ kg/ha}$ $\rightarrow$ Status P Tinggi ($> 40\text{ mg } \text{P}_2\text{O}_5/100\text{ g}$ tanah).
  * KCl $100\text{ kg/ha}$ $\rightarrow$ Status K Rendah ($< 10\text{ mg } \text{K}_2\text{O}/100\text{ g}$ tanah).
  * KCl $50\text{ kg/ha}$ $\rightarrow$ Status K Sedang/Tinggi ($\ge 10\text{ mg } \text{K}_2\text{O}/100\text{ g}$ tanah).

---

### 2. Tabel Dosis Rekomendasi Pemupukan Padi Lahan Sawah

| No | Kecamatan | Dosis Pupuk Tunggal (kg/ha) | | | Dosis Pupuk Majemuk (kg/ha) | |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| | | **Urea** | **SP-36** | **KCl** | **NPK 15-10-12** | **Urea** |
| 1 | **Bukit Kemuning** | 250 | 75 | 50 | 300 | 150 |
| 2 | **Kotabumi** | 250 | 75 | 50 | 300 | 150 |
| 3 | **Kotabumi Utara** | 250 | 75 | 50 | 300 | 150 |
| 4 | **Kotabumi Selatan** | 250 | 75 | 50 | 300 | 150 |
| 5 | **Abung Barat** | 250 | 75 | 50 | 300 | 150 |
| 6 | **Abung Timur** | 250 | 75 | 50 | 300 | 150 |
| 7 | **Abung Selatan** | 250 | 75 | 50 | 300 | 150 |
| 8 | **Abung Semuli** | 250 | 75 | 50 | 300 | 150 |
| 9 | **Abung Surakarta** | 250 | 75 | 50 | 300 | 150 |
| 10 | **Abung Tengah** | 250 | 75 | 50 | 300 | 150 |
| 11 | **Abung Tinggi** | 250 | 75 | 50 | 300 | 150 |
| 12 | **Abung Kunang** | 250 | 75 | 50 | 300 | 150 |
| 13 | **Abung Pekurun** | 250 | 75 | 50 | 300 | 150 |
| 14 | **Sungkai Selatan** | 250 | 75 | 50 | 300 | 150 |
| 15 | **Sungkai Utara** | 250 | 75 | 50 | 300 | 150 |
| 16 | **Sungkai Barat** | 250 | 75 | 50 | 300 | 150 |
| 17 | **Sungkai Jaya** | 250 | 75 | 50 | 300 | 150 |
| 18 | **Sungkai Tengah** | 250 | 75 | 50 | 300 | 150 |
| 19 | **Tanjung Raja** | 250 | 75 | 50 | 300 | 150 |
| 20 | **Bunga Mayang** | 250 | 75 | 50 | 300 | 150 |
| 21 | **Muara Sungkai** | 250 | 75 | 50 | 300 | 150 |
| 22 | **Hulu Sungkai** | 250 | 75 | 50 | 300 | 150 |
| 23 | **Blambangan Pagar** | 250 | 75 | 50 | 300 | 150 |

---

### 3. Catatan Implementasi untuk Aplikasi

1. **Integrasi Geospasial**: Jika lokasi GPS pengguna berada dalam poligon salah satu kecamatan di atas, aplikasi dapat secara otomatis menetapkan rekomendasi *default* sesuai tabel.
2. **Koreksi Data PUTS**: Apabila pengguna memasukkan nilai uji tanah langsung dari alat PUTS di lahan miliknya, nilai rekomendasi tabel per-kecamatan ini dapat disesuaikan secara dinamis mengikuti status hara riil ($<20$, $20-40$, atau $>40\text{ mg/100 g}$).