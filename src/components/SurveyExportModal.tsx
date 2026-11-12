import React, { useState } from 'react';
import { 
  X, 
  SendHorizontal, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  HelpCircle, 
  Copy, 
  Check, 
  FolderDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SurveyPoint } from '../types';
import { 
  sendSurveyDataToWebhook, 
  downloadSurveyDataLocally 
} from '../utils/exportUtils';

interface SurveyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: SurveyPoint[];
  onClearAllPoints: () => void;
}

export const SurveyExportModal: React.FC<SurveyExportModalProps> = ({
  isOpen,
  onClose,
  points,
  onClearAllPoints,
}) => {
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('pupuk_presisi_webhook_url') || '';
    } catch {
      return '';
    }
  });

  const [isSendingWebhook, setIsSendingWebhook] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleWebhookChange = (url: string) => {
    setWebhookUrl(url);
    try {
      localStorage.setItem('pupuk_presisi_webhook_url', url);
    } catch (e) {
      console.warn('Gagal menyimpan webhook url ke local storage:', e);
    }
  };

  // AKSI 1: Kirim ke WebHook Google Sheets
  const handleSendWebhook = async () => {
    if (!webhookUrl.trim()) {
      setResultMsg({
        success: false,
        text: 'Silakan masukkan URL WebHook Google Apps Script terlebih dahulu di kolom input di bawah.',
      });
      return;
    }

    setIsSendingWebhook(true);
    setResultMsg(null);
    try {
      const res = await sendSurveyDataToWebhook(points, webhookUrl);
      setResultMsg({ success: res.success, text: res.message });
    } catch (e: any) {
      setResultMsg({ success: false, text: e?.message || 'Gagal mengirim data ke WebHook.' });
    } finally {
      setIsSendingWebhook(false);
    }
  };

  // AKSI 2: Download Data Lokal (Otomatis Buat Folder)
  const handleDownloadLocal = async () => {
    setIsDownloading(true);
    setResultMsg(null);
    try {
      const res = await downloadSurveyDataLocally(points);
      setResultMsg({ success: res.success, text: res.message });
    } catch (e: any) {
      setResultMsg({ success: false, text: e?.message || 'Gagal mengunduh berkas data lokal.' });
    } finally {
      setIsDownloading(false);
    }
  };

  // Kode Google Apps Script untuk disalin oleh pengguna
  const googleAppsScriptCode = `function doPost(e) {
  try {
    var sheetName = "Data_Survei_Lapangan";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    
    var headers = [
      "ID Titik", "Waktu Catat", "Nama Surveyor", "Latitude", "Longitude",
      "Akurasi (m)", "Sumber Koordinat", "Kecamatan", "Jenis Padi", "Metode",
      "Luas Petak (ha)", "Status P", "Status K", "P2O5 Lab", "K2O Lab",
      "Target Urea (kg/ha)", "Daur Ulang Jerami", "Urea Tunggal (kg/ha)",
      "SP-36 Tunggal (kg/ha)", "KCl Tunggal (kg/ha)", "NPK 15-10-12 (kg/ha)",
      "Urea Tambahan (kg/ha)", "SP-36 Tambahan (kg/ha)", "Catatan", "Waktu Diterima"
    ];
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#059669").setFontColor("#FFFFFF").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    var points = data.points || [];
    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") + " WIB";
    
    var existingIds = [];
    if (sheet.getLastRow() > 1) {
      existingIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat().map(String);
    }
    
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var row = [
        p.id, p.timestamp, p.surveyor, p.latitude, p.longitude,
        p.accuracy, p.source, p.kecamatan, p.jenisPadi, p.metode,
        p.luasPetakHa, p.pStatus, p.kStatus, p.p2o5Lab, p.k2oLab,
        p.targetUrea, p.hasStrawRecycled ? "Ya" : "Tidak", p.ureaTunggal,
        p.sp36Tunggal, p.kclTunggal, p.npkMajemuk, p.ureaTambahan,
        p.sp36Tambahan, p.notes, now
      ];
      
      var idx = existingIds.indexOf(String(p.id));
      if (idx !== -1) {
        sheet.getRange(idx + 2, 1, 1, row.length).setValues([row]);
      } else {
        sheet.appendRow(row);
        existingIds.push(String(p.id));
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", count: points.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Kirim &amp; Rekap Data Survei
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Total <span className="font-bold text-emerald-600 dark:text-emerald-400">{points.length}</span> Titik Lahan Sawah Tercatat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Status jika kosong */}
          {points.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="font-semibold text-sm">Belum ada titik rekomendasi yang disimpan.</p>
              <p className="text-xs mt-1">Gunakan kalkulator pupuk di layar utama untuk merekam titik survei sawah.</p>
            </div>
          ) : (
            <>
              {/* Notifikasi Hasil Aksi */}
              {resultMsg && (
                <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 animate-slideUp ${
                  resultMsg.success 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' 
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                }`}>
                  {resultMsg.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs font-semibold leading-relaxed">{resultMsg.text}</p>
                </div>
              )}

              {/* ======================================================== */}
              {/* PILIHAN 1: PENGIRIMAN DATA LEWAT WEBHOOK GOOGLE SHEET */}
              {/* ======================================================== */}
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                        Pengiriman Data lewat WebHook
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        Sinkronisasi langsung ke Google Sheets tim peneliti secara real-time.
                      </p>
                    </div>
                  </div>
                  <SendHorizontal className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                </div>

                {/* Input URL WebHook */}
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-600 dark:text-slate-300 block">
                    URL WebHook Google Apps Script:
                  </label>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={webhookUrl}
                    onChange={(e) => handleWebhookChange(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                {/* Tombol Eksekusi Kirim Webhook */}
                <button
                  type="button"
                  onClick={handleSendWebhook}
                  disabled={isSendingWebhook}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                >
                  {isSendingWebhook ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim ke Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="w-4 h-4" />
                      <span>KIRIM DATA KE GOOGLE SHEET SEKARANG</span>
                    </>
                  )}
                </button>

                {/* Petunjuk Setup Webhook (Accordion) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-bold text-[10.5px]"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showSetupGuide ? 'Sembunyikan Cara Setup Webhook' : 'Cara Setup WebHook Google Sheet'}</span>
                    {showSetupGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showSetupGuide && (
                    <div className="mt-2.5 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-[11px] leading-relaxed animate-fadeIn">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Langkah Mudah Menghubungkan Google Sheet:
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-[10.5px]">
                        <li>Buka spreadsheet baru di Google Sheets.</li>
                        <li>Klik menu <strong>Ekstensi</strong> ➔ <strong>Apps Script</strong>.</li>
                        <li>Hapus isi yang ada, lalu salin (copy) kode script berikut:</li>
                      </ol>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className="absolute right-2 top-2 px-2 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow hover:bg-slate-700"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
                        </button>
                        <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto text-[9.5px] font-mono max-h-36">
                          {googleAppsScriptCode}
                        </pre>
                      </div>

                      <ol start={4} className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-[10.5px]">
                        <li>Klik tombol biru <strong>Terapkan (Deploy)</strong> ➔ <strong>Penerapan baru (New deployment)</strong>.</li>
                        <li>Pilih jenis: <strong>Aplikasi web (Web app)</strong>.</li>
                        <li>Atur <em>Jalankan sebagai</em>: <strong>Saya</strong>, dan <em>Yang memiliki akses</em>: <strong>Siapa saja (Anyone)</strong>.</li>
                        <li>Klik <strong>Terapkan</strong>, izinkan akses Google, lalu salin URL Aplikasi Web yang berakhiran <code>/exec</code> ke kolom di atas.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* ======================================================== */}
              {/* PILIHAN 2: DOWNLOAD DATA SECARA LOKAL */}
              {/* ======================================================== */}
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                        Download Data secara Lokal
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        Otomatis membuat folder khusus dan menyimpan file CSV &amp; GeoJSON.
                      </p>
                    </div>
                  </div>
                  <FolderDown className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                </div>

                <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 text-[10.5px] text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Manajemen Folder Otomatis:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[10px]">
                    &bull; <strong>Pada Aplikasi Android (.apk)</strong>: Sistem akan otomatis membuat folder <code>Dokumen/PupukPresisi/</code> di memori internal perangkat Anda dan menyimpan kedua file ke dalamnya.<br />
                    &bull; <strong>Pada Web Browser</strong>: Berkas CSV (Excel) dan GeoJSON (Peta GIS) langsung diunduh ke folder Download.
                  </p>
                </div>

                {/* Tombol Eksekusi Download Lokal */}
                <button
                  type="button"
                  onClick={handleDownloadLocal}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sedang Menyimpan Berkas...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD DATA LOKAL SEKARANG (CSV &amp; GeoJSON)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tombol Bersihkan Riwayat */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus seluruh ${points.length} titik survei yang tersimpan di perangkat ini? Tindakan ini tidak dapat dibatalkan.`)) {
                      onClearAllPoints();
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 px-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-bold flex items-center justify-center gap-1.5 text-[11px] transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua Riwayat Titik Survei</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
