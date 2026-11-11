export type HaraStatus = 'Rendah' | 'Sedang' | 'Tinggi';
export type JenisPadi = 'sawah' | 'gogo';
export type MetodeRekomendasi = 'permentan' | 'puts' | 'putk';

export interface DosisPaketTunggal {
  urea: number;
  sp36: number;
  kcl: number;
}

export interface DosisPaketMajemuk {
  npk: number;          // NPK 15-10-12
  ureaTambahan: number; // Tambahan Urea
  sp36Tambahan?: number; // Tambahan SP-36 (khusus Padi Gogo / PUTK karena defisit fosfat lahan kering masam)
}

export interface RekomendasiResult {
  jenisPadi: JenisPadi;
  metode: MetodeRekomendasi;
  pStatus: HaraStatus;
  kStatus: HaraStatus;
  targetUrea: number;
  tunggal: DosisPaketTunggal;
  majemuk: DosisPaketMajemuk;
  hasStrawRecycled?: boolean;
  catatanKhusus?: string;
}

export interface KecamatanInfo {
  nama: string;
  kabupaten: string;
  provinsi: string;
  ureaDasar: number;
  pStatus: HaraStatus;
  kStatus: HaraStatus;
}

export interface SurveyPoint {
  id: string;
  surveyorName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  source: 'gps' | 'manual';
  kecamatan: string;
  jenisPadi?: JenisPadi;
  metodeRekomendasi?: MetodeRekomendasi;
  luasPetak?: number; // Luas petak sawah dalam hektar (misal: 0.25, 0.5, 1 ha)
  pStatus: HaraStatus;
  kStatus: HaraStatus;
  p2o5Kuantitatif?: number;
  k2oKuantitatif?: number;
  targetUrea: number;
  hasStrawRecycled?: boolean;
  tunggal: DosisPaketTunggal;
  majemuk: DosisPaketMajemuk;
  notes?: string;
}

export interface LayerItem {
  id: string;
  name: string;
  active: boolean;
  available: boolean;
  filename?: string;
  legend: Array<{
    label: string;
    color: string;
  }>;
}

export interface PolygonFeatureInfo {
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  properties: any;
  coordinates?: [number, number];
}
