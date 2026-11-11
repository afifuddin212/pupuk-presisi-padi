# Panduan Lengkap Rekomendasi Pemupukan Presisi Tanaman Padi
## Integrasi Permentan No. 13 Tahun 2022, Uji Tanah Sawah (PUTS), dan Uji Tanah Kering (PUTK)

---

### 1. Landasan Regulasi & Prinsip Dasar
Dokumen ini merupakan acuan logika algoritma pemupukan presisi untuk tanaman padi (**Padi Sawah** dan **Padi Gogo/Lahan Kering**). Jika terdapat perbedaan parameter antar-sumber pustaka teknis, **Peraturan Menteri Pertanian Republik Indonesia Nomor 13 Tahun 2022** ditetapkan sebagai hierarki hukum dan rujukan batasan utama.

#### Ketetapan Pokok Permentan 13/2022:
1. **Klasifikasi Kesuburan**: Menggunakan **3 kelas status kualitatif** (Rendah, Sedang, Tinggi).
2. **Dosis Hara Dasar Per Hektar**:
   * Dosis hara Fosfor ($\text{P}_2\text{O}_5$) dan Kalium ($\text{K}_2\text{O}$) ditentukan secara objektif berdasarkan status hara tanah (analisis laboratorium atau perangkat uji tanah PUTS/PUTK).
   * Dosis hara Nitrogen ($\text{N}$ / Urea) ditentukan berdasarkan **target hasil produktivitas** atau ketetapan spesifik per kecamatan.
3. **Formulasi Pupuk Majemuk Resmi**: Menggunakan pupuk majemuk bersubsidi **NPK 15-10-12** yang ditambah Urea. Alternatif formula komersial seperti **NPK 15-15-15** diintegrasikan sebagai opsi alternatif bagi petani.

---

### 2. Standar Ambang Batas Kuantitatif Status Hara (Baku Permentan 13/2022)

Penilaian status hara tanah hasil ekstraksi $\text{HCl } 25\%$ (dari uji PUTS/PUTK atau analisis tanah) dikonversikan ke dalam 3 kelas status hara:

| Parameter Hara | Status Rendah (R) | Status Sedang (S) | Status Tinggi (T) | Keterangan / Sumber |
| :--- | :---: | :---: | :---: | :--- |
| **Fosfor ($\text{P}_2\text{O}_5$)** | $< 20\text{ mg}/100\text{ g}$ | $20\text{--}40\text{ mg}/100\text{ g}$ | $> 40\text{ mg}/100\text{ g}$ | Pasal 6 Permentan 13/2022 |
| **Kalium ($\text{K}_2\text{O}$)** | $< 10\text{ mg}/100\text{ g}$ | $10\text{--}20\text{ mg}/100\text{ g}$ | $> 20\text{ mg}/100\text{ g}$ | Pasal 6 Permentan 13/2022 |

*Catatan Implementasi Aplikasi:*
* Jika pengguna memasukkan nilai kuantitatif ($\text{mg}/100\text{ g}$), sistem mengonversi otomatis ke status R, S, atau T sesuai rentang di atas.
* Jika pengguna memilih input kualitatif, pengguna langsung memilih opsi: **Rendah**, **Sedang**, atau **Tinggi**.

---

### 3. Rekomendasi Dosis Padi Sawah (PUTS & Permentan 13/2022)

#### 3.1. Target Kebutuhan Nitrogen (Dosis Urea Dasar)
Kebutuhan pupuk Urea pada lahan sawah dikelompokkan ke dalam 3 tingkat target hasil/produktivitas:
* **Produktivitas Rendah ($< 5\text{ ton/ha}$)**: Target Urea dasar = $250\text{ kg/ha}$
* **Produktivitas Sedang ($5\text{--}6\text{ ton/ha}$)**: Target Urea dasar = $300\text{ kg/ha}$
* **Produktivitas Tinggi ($> 6\text{ ton/ha}$)**: Target Urea dasar = $350\text{ kg/ha}$

*(Catatan: Nilai ini juga dapat terisi otomatis bila aplikasi mendeteksi poligon batas kecamatan tempat pengguna berada).*

#### 3.2. Dosis Pupuk Fosfat (P) dan Kalium (K)
* **Pupuk SP-36 ($36\% \text{ P}_2\text{O}_5$)**:
  * Status P Rendah: $100\text{ kg SP-36/ha}$ ($36\text{ kg }\text{P}_2\text{O}_5$)
  * Status P Sedang: $75\text{ kg SP-36/ha}$ ($27\text{ kg }\text{P}_2\text{O}_5$)
  * Status P Tinggi: $50\text{ kg SP-36/ha}$ ($18\text{ kg }\text{P}_2\text{O}_5$)
