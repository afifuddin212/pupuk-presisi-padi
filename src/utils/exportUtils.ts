import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { SurveyPoint } from '../types';

/**
 * URL Webhook Google Apps Script bawaan (Default)
 */
export const DEFAULT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxDBrdFcDHsSh_g-Aad90RzEJQOyvHM2RjJ7Bjr5GosQqE2TUYjZxPD2Wt6BUOmK3EPXQ/exec';

/**
 * Mengonversi array SurveyPoint menjadi format teks CSV
 */
export function convertPointsToCSV(points: SurveyPoint[]): string {
  const headers = [
    'ID',
    'Waktu Catat',
    'Nama Pencatat',
    'Latitude',
    'Longitude',
    'Akurasi (m)',
    'Sumber Koordinat',
    'Kecamatan',
    'Jenis Padi',
    'Metode Rekomendasi',
    'Luas Petak (ha)',
    'Status P',
    'Status K',
    'P2O5 Lab (mg/100g)',
    'K2O Lab (mg/100g)',
    'Target Urea (kg/ha)',
    'Daur Ulang Jerami',
    'Dosis Tunggal Urea (kg/ha)',
    'Dosis Tunggal SP-36 (kg/ha)',
    'Dosis Tunggal KCl (kg/ha)',
    'Dosis Majemuk NPK 15-10-12 (kg/ha)',
    'Dosis Majemuk Urea Tambahan (kg/ha)',
    'Dosis Majemuk SP-36 Tambahan (kg/ha)',
    'Catatan Lapangan',
  ];

  const rows = points.map((p) => [
    `"${p.id}"`,
    `"${p.timestamp}"`,
    `"${p.surveyorName}"`,
    p.latitude,
    p.longitude,
    p.accuracy ?? '',
    p.source,
    `"${p.kecamatan}"`,
    p.jenisPadi === 'gogo' ? 'Padi Gogo' : 'Padi Sawah',
    p.metodeRekomendasi ? p.metodeRekomendasi.toUpperCase() : 'PUTS',
    p.luasPetak ?? 1,
    p.pStatus,
    p.kStatus,
    p.p2o5Kuantitatif ?? '',
    p.k2oKuantitatif ?? '',
    p.targetUrea,
    p.hasStrawRecycled ? 'Ya' : 'Tidak',
    p.tunggal.urea,
    p.tunggal.sp36,
    p.tunggal.kcl,
    p.majemuk.npk,
    p.majemuk.ureaTambahan,
    p.majemuk.sp36Tambahan ?? 0,
    `"${(p.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Mengonversi array SurveyPoint menjadi FeatureCollection GeoJSON
 */
export function convertPointsToGeoJSON(points: SurveyPoint[]): string {
  const geojson = {
    type: 'FeatureCollection',
    name: 'Survei_Rekomendasi_Pupuk_Presisi_Lampura',
    features: points.map((p) => ({
      type: 'Feature',
      properties: {
        id: p.id,
        surveyor: p.surveyorName,
        waktu: p.timestamp,
        kecamatan: p.kecamatan,
        jenis_padi: p.jenisPadi ?? 'sawah',
        metode_rekomendasi: p.metodeRekomendasi ?? 'puts',
        luas_petak_ha: p.luasPetak ?? 1,
        p_status: p.pStatus,
        k_status: p.kStatus,
        p2o5: p.p2o5Kuantitatif,
        k2o: p.k2oKuantitatif,
        target_urea: p.targetUrea,
        jerami_daur_ulang: p.hasStrawRecycled ?? false,
        urea_tunggal: p.tunggal.urea,
        sp36_tunggal: p.tunggal.sp36,
        kcl_tunggal: p.tunggal.kcl,
        npk_majemuk: p.majemuk.npk,
        urea_majemuk: p.majemuk.ureaTambahan,
        sp36_majemuk_tambahan: p.majemuk.sp36Tambahan ?? 0,
        akurasi_m: p.accuracy,
        sumber: p.source,
        catatan: p.notes,
      },
      geometry: {
        type: 'Point',
        coordinates: [p.longitude, p.latitude],
      },
    })),
  };

  return JSON.stringify(geojson, null, 2);
}

/**
 * Mengunduh file langsung di browser
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * PILIHAN 1: Mengirim seluruh data titik survei ke Webhook Google Sheets
 */
export async function sendSurveyDataToWebhook(
  points: SurveyPoint[],
  webhookUrl: string = DEFAULT_WEBHOOK_URL
): Promise<{ success: boolean; message: string }> {
  if (points.length === 0) {
    return { success: false, message: 'Belum ada data titik survei yang tersimpan.' };
  }

  const cleanUrl = webhookUrl.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL Webhook Google Sheets belum diisi.' };
  }

  if (!navigator.onLine) {
    return {
      success: false,
      message: 'Perangkat sedang offline. Pastikan koneksi internet aktif untuk mengirim ke WebHook.',
    };
  }

  const payload = {
    app: 'Rekomendasi Pemupukan Presisi Padi',
    sentAt: new Date().toISOString(),
    totalPoints: points.length,
    points: points.map((p) => ({
      id: p.id,
      timestamp: p.timestamp,
      surveyor: p.surveyorName,
      latitude: p.latitude,
      longitude: p.longitude,
      accuracy: p.accuracy,
      source: p.source,
      kecamatan: p.kecamatan,
      jenisPadi: p.jenisPadi === 'gogo' ? 'Padi Gogo' : 'Padi Sawah',
      metode: p.metodeRekomendasi ? p.metodeRekomendasi.toUpperCase() : 'PUTS',
      luasPetakHa: p.luasPetak ?? 1,
      pStatus: p.pStatus,
      kStatus: p.kStatus,
      p2o5Lab: p.p2o5Kuantitatif,
      k2oLab: p.k2oKuantitatif,
      targetUrea: p.targetUrea,
      hasStrawRecycled: p.hasStrawRecycled,
      ureaTunggal: p.tunggal.urea,
      sp36Tunggal: p.tunggal.sp36,
      kclTunggal: p.tunggal.kcl,
      npkMajemuk: p.majemuk.npk,
      ureaTambahan: p.majemuk.ureaTambahan,
      sp36Tambahan: p.majemuk.sp36Tambahan ?? 0,
      notes: p.notes,
    })),
  };

  try {
    // Mode no-cors digunakan untuk kompatibilitas redirect 302 Google Apps Script Web App
    await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return {
      success: true,
      message: `Berhasil mengirim ${points.length} titik survei ke WebHook Google Sheets. Periksa spreadsheet tim peneliti Anda.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal mengirim ke WebHook: ${err?.message || 'Periksa kembali URL Webhook Anda.'}`,
    };
  }
}

/**
 * PILIHAN 2: Download data secara lokal.
 * Saat berbentuk aplikasi native (Capacitor Android):
 * - Otomatis membuat folder 'PupukPresisi' di dalam Documents/
 * - Menyimpan berkas CSV & GeoJSON langsung ke dalam folder tersebut.
 * Saat di Web Browser:
 * - Mengunduh otomatis kedua berkas CSV & GeoJSON ke folder Download pengguna.
 */
export async function downloadSurveyDataLocally(
  points: SurveyPoint[]
): Promise<{ success: boolean; message: string; folderName?: string }> {
  if (points.length === 0) {
    return { success: false, message: 'Belum ada data titik survei yang tersimpan.' };
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const csvFileName = `Survei_Pupuk_Presisi_${dateStr}.csv`;
  const geojsonFileName = `Survei_Pupuk_Presisi_${dateStr}.geojson`;
  const csvContent = convertPointsToCSV(points);
  const geojsonContent = convertPointsToGeoJSON(points);

  // 1. Jika berjalan sebagai Native App (Capacitor Android Container)
  if (Capacitor.isNativePlatform()) {
    try {
      const folderName = 'PupukPresisi';

      // Otomatis buat folder 'PupukPresisi' di direktori Documents jika belum ada
      try {
        await Filesystem.mkdir({
          path: folderName,
          directory: Directory.Documents,
          recursive: true,
        });
      } catch (err) {
        // Folder mungkin sudah ada, lanjutkan penulisan file
      }

      // Tulis berkas CSV ke dalam folder Dokumen/PupukPresisi/
      await Filesystem.writeFile({
        path: `${folderName}/${csvFileName}`,
        data: csvContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      // Tulis berkas GeoJSON ke dalam folder Dokumen/PupukPresisi/
      await Filesystem.writeFile({
        path: `${folderName}/${geojsonFileName}`,
        data: geojsonContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      return {
        success: true,
        message: `Berkas CSV & GeoJSON berhasil disimpan otomatis ke folder: Dokumen/PupukPresisi/ pada memori internal perangkat Anda.`,
        folderName: 'Documents/PupukPresisi',
      };
    } catch (e: any) {
      console.warn('Gagal menulis ke Filesystem Capacitor, fallback ke browser download:', e);
    }
  }

  // 2. Jika berjalan di Web Browser: Download kedua file secara lokal
  triggerFileDownload(csvContent, csvFileName, 'text/csv');
  setTimeout(() => {
    triggerFileDownload(geojsonContent, geojsonFileName, 'application/geo+json');
  }, 400);

  return {
    success: true,
    message: `Berkas CSV (${csvFileName}) & GeoJSON (${geojsonFileName}) berhasil diunduh ke folder Download lokal perangkat Anda.`,
  };
}
