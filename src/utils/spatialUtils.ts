import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { KecamatanInfo } from '../types';

/**
 * Mencari kecamatan berdasarkan koordinat latitude & longitude
 * menggunakan algoritma Point-in-Polygon (Turf.js).
 */
export function findKecamatanByPoint(
  lat: number,
  lng: number,
  geoJsonData: any
): KecamatanInfo | null {
  if (!geoJsonData || !geoJsonData.features) return null;

  const pt = point([lng, lat]); // GeoJSON menggunakan format [lon, lat]

  for (const feature of geoJsonData.features) {
    try {
      if (booleanPointInPolygon(pt, feature)) {
        const props = feature.properties || {};
        return {
          nama: props.KECAMATAN || 'Tidak Diketahui',
          kabupaten: props.KABKOT || 'LAMPUNG UTARA',
          provinsi: props.PROVINSI || 'LAMPUNG',
          ureaDasar: parseInt(props.UREA_T_PAD, 10) || 250,
          pStatus: (props.P_PADI as any) || 'Rendah',
          kStatus: (props.K_PADI as any) || 'Tinggi',
        };
      }
    } catch (e) {
      // Abaikan geometri yang mungkin korup
    }
  }

  return null;
}

/**
 * Mengambil daftar seluruh nama kecamatan yang ada dalam file GeoJSON
 */
export function getAllKecamatanList(geoJsonData: any): string[] {
  if (!geoJsonData || !geoJsonData.features) return [];
  const list = geoJsonData.features.map(
    (f: any) => f.properties?.KECAMATAN
  ).filter(Boolean);
  return Array.from(new Set(list)).sort() as string[];
}

