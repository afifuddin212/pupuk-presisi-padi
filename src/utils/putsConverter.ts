import { HaraStatus } from '../types';

/**
 * Mengonversi nilai kuantitatif P2O5 (mg/100g tanah) ke kelas kualitatif
 * berdasarkan Permentan No. 13 Tahun 2022 Pasal 6.
 */
export function convertP2O5ToStatus(val: number): HaraStatus {
  if (val < 20) return 'Rendah';
  if (val <= 40) return 'Sedang';
  return 'Tinggi';
}

/**
 * Mengonversi nilai kuantitatif K2O (mg/100g tanah) ke kelas kualitatif
 * berdasarkan Permentan No. 13 Tahun 2022 Pasal 6.
 */
export function convertK2OToStatus(val: number): HaraStatus {
  if (val < 10) return 'Rendah';
  if (val <= 20) return 'Sedang';
  return 'Tinggi';
}

