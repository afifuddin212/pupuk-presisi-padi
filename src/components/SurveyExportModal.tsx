import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  FileSpreadsheet, 
  Map, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Trash2,
  SendHorizontal,
  Settings
} from 'lucide-react';
import { SurveyPoint } from '../types';
import { 
  convertPointsToCSV, 
  convertPointsToGeoJSON, 
  triggerFileDownload, 
  shareAllSurveyData 
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
  const [showWebhookSetting, setShowWebhookSetting] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const dateStr = new Date().toISOString().slice(0, 10);

  const handleWebhookChange = (url: string) => {
    setWebhookUrl(url);
    try {
      localStorage.setItem('pupuk_presisi_webhook_url', url);
    } catch (e) {
      console.warn('Gagal menyimpan webhook url ke local storage:', e);
    }
  };

  const handleShareAll = async () => {
    setIsSending(true);
    setResultMsg(null);
    try {
      const res = await shareAllSurveyData(points, webhookUrl.trim() || undefined);
      setResultMsg({ success: res.success, text: res.message });
    } catch (e: any) {
      setResultMsg({ success: false, text: e?.message || 'Gagal mengirim data.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadCSV = () => {
    const content = convertPointsToCSV(points);
    triggerFileDownload(content, `Survei_Pupuk_Presisi_${dateStr}.csv`, 'text/csv');
  };

  const handleDownloadGeoJSON = () => {
    const content = convertPointsToGeoJSON(points);
    triggerFileDownload(content, `Survei_Pupuk_Presisi_${dateStr}.geojson`, 'application/geo+json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Kirim &amp; Rekap Data Survei
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total {points.length} Titik Lahan Sawah Tercatat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar">
          {/* Status Banner */}
          {points.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="font-semibold text-sm">Belum ada titik rekomendasi yang disimpan.</p>
              <p className="text-xs mt-1">Gunakan kalkulator pupuk di layar utama untuk merekam titik sawah.</p>
            </div>
          ) : (
            <>
              {/* TOMBOL UTAMA BESAR: KIRIM DATA */}
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl shadow-xl flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-black tracking-tight">KIRIM SEMUA DATA SURVEI</h4>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Kirimkan {points.length} titik lahan sawah langsung ke WhatsApp grup penyuluh &amp; tim peneliti.
                    </p>
                  </div>
                  <SendHorizontal className="w-7 h-7 text-blue-200 shrink-0" />
                </div>

                <button
                  onClick={handleShareAll}
                  disabled={isSending}
                  className="w-full min-h-[52px] py-3.5 px-4 bg-white text-blue-800 hover:bg-blue-50 font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                      <span>Sedang Memproses Pengiriman...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 text-blue-600" />
                      <span>KIRIM DATA SURVEI SEKARANG</span>
                    </>
                  )}
                </button>
              </div>

              {/* Notifikasi Hasil Pengiriman */}
              {resultMsg && (
                <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                  resultMsg.success 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}>
                  {resultMsg.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs font-semibold">{resultMsg.text}</p>
                </div>
              )}

              {/* Opsi Unduh Manual CSV & GeoJSON */}
              <div>
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-2">
                  Atau Unduh Berkas Mentah Manual:
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleDownloadCSV}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-left transition"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Unduh CSV</div>
                      <div className="text-[10px] text-slate-500">Excel / Spreadsheet</div>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadGeoJSON}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-left transition"
                  >
                    <Map className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Unduh GeoJSON</div>
                      <div className="text-[10px] text-slate-500">QGIS / ArcGIS / WebGIS</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pengaturan Webhook Peneliti (Dropdown Toggle) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWebhookSetting(!showWebhookSetting)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold text-[11px]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan Webhook Google Sheets Peneliti (Opsional)</span>
                </button>

                {showWebhookSetting && (
                  <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500">
                      URL Webhook Google Apps Script:
                    </label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={webhookUrl}
                      onChange={(e) => handleWebhookChange(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                    <p className="text-[10px] text-slate-400">
                      Jika diisi, setiap kali menekan 'KIRIM DATA', payload otomatis tercatat di Google Sheets tim peneliti saat perangkat online.
                    </p>
                  </div>
                )}
              </div>

              {/* Tombol Hapus Seluruh Riwayat */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Yakin ingin menghapus seluruh data survei yang tersimpan di perangkat ini?')) {
                      onClearAllPoints();
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 px-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-bold flex items-center justify-center gap-1.5 text-[11px] transition"
                >
                  <Trash2 className="w-4 h-4" />
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

