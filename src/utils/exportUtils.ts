import { SurveyPoint } from '../types';

/**
 * Mengonversi array SurveyPoint menjadi format CSV
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
    'Status P (PUTS/PUTK)',
    'Status K (PUTS/PUTK)',
    'P2O5 Laboratorium (mg/100g)',
    'K2O Laboratorium (mg/100g)',
    'Target Urea (kg/ha)',
    'Daur Ulang Jerami',
    'Dosis Tunggal Urea (kg/ha)',
    'Dosis Tunggal SP-36 (kg/ha)',
    'Dosis Tunggal KCl (kg/ha)',
    'Dosis Majemuk NPK 15-10-12 (kg/ha)',
    'Dosis Majemuk Urea Tambahan (kg/ha)',
    'Dosis Majemuk SP-36 Tambahan (kg/ha)',
    'Catatan Khusus',
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
    p.jenisPadi === 'gogo' ? 'Padi Gogo/Kering' : 'Padi Sawah',
    p.metodeRekomendasi ? p.metodeRekomendasi.toUpperCase() : 'PUTS',
    p.luasPetak ?? 1,
    p.pStatus,
    p.kStatus,
    p.p2o5Kuantitatif ?? '',
    p.k2oKuantitatif ?? '',
    p.targetUrea,
    p.hasStrawRecycled ? 'Ya (>=5 ton)' : 'Tidak',
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
    name: 'Survei_Rekomendasi_Pupuk_Presisi',
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
 * Mengirim data survei terpadu via Web Share API / WhatsApp / Download
 */
export async function shareAllSurveyData(
  points: SurveyPoint[],
  webhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  if (points.length === 0) {
    return { success: false, message: 'Belum ada data titik survei yang tersimpan.' };
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const csvContent = convertPointsToCSV(points);
  const geojsonContent = convertPointsToGeoJSON(points);

  // 1. Jika ada webhook Google Sheets, kirim payload JSON
  let webhookStatus = '';
  if (webhookUrl && navigator.onLine) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: geojsonContent,
        mode: 'no-cors', // Untuk Google Apps Script webhook
      });
      webhookStatus = ' & berhasil dikirim ke Google Sheets Peneliti';
    } catch (e) {
      console.warn('Gagal menembak webhook Google Sheets:', e);
    }
  }

  // 2. Coba Web Share API (didukung mobile browser & Android WebView)
  if (navigator.share && navigator.canShare) {
    try {
      const csvFile = new File([csvContent], `Survei_Pupuk_Presisi_${dateStr}.csv`, {
        type: 'text/csv',
      });
      const geojsonFile = new File([geojsonContent], `Survei_Pupuk_Presisi_${dateStr}.geojson`, {
        type: 'application/geo+json',
      });

      if (navigator.canShare({ files: [csvFile, geojsonFile] })) {
        await navigator.share({
          title: 'Data Survei Pupuk Presisi Padi Lampung Utara',
          text: `Rekap ${points.length} titik survei pemupukan presisi padi (Permentan 13/2022).`,
          files: [csvFile, geojsonFile],
        });
        return { success: true, message: `Berhasil dibagikan melalui Android Native Share${webhookStatus}.` };
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share API error, fallback to direct download:', err);
      } else {
        return { success: true, message: 'Berbagi data dibatalkan oleh pengguna.' };
      }
    }
  }

  // 3. Fallback: Download file CSV & GeoJSON langsung
  triggerFileDownload(csvContent, `Survei_Pupuk_Presisi_${dateStr}.csv`, 'text/csv');
  setTimeout(() => {
    triggerFileDownload(geojsonContent, `Survei_Pupuk_Presisi_${dateStr}.geojson`, 'application/geo+json');
  }, 400);

  return {
    success: true,
    message: `Berkas CSV & GeoJSON berhasil diunduh ke perangkat Anda${webhookStatus}.`,
  };
}
