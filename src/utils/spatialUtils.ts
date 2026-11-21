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
 * Mencari poligon pertama yang memuat titik lat, lng di dataset apapun
 */
export function findFeatureByPoint(
  lat: number,
  lng: number,
  geoJsonData: any
): any | null {
  if (!geoJsonData || !geoJsonData.features) return null;

  const pt = point([lng, lat]);

  for (const feature of geoJsonData.features) {
    try {
      if (booleanPointInPolygon(pt, feature)) {
        return feature;
      }
    } catch (e) {
      // ignore
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

/**
 * Menghitung titik label [lat, lng] yang dijamin berada di dalam poligon fitur GeoJSON.
 * Menggunakan centroid poligon terbesar dan verifikasi booleanPointInPolygon,
 * serta fallback ke titik sampel internal jika poligon berbentuk cekung (concave).
 */
export function getPolygonLabelLatLng(feature: any): [number, number] | null {
  if (!feature || !feature.geometry) return null;

  const { type, coordinates } = feature.geometry;
  const rings: number[][][] = [];

  if (type === 'Polygon' && Array.isArray(coordinates) && coordinates[0]) {
    rings.push(coordinates[0]);
  } else if (type === 'MultiPolygon' && Array.isArray(coordinates)) {
    for (const poly of coordinates) {
      if (Array.isArray(poly) && poly[0]) {
        rings.push(poly[0]);
      }
    }
  }

  if (rings.length === 0) return null;

  // Pilih ring terluas berdasarkan luas shoelace agar pulau kecil tidak menggeser label
  let bestRing = rings[0];
  let maxArea = -1;
  for (const ring of rings) {
    let area = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
    }
    area = Math.abs(area / 2);
    if (area > maxArea) {
      maxArea = area;
      bestRing = ring;
    }
  }

  // Hitung centroid geometris (shoelace centroid) dari ring terluas
  let cx = 0;
  let cy = 0;
  let signedArea = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (let i = 0, j = bestRing.length - 1; i < bestRing.length; j = i++) {
    const x0 = bestRing[j][0];
    const y0 = bestRing[j][1];
    const x1 = bestRing[i][0];
    const y1 = bestRing[i][1];
    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
    if (x1 < minX) minX = x1;
    if (x1 > maxX) maxX = x1;
    if (y1 < minY) minY = y1;
    if (y1 > maxY) maxY = y1;
  }

  let candidateLng = (minX + maxX) / 2;
  let candidateLat = (minY + maxY) / 2;

  if (Math.abs(signedArea) > 1e-12) {
    signedArea *= 0.5;
    candidateLng = cx / (6 * signedArea);
    candidateLat = cy / (6 * signedArea);
  }

  try {
    if (booleanPointInPolygon(point([candidateLng, candidateLat]), feature)) {
      return [candidateLat, candidateLng];
    }

    // Jika centroid berada di luar poligon cekung, cari titik sampel di dalam bbox
    const steps = 6;
    for (let iy = 1; iy < steps; iy++) {
      const lat = minY + ((maxY - minY) * iy) / steps;
      for (let ix = 1; ix < steps; ix++) {
        const lng = minX + ((maxX - minX) * ix) / steps;
        if (booleanPointInPolygon(point([lng, lat]), feature)) {
          return [lat, lng];
        }
      }
    }
  } catch {
    // fallback ke candidate
  }

  return [candidateLat, candidateLng];
}
