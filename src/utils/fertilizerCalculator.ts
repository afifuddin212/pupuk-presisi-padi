import { HaraStatus, JenisPadi, MetodeRekomendasi, RekomendasiResult } from '../types';

/**
 * Menghitung rekomendasi pemupukan Padi Sawah berdasarkan PUTS & Permentan No. 13 Tahun 2022.
 * Mengacu pada dokumen: rekomendasi_pemupukan_presisi_padi_terpadu.md (Bagian 3 & 4)
 */
export function hitungRekomendasiPadiSawahPUTS(
  pStatus: HaraStatus,
  kStatus: HaraStatus,
  targetUrea: number = 250,
  hasStrawRecycled: boolean = false
): RekomendasiResult {
  // 1. Dosis SP-36 (36% P2O5)
  let sp36 = 75;
  if (pStatus === 'Rendah') sp36 = 100;
  else if (pStatus === 'Sedang') sp36 = 75;
  else sp36 = 50; // Tinggi

  // 2. Dosis KCl (60% K2O)
  let kcl = 50;
  if (kStatus === 'Rendah') {
    kcl = hasStrawRecycled ? 50 : 100;
  } else {
    // Sedang & Tinggi
    kcl = hasStrawRecycled ? 0 : 50;
  }

  // 3. Dosis Majemuk NPK 15-10-12 + Urea Tambahan
  let npk = 300;
  let ureaTambahan = 150;

  if (pStatus === 'Rendah') {
    npk = 375;
    if (targetUrea <= 250) ureaTambahan = 125;
    else if (targetUrea <= 300) ureaTambahan = 175;
    else ureaTambahan = 225;
  } else if (pStatus === 'Sedang') {
    npk = 300;
    if (targetUrea <= 250) ureaTambahan = 150;
    else if (targetUrea <= 300) ureaTambahan = 200;
    else ureaTambahan = 250;
  } else {
    // Tinggi
    npk = 250;
    if (targetUrea <= 250) ureaTambahan = 175;
    else if (targetUrea <= 300) ureaTambahan = 225;
    else ureaTambahan = 275;
  }

  return {
    jenisPadi: 'sawah',
    metode: 'puts',
    pStatus,
    kStatus,
    targetUrea,
    hasStrawRecycled,
    tunggal: {
      urea: targetUrea,
      sp36,
      kcl,
    },
    majemuk: {
      npk,
      ureaTambahan,
      sp36Tambahan: 0,
    },
  };
}

/**
 * Menghitung rekomendasi pemupukan Padi Gogo / Lahan Kering berdasarkan PUTK / BRMP.
 * Mengacu pada dokumen: rekomendasi_pemupukan_presisi_padi_terpadu.md (Bagian 5)
 * Karena fiksasi fosfat tinggi pada tanah masam, paket majemuk memerlukan SP-36 tambahan.
 */
export function hitungRekomendasiPadiGogoPUTK(
  pStatus: HaraStatus,
  kStatus: HaraStatus
): RekomendasiResult {
  const targetUrea = 300; // Baku Padi Gogo

  // 1. Dosis SP-36 Tunggal
  let sp36 = 150;
  if (pStatus === 'Rendah') sp36 = 200;
  else if (pStatus === 'Sedang') sp36 = 150;
  else sp36 = 100; // Tinggi

  // 2. Dosis KCl Tunggal
  let kcl = 75;
  if (kStatus === 'Rendah') kcl = 100;
  else if (kStatus === 'Sedang') kcl = 75;
  else kcl = 50; // Tinggi

  // 3. Paket Majemuk Tiga Komponen (NPK 15-10-12 + Urea Tambahan + SP-36 Tambahan)
  let npk = 400;
  let ureaTambahan = 175;
  let sp36Tambahan = 50;

  if (pStatus === 'Rendah') {
    npk = 450;
    ureaTambahan = 150;
    sp36Tambahan = 75;
  } else if (pStatus === 'Sedang') {
    npk = 400;
    ureaTambahan = 175;
    sp36Tambahan = 50;
  } else {
    // Tinggi
    npk = 350;
    ureaTambahan = 200;
    sp36Tambahan = 0;
  }

  return {
    jenisPadi: 'gogo',
    metode: 'putk',
    pStatus,
    kStatus,
    targetUrea,
    tunggal: {
      urea: targetUrea,
      sp36,
      kcl,
    },
    majemuk: {
      npk,
      ureaTambahan,
      sp36Tambahan,
    },
    catatanKhusus: sp36Tambahan > 0 
      ? `Petani harus memberikan SP-36 Tambahan sebesar ${sp36Tambahan} kg/ha untuk menutup defisit fosfat lahan kering masam.` 
      : undefined,
  };
}

/**
 * Mengambil dosis baku rekomendasi per-kecamatan sesuai Permentan No. 13 Tahun 2022 (Lampiran A).
 * Untuk seluruh 23 kecamatan di Lampung Utara:
 * - Tunggal: Urea 250, SP-36 75, KCl 50 kg/ha
 * - Majemuk: NPK 15-10-12 300 + Urea 150 kg/ha
 */
export function getRekomendasiBakuKecamatanPermentan(kecamatan: string): RekomendasiResult {
  return {
    jenisPadi: 'sawah',
    metode: 'permentan',
    pStatus: 'Sedang',
    kStatus: 'Sedang',
    targetUrea: 250,
    tunggal: {
      urea: 250,
      sp36: 75,
      kcl: 50,
    },
    majemuk: {
      npk: 300,
      ureaTambahan: 150,
      sp36Tambahan: 0,
    },
    catatanKhusus: `Dosis baku ketetapan tabel Lampiran A Permentan 13/2022 untuk Kecamatan ${kecamatan}.`,
  };
}

/**
 * Menghitung dosis pupuk terpadu sesuai parameter input pengguna.
 */
export function hitungRekomendasiPupuk(
  pStatus: HaraStatus,
  kStatus: HaraStatus,
  targetUrea: number = 250,
  jenisPadi: JenisPadi = 'sawah',
  metode: MetodeRekomendasi = 'puts',
  hasStrawRecycled: boolean = false,
  kecamatan: string = 'BUKIT KEMUNING'
): RekomendasiResult {
  if (jenisPadi === 'gogo' || metode === 'putk') {
    return hitungRekomendasiPadiGogoPUTK(pStatus, kStatus);
  }

  if (metode === 'permentan') {
    return getRekomendasiBakuKecamatanPermentan(kecamatan);
  }

  return hitungRekomendasiPadiSawahPUTS(pStatus, kStatus, targetUrea, hasStrawRecycled);
}
