import React, { useState } from 'react';
import { 
  X, 
  SendHorizontal, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  FolderDown,
  ExternalLink
} from 'lucide-react';
import { SurveyPoint } from '../types';
import { 
  DEFAULT_WEBHOOK_URL,
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
  const [isSendingWebhook, setIsSendingWebhook] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  // AKSI 1: Kirim ke WebHook Google Sheets (Otomatis terhubung ke Spreadsheet Tim Peneliti)
  const handleSendWebhook = async () => {
    setIsSendingWebhook(true);
    setResultMsg(null);
    try {
      const res = await sendSurveyDataToWebhook(points, DEFAULT_WEBHOOK_URL);
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



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
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

              {/* Pengingat Status Titik Lokal */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <span className="text-base shrink-0">💡</span>
                <p className="font-semibold text-[11px] leading-snug">
                  Anda memiliki <strong>{points.length}</strong> titik survei lokal. Jangan lupa kirimkan data setelah selesai bertugas.
                </p>
              </div>

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

                {/* Status Sambungan WebHook Otomatis */}
                <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 rounded-2xl flex items-center justify-between text-[10.5px] gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      Target: <strong className="text-blue-800 dark:text-blue-200 font-mono">Google Sheets Tim Peneliti</strong>
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 rounded-full shrink-0 border border-blue-200 dark:border-blue-800">
                    Terhubung
                  </span>
                </div>

                {/* Tombol Eksekusi Kirim Webhook Langsung */}
                <button
                  type="button"
                  onClick={handleSendWebhook}
                  disabled={isSendingWebhook}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                >
                  {isSendingWebhook ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim data ke Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="w-4 h-4" />
                      <span>KIRIM DATA SEKARANG</span>
                    </>
                  )}
                </button>
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
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs"
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
