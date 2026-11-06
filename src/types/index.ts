export type HaraStatus = 'Rendah' | 'Sedang' | 'Tinggi';

export interface DosisPaketTunggal {
  urea: number;
  sp36: number;
  kcl: number;
}

export interface DosisPaketMajemuk {
  npk: number;          // NPK 15-10-12
  ureaTambahan: number; // Tambahan Urea
}

export interface RekomendasiResult {
  pStatus: HaraStatus;
  kStatus: HaraStatus;
  targetUrea: number;
  tunggal: DosisPaketTunggal;
  majemuk: DosisPaketMajemuk;
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
  pStatus: HaraStatus;
  kStatus: HaraStatus;
  p2o5Kuantitatif?: number;
  k2oKuantitatif?: number;
  targetUrea: number;
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