* **Pupuk KCl ($60\% \text{ K}_2\text{O}$)**:
  * Status K Rendah: $100\text{ kg KCl/ha}$ ($60\text{ kg }\text{K}_2\text{O}$)
  * Status K Sedang & Tinggi: $50\text{ kg KCl/ha}$ ($30\text{ kg }\text{K}_2\text{O}$)
* **Koreksi Pengembalian Jerami (Faktor Jerami Padi Sawah)**:
  * Jika petani mengembalikan **$\ge 5\text{ ton jerami segar/ha}$** ke lahan:
    * Status K Rendah: Dosis KCl dikurangi menjadi **$50\text{ kg/ha}$**.
    * Status K Sedang dan Tinggi: Dosis KCl menjadi **$0\text{ kg/ha}$** (kebutuhan K sudah terpenuhi dari daur ulang jerami).

#### 3.3. Formula Substitusi Pupuk Majemuk Padi Sawah
1. **Paket Majemuk Resmi (NPK 15-10-12 + Urea)**:
   * Takaran NPK 15-10-12 mengunci kebutuhan P:
     * P Rendah: $375\text{ kg NPK/ha}$
     * P Sedang: $300\text{ kg NPK/ha}$
     * P Tinggi: $250\text{ kg NPK/ha}$
   * Takaran Urea tambahan dihitung dengan rumus:
     $$\text{Urea Tambahan} = \text{Target Urea Dasar} - (0{,}33 \times \text{Dosis NPK 15-10-12})$$
2. **Paket Majemuk Alternatif (NPK 15-15-15 + Urea)**:
   * Mengakomodasi penggunaan pupuk berimbang (seperti Phonska 15-15-15).
   * Pada status P Sedang dan Tinggi dengan status K Sedang/Tinggi, dosis NPK 15-15-15 ditetapkan sebesar $225\text{ kg/ha}$ ditambah Urea $225\text{ kg/ha}$ (pada target Urea $300\text{ kg/ha}$).
   * Pada status K Rendah, takaran NPK dinaikkan ($300\text{--}350\text{ kg/ha}$) untuk menutup defisit kalium.

---

### 4. Matriks Lengkap 27 Kombinasi Rekomendasi Padi Sawah

Berikut adalah matriks komprehensif rekomendasi pemupukan padi sawah untuk seluruh kombinasi status P, status K, dan target produksi N (tanpa pengembalian jerami):

