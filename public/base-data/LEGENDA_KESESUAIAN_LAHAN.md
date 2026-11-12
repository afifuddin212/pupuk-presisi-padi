# Legenda Kesesuaian Lahan — Panduan Membaca `kesesuaian-lahan-lampura.geojson`

Dokumen ini adalah konversi dari `KETERANGAN_LEGENDA_KESESUAIAN_LAHAN_LENGKAP.xlsx` (sheet `KODE KOMODITAS`) dan dimaksudkan sebagai konteks untuk memahami atribut file GeoJSON.

## 1. Ringkasan File GeoJSON

| Item | Nilai |
|---|---|
| Nama layer | `kesesuaian-lahan-lampura` (Lampung Utara) |
| Tipe geometri | `MultiPolygon` |
| Jumlah fitur | 42 poligon |
| CRS | EPSG:32748 (WGS 84 / UTM zona 48S), satuan meter. **Bukan** lon/lat derajat |
| Total luas (Shape_Area) | ± 265.302 ha (`Shape_Area` dalam m²) |

> Catatan CRS: GeoJSON standar (RFC 7946) mengharuskan WGS 84, tetapi file ini memakai UTM. Saat memuat di web map (Leaflet/Mapbox/dll.) reproyeksi ke EPSG:4326 terlebih dahulu (mis. `proj4`, `geopandas.to_crs(4326)`).

## 2. Atribut yang Ada di GeoJSON

File hanya memuat **5 dari 16 komoditas** pada legenda, yaitu 5 komoditas padi (kode `SI`, `SH`, `PG`, `SL`, `SP`). Setiap komoditas punya 2 kolom.

| Kolom | Komoditas | Isi | Contoh |
|---|---|---|---|
| `KSI` | Padi Sawah Irigasi | Kelas saja | `S3` |
| `SSIR` | Padi Sawah Irigasi | Kelas + faktor pembatas | `S3 - nr/na` |
| `KSH` | Padi Sawah Tadah Hujan | Kelas saja | `S2` |
| `SSHR` | Padi Sawah Tadah Hujan | Kelas + faktor pembatas | `S2 - tc/nr/na` |
| `KPG` | Padi Gogo | Kelas saja | `N` |
| `SPGR` | Padi Gogo | Kelas + faktor pembatas | `N - eh` |
| `KSL` | Padi Sawah Rawa Lebak | Kelas saja | `S3` |
| `SSLR` | Padi Sawah Rawa Lebak | Kelas + faktor pembatas | `S3 - rc` |
| `KSP` | Padi Sawah Rawa Pasang Surut | Kelas saja | `N` |
| `SSPR` | Padi Sawah Rawa Pasang Surut | Kelas + faktor pembatas | `N - eh` |
| `Shape_Leng` | — | Keliling poligon (m) | `3423786.2476` |
| `Shape_Area` | — | Luas poligon (m²) | `126274357.594` |

Aturan penamaan kode (berlaku untuk semua 16 komoditas pada Bagian 4):

- **`K` + kode komoditas** → kolom kelas saja (mis. `KSI` = kelas Padi Sawah Irigasi).
- **`S` + kode komoditas + `R`** → kolom kelas + faktor pembatas (mis. `SSIR` = `S` + `SI` + `R`; `SJGR` = `S` + `JG` + `R`).

## 3. Cara Membaca Nilai

### 3.1 Kolom kelas (`K??`)

Nilai tunggal salah satu dari kelas berikut, atau `null`.

| Kelas | Uraian |
|---|---|
| `S1` | Sangat sesuai |
| `S2` | Cukup sesuai |
| `S3` | Sesuai marginal |
| `N` | Tidak sesuai |
| `null` | Tidak dinilai / tidak ada data untuk komoditas tersebut pada poligon itu (lihat Bagian 5) |

### 3.2 Kolom kelas + faktor pembatas (`S??R`)

Format: `<Kelas> - <faktor1>/<faktor2>/...`

- Pemisah kelas dan faktor adalah `" - "` (spasi-strip-spasi).
- Pemisah antar faktor pembatas adalah `/`.
- Bagian kelas selalu sama dengan nilai kolom `K??` pasangannya (sudah diverifikasi: 0 ketidakcocokan).

Contoh: `S2 - tc/nr/na` berarti Cukup sesuai (S2), dengan pembatas temperatur (tc), retensi hara (nr), dan hara tersedia (na).

Pemisahan nilai (Python):

```python
kelas, faktor = (val.split(" - ") + [None])[:2] if val else (None, None)
faktor_list = faktor.split("/") if faktor else []
```

## 4. Legenda Lengkap

### 4.1 Kelas Kesesuaian Lahan

| No | Kelas | Uraian |
|---|---|---|
| 1 | S1 | Sangat sesuai |
| 2 | S2 | Cukup sesuai |
| 3 | S3 | Sesuai marginal |
| 4 | N | Tidak sesuai |

### 4.2 Komoditas dan Kode Kolom

Kolom "Ada di GeoJSON" menandai komoditas yang atributnya benar-benar tersedia di file ini.

