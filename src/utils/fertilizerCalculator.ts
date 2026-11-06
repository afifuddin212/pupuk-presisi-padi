import { HaraStatus, RekomendasiResult } from '../types';

/**
 * Menghitung dosis pupuk berdasarkan Permentan No. 13 Tahun 2022.
 * @param pStatus Status hara Fosfor (Rendah / Sedang / Tinggi)
 * @param kStatus Status hara Kalium (Rendah / Sedang / Tinggi)
 * @param targetUrea Target dosis Urea dasar per hektar (250, 300, 350 kg/ha)
 */
export function hitungRekomendasiPupuk(
  pStatus: HaraStatus,
  kStatus: HaraStatus,
  targetUrea: number = 250
): RekomendasiResult {
  // 1. Dosis SP-36 (Pasal 8 ayat 2 huruf b)
  let sp36 = 75;
  if (pStatus === 'Rendah') sp36 = 100;
  else if (pStatus === 'Sedang') sp36 = 75;
  else if (pStatus === 'Tinggi') sp36 = 50;

  // 2. Dosis KCl (Pasal 8 ayat 2 huruf c)
  let kcl = 50;
  if (kStatus === 'Rendah') kcl = 100;
  else kcl = 50; // Sedang dan Tinggi sama-sama 50 kg/ha

  // 3. Dosis Majemuk NPK 15-10-12 + Urea Tambahan (Lampiran Permentan 13/2022)
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
    },
  };
}