| No | Target Urea | Status P | Status K | Paket Pupuk Tunggal (kg/ha) | Paket Resmi: NPK 15-10-12 + Urea (kg/ha) | Paket Alternatif: NPK 15-15-15 + Urea (kg/ha) |
| :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| 1 | **250** | Rendah | Rendah | Urea 250 + SP-36 100 + KCl 100 | NPK 375 + Urea 125 | NPK 350 + Urea 175 |
| 2 | **250** | Rendah | Sedang | Urea 250 + SP-36 100 + KCl 50 | NPK 375 + Urea 125 | NPK 225 + Urea 175 |
| 3 | **250** | Rendah | Tinggi | Urea 250 + SP-36 100 + KCl 50 | NPK 375 + Urea 125 | NPK 225 + Urea 175 |
| 4 | **250** | Sedang | Rendah | Urea 250 + SP-36 75 + KCl 100 | NPK 300 + Urea 150 | NPK 325 + Urea 150 |
| 5 | **250** | Sedang | Sedang | Urea 250 + SP-36 75 + KCl 50 | NPK 300 + Urea 150 | NPK 225 + Urea 175 |
| 6 | **250** | Sedang | Tinggi | Urea 250 + SP-36 75 + KCl 50 | NPK 300 + Urea 150 | NPK 225 + Urea 175 |
| 7 | **250** | Tinggi | Rendah | Urea 250 + SP-36 50 + KCl 100 | NPK 250 + Urea 175 | NPK 300 + Urea 150 |
| 8 | **250** | Tinggi | Sedang | Urea 250 + SP-36 50 + KCl 50 | NPK 250 + Urea 175 | NPK 225 + Urea 175 |
| 9 | **250** | Tinggi | Tinggi | Urea 250 + SP-36 50 + KCl 50 | NPK 250 + Urea 175 | NPK 225 + Urea 175 |
| 10 | **300** | Rendah | Rendah | Urea 300 + SP-36 100 + KCl 100 | NPK 375 + Urea 175 | NPK 350 + Urea 175 |
| 11 | **300** | Rendah | Sedang | Urea 300 + SP-36 100 + KCl 50 | NPK 375 + Urea 175 | NPK 225 + Urea 225 |
| 12 | **300** | Rendah | Tinggi | Urea 300 + SP-36 100 + KCl 50 | NPK 375 + Urea 175 | NPK 225 + Urea 225 |
| 13 | **300** | Sedang | Rendah | Urea 300 + SP-36 75 + KCl 100 | NPK 300 + Urea 200 | NPK 325 + Urea 200 |
| 14 | **300** | Sedang | Sedang | Urea 300 + SP-36 75 + KCl 50 | NPK 300 + Urea 200 | NPK 225 + Urea 225 |
| 15 | **300** | Sedang | Tinggi | Urea 300 + SP-36 75 + KCl 50 | NPK 300 + Urea 200 | NPK 225 + Urea 225 |
| 16 | **300** | Tinggi | Rendah | Urea 300 + SP-36 50 + KCl 100 | NPK 250 + Urea 225 | NPK 300 + Urea 200 |
| 17 | **300** | Tinggi | Sedang | Urea 300 + SP-36 50 + KCl 50 | NPK 250 + Urea 225 | NPK 225 + Urea 225 |
| 18 | **300** | Tinggi | Tinggi | Urea 300 + SP-36 50 + KCl 50 | NPK 250 + Urea 225 | NPK 225 + Urea 225 |
| 19 | **350** | Rendah | Rendah | Urea 350 + SP-36 100 + KCl 100 | NPK 375 + Urea 225 | NPK 350 + Urea 225 |
| 20 | **350** | Rendah | Sedang | Urea 350 + SP-36 100 + KCl 50 | NPK 375 + Urea 225 | NPK 225 + Urea 275 |
| 21 | **350** | Rendah | Tinggi | Urea 350 + SP-36 100 + KCl 50 | NPK 375 + Urea 225 | NPK 225 + Urea 275 |
| 22 | **350** | Sedang | Rendah | Urea 350 + SP-36 75 + KCl 100 | NPK 300 + Urea 250 | NPK 325 + Urea 250 |
| 23 | **350** | Sedang | Sedang | Urea 350 + SP-36 75 + KCl 50 | NPK 300 + Urea 250 | NPK 225 + Urea 275 |
| 24 | **350** | Sedang | Tinggi | Urea 350 + SP-36 75 + KCl 50 | NPK 300 + Urea 250 | NPK 225 + Urea 275 |
| 25 | **350** | Tinggi | Rendah | Urea 350 + SP-36 50 + KCl 100 | NPK 250 + Urea 275 | NPK 300 + Urea 250 |
| 26 | **350** | Tinggi | Sedang | Urea 350 + SP-36 50 + KCl 50 | NPK 250 + Urea 275 | NPK 225 + Urea 275 |
| 27 | **350** | Tinggi | Tinggi | Urea 350 + SP-36 50 + KCl 50 | NPK 250 + Urea 275 | NPK 225 + Urea 275 |

---

### 5. Rekomendasi Padi Gogo / Lahan Kering (PUTK / BRMP)

Pada lahan kering masam (upland), fiksasi fosfat oleh ion $\text{Al}^{3+}$ dan $\text{Fe}^{3+}$ sangat tinggi, sehingga kebutuhan pupuk fosfat **mencapai 2 kali lipat lebih besar** dibandingkan lahan sawah.

#### 5.1. Dosis Dasar Pupuk Tunggal Padi Gogo
* **Target Urea Dasar**: $300\text{ kg/ha}$
* **Pupuk SP-36**:
  * P Rendah: $200\text{ kg SP-36/ha}$
  * P Sedang: $150\text{ kg SP-36/ha}$
  * P Tinggi: $100\text{ kg SP-36/ha}$
* **Pupuk KCl**:
  * K Rendah: $100\text{ kg KCl/ha}$
  * K Sedang: $75\text{ kg KCl/ha}$
  * K Tinggi: $50\text{ kg KCl/ha}$

#### 5.2. Formula Majemuk Tiga Komponen (NPK 15-10-12 + Urea + Tambahan SP-36)
Karena kandungan $\text{P}_2\text{O}_5$ pupuk NPK 15-10-12 hanya $10\%$, pemakaian NPK saja belum mencukupi kebutuhan hara fosfat padi gogo. Oleh karena itu, paket majemuk padi gogo menyertakan **pupuk SP-36 tambahan**:

| Status P | Status K | Paket Pupuk Tunggal (kg/ha) | Paket Pupuk Majemuk Terpadu (kg/ha) |
| :---: | :---: | :--- | :--- |
| **Rendah** | Rendah | Urea 300 + SP-36 200 + KCl 100 | **NPK 450 + Urea 150 + SP-36 75** |
| **Rendah** | Sedang | Urea 300 + SP-36 200 + KCl 75 | **NPK 450 + Urea 150 + SP-36 75** |
| **Rendah** | Tinggi | Urea 300 + SP-36 200 + KCl 50 | **NPK 450 + Urea 150 + SP-36 75** |
| **Sedang** | Rendah | Urea 300 + SP-36 150 + KCl 100 | **NPK 400 + Urea 175 + SP-36 50** |
| **Sedang** | Sedang | Urea 300 + SP-36 150 + KCl 75 | **NPK 400 + Urea 175 + SP-36 50** |
| **Sedang** | Tinggi | Urea 300 + SP-36 150 + KCl 50 | **NPK 400 + Urea 175 + SP-36 50** |
| **Tinggi** | Rendah | Urea 300 + SP-36 100 + KCl 100 | **NPK 350 + Urea 200 + SP-36 0** |
| **Tinggi** | Sedang | Urea 300 + SP-36 100 + KCl 75 | **NPK 350 + Urea 200 + SP-36 0** |
| **Tinggi** | Tinggi | Urea 300 + SP-36 100 + KCl 50 | **NPK 350 + Urea 200 + SP-36 0** |

---

### 6. Rujukan Default Spasial Per-Kecamatan (Contoh: Kabupaten Lampung Utara)

Apabila pengguna menyalakan GPS dan berada di wilayah Kabupaten Lampung Utara tanpa membawa alat uji tanah, aplikasi menetapkan status standar kecamatan: **Urea dasar $250\text{ kg/ha}$, Status P Sedang, dan Status K Sedang/Tinggi**:

| No | Kecamatan | Urea (kg/ha) | SP-36 (kg/ha) | KCl (kg/ha) | NPK 15-10-12 (kg/ha) | Urea Tambahan (kg/ha) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1--23 | **Seluruh 23 Kecamatan di Kab. Lampung Utara** | 250 | 75 | 50 | 300 | 150 |

*(Daftar 23 Kecamatan: Bukit Kemuning, Kotabumi, Kotabumi Utara, Kotabumi Selatan, Abung Barat, Abung Timur, Abung Selatan, Abung Semuli, Abung Surakarta, Abung Tengah, Abung Tinggi, Abung Kunang, Abung Pekurun, Sungkai Selatan, Sungkai Utara, Sungkai Barat, Sungkai Jaya, Sungkai Tengah, Tanjung Raja, Bunga Mayang, Muara Sungkai, Hulu Sungkai, Blambangan Pagar).*

---

### 7. Spesifikasi Logika Program (*Code Implementation Guide*)

Untuk implementasi algoritma pada program Android (Antigravity):

#### 7.1. Struktur Input Model
```json
{
  "land_type": "SAWAH" | "GOGO",
  "input_mode": "QUALITATIVE" | "QUANTITATIVE",
  "p_value_mg": 18.5,
  "k_value_mg": 8.2,
  "p_status": "RENDAH" | "SEDANG" | "TINGGI",
  "k_status": "RENDAH" | "SEDANG" | "TINGGI",
  "target_urea_kg": 250 | 300 | 350,
  "has_straw_recycled": true | false,
  "land_area_ha": 1.0
}
```

#### 7.2. Aturan Klasifikasi Kuantitatif ke Kualitatif
```text
IF p_value_mg < 20.0 THEN p_status = RENDAH
ELSE IF p_value_mg <= 40.0 THEN p_status = SEDANG
ELSE p_status = TINGGI

IF k_value_mg < 10.0 THEN k_status = RENDAH
ELSE IF k_value_mg <= 20.0 THEN k_status = SEDANG
ELSE k_status = TINGGI
```

#### 7.3. Aturan Modifikasi Jerami (Hanya Sawah)
```text
IF land_type == SAWAH AND has_straw_recycled == TRUE:
    IF k_status == RENDAH:
        kcl_dose = 50
    ELSE:
        kcl_dose = 0
```