| No | Kode | Komoditas | Kolom kelas | Kolom kelas + faktor pembatas | Ada di GeoJSON |
|---|---|---|---|---|---|
| 1 | SI | Padi Sawah Irigasi | `KSI` | `SSIR` | Ya |
| 2 | SH | Padi Sawah Tadah Hujan | `KSH` | `SSHR` | Ya |
| 3 | PG | Padi Gogo | `KPG` | `SPGR` | Ya |
| 4 | SL | Padi Sawah Rawa Lebak | `KSL` | `SSLR` | Ya |
| 5 | SP | Padi Sawah Rawa Pasang Surut | `KSP` | `SSPR` | Ya |
| 6 | JG | Jagung | `KJG` | `SJGR` | Tidak |
| 7 | KD | Kedelai | `KKD` | `SKDR` | Tidak |
| 8 | BA | Bawang Merah | `KBA` | `SBAR` | Tidak |
| 9 | BE | Cabe Merah | `KBE` | `SBER` | Tidak |
| 10 | KO | Kakao | `KKO` | `SKOR` | Tidak |
| 11 | KS | Kelapa Sawit | `KKS` | `SKSR` | Tidak |
| 12 | TM | Tebu Gula Merah | `KTM` | `STMR` | Tidak |
| 13 | TB | Tebu Gula Putih | `KTB` | `STBR` | Tidak |
| 14 | LG | Leguminosa | `KLG` | `SLGR` | Tidak |
| 15 | RG | Rumput Gajah | `KRG` | `SRGR` | Tidak |
| 16 | ST | Setaria | `KST` | `SSTR` | Tidak |

### 4.3 Faktor Pembatas

| No | Kode | Faktor pembatas | Ditentukan oleh |
|---|---|---|---|
| 1 | `tc` | Temperatur | Temperatur rata-rata tahunan |
| 2 | `wa` | Ketersediaan air | Curah hujan (tahunan dan pada masa pertumbuhan), kelembaban udara, dan zona agroklimat |
| 3 | `oa` | Ketersediaan oksigen | Drainase |
| 4 | `rc` | Media perakaran | Drainase, tekstur, bahan kasar, kedalaman efektif, kematangan dan ketebalan gambut |
| 5 | `nr` | Retensi hara | KTK tanah, KB, pH, dan C organik |
| 6 | `na` | Hara tersedia | N, P₂O₅, K₂O |
| 7 | `xc` | Toksisitas | Salinitas |
| 8 | `xn` | Sodisitas | Alkalinitas |
| 9 | `xs` | Bahaya sulfidik | Kedalaman sulfidik |
| 10 | `eh` | Tingkat bahaya erosi | Bahaya erosi dan kedalaman tanah |
| 11 | `fh` | Bahaya banjir/genangan | Tinggi dan lama genangan |
| 12 | `lp` | Penyiapan lahan | Batuan di permukaan dan singkapan batuan |

Faktor pembatas yang benar-benar muncul di GeoJSON ini: `tc`, `rc`, `nr`, `na`, `eh`. Faktor lain (`wa`, `oa`, `xc`, `xn`, `xs`, `fh`, `lp`) tidak muncul.

## 5. Catatan Penting untuk Analisis

1. **`null` bukan berarti "Tidak sesuai".** Nilai `null` berarti komoditas tidak dinilai pada poligon tersebut. Ketidaksesuaian dinyatakan dengan `N`. Pisahkan keduanya saat membuat simbologi, statistik, dan filter.
2. **Sebaran `null` per komoditas (dari 42 fitur):** Irigasi 11, Tadah Hujan 5, Padi Gogo 3, Rawa Lebak 22, Rawa Pasang Surut 22.
3. **Kelas `S1` tidak muncul** di file ini. Hanya `S2`, `S3`, dan `N` yang ada, sehingga legenda peta boleh memuat `S1` untuk kelengkapan, tetapi tidak akan terisi.
4. **Faktor pembatas pada kelas `N`** menunjukkan penyebab ketidaksesuaian (di file ini: `eh`, `rc/eh`, `tc/eh`).
5. **Perbedaan antar komoditas dalam satu poligon itu wajar.** Setiap poligon punya kelas berbeda untuk tiap komoditas padi.
6. **Luas:** gunakan `Shape_Area` (m²). Hektare = `Shape_Area / 10000`.
7. **Ringkasan luas per kelas (ha, dihitung dari `Shape_Area`):**

| Komoditas | S2 | S3 | N | null (tidak dinilai) |
|---|---|---|---|---|
| Padi Sawah Irigasi (`KSI`) | 11.180 | 21.380 | 32.190 | 200.551 |
| Padi Sawah Tadah Hujan (`KSH`) | 19.319 | 126.236 | 38.737 | 81.009 |
| Padi Gogo (`KPG`) | 29.736 | 172.955 | 39.018 | 23.592 |
| Padi Sawah Rawa Lebak (`KSL`) | 5.920 | 5.138 | 30.344 | 223.900 |
| Padi Sawah Rawa Pasang Surut (`KSP`) | 5.747 | 5.311 | 30.344 | 223.900 |

## 6. Contoh Pemetaan untuk Simbologi

| Kelas | Warna yang disarankan | Label |
|---|---|---|
| S1 | `#1a9850` | Sangat sesuai |
| S2 | `#a6d96a` | Cukup sesuai |
| S3 | `#fee08b` | Sesuai marginal |
| N | `#d73027` | Tidak sesuai |
| `null` | `#00000000` (Transparan) | Tidak dinilai |
