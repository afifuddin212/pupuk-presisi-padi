import React from 'react';
import { X, Trash2, MapPin, User, Calendar, AlertTriangle, Share2 } from 'lucide-react';
import { SurveyPoint } from '../types';

interface SurveyPointPopupProps {
  point: SurveyPoint | null;
  onClose: () => void;
  onDeletePoint: (id: string) => void;
  onOpenExportModal: () => void;
}

export const SurveyPointPopup: React.FC<SurveyPointPopupProps> = ({
  point,
  onClose,
  onDeletePoint,
  onOpenExportModal,
}) => {
  if (!point) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Titik Hasil Rekomendasi
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {point.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{point.surveyorName}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{point.timestamp}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate col-span-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-semibold">
                Kec. {point.kecamatan} ({point.latitude.toFixed(5)}, {point.longitude.toFixed(5)})
              </span>
            </div>
          </div>

          {/* Status Hara */}
          <div className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Status Hara:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400">
                P: {point.pStatus} {point.p2o5Kuantitatif ? `(${point.p2o5Kuantitatif} mg)` : ''}
              </span>
              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400">
                K: {point.kStatus} {point.k2oKuantitatif ? `(${point.k2oKuantitatif} mg)` : ''}
              </span>
            </div>
          </div>

          {/* Dosis Hasil */}
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs mb-1">
                Paket Pupuk Tunggal (kg/ha):
              </div>
              <div className="flex justify-around text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">Urea</div>
                  <div className="font-extrabold text-emerald-700 dark:text-emerald-400">{point.tunggal.urea} kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">SP-36</div>
                  <div className="font-extrabold text-emerald-700 dark:text-emerald-400">{point.tunggal.sp36} kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">KCl</div>
                  <div className="font-extrabold text-emerald-700 dark:text-emerald-400">{point.tunggal.kcl} kg</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60">
              <div className="font-bold text-blue-900 dark:text-blue-300 text-xs mb-1">
                Paket Majemuk Substitusi:
              </div>
              <div className="flex justify-around text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">NPK 15-10-12</div>
                  <div className="font-extrabold text-blue-700 dark:text-blue-400">{point.majemuk.npk} kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Urea Tambahan</div>
                  <div className="font-extrabold text-blue-700 dark:text-blue-400">{point.majemuk.ureaTambahan} kg</div>
                </div>
              </div>
            </div>
          </div>

          {/* CATATAN PENTING */}
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">CATATAN PENTING: </span>
              <span>Konsultasikan hasil ini dengan penyuluh (PPL) setempat.</span>
            </div>
          </div>

          {point.notes && (
            <div className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
              "{point.notes}"
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
          <button
            onClick={() => onDeletePoint(point.id)}
            className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition"
            title="Hapus Titik Ini"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim Semua Titik Survei</span>
          </button>
        </div>
      </div>
    </div>
  );
};

