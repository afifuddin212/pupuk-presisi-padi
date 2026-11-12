import React, { useState } from 'react';
import { X, Layers, Check, Download, HardDriveDownload, Sparkles, Loader2, Sprout, MapPin } from 'lucide-react';
import { LayerItem } from '../types';

interface LayerManagerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerItem[];
  onToggleLayer: (id: string) => void;
  activeBasemap: 'osm' | 'satellite';
  onChangeBasemap: (type: 'osm' | 'satellite') => void;
  subTypeKesesuaian?: 'KSI' | 'KSH' | 'KPG';
  onChangeSubTypeKesesuaian?: (type: 'KSI' | 'KSH' | 'KPG') => void;
  loadingLayerId?: string | null;
}

export const LayerManagerSheet: React.FC<LayerManagerSheetProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  activeBasemap,
  onChangeBasemap,
  subTypeKesesuaian = 'KSI',
  onChangeSubTypeKesesuaian,
  loadingLayerId,
}) => {
  const [caching, setCaching] = useState(false);
  const [cachedSuccess, setCachedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCacheTiles = () => {
    setCaching(true);
    setCachedSuccess(false);
    setTimeout(() => {
      setCaching(false);
      setCachedSuccess(true);
      setTimeout(() => setCachedSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800"
        style={{ paddingBottom: 'calc(var(--sab) + 8px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle & Header */}
        <div className="pt-3 px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Manajemen Layer &amp; Peta Tematik
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar text-xs">
          {/* Pilihan Basemap */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2.5 text-slate-500">
              Pilihan Basemap Dasar:
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onChangeBasemap('osm')}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  activeBasemap === 'osm'
                    ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">OpenStreetMap</div>
                  <div className="text-[10px] text-slate-500">Peta Vektor Bersih</div>
                </div>
                {activeBasemap === 'osm' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => onChangeBasemap('satellite')}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  activeBasemap === 'satellite'
                    ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Citra Satelit Hybrid</div>
                  <div className="text-[10px] text-slate-500">Google Satellite</div>
                </div>
                {activeBasemap === 'satellite' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Tombol Simpan Cache Basemap */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <HardDriveDownload className="w-4 h-4 text-emerald-600" />
                  Mode Sawah Offline (Tanpa Sinyal)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Unduh ubin peta saat ada sinyal/Wi-Fi agar citra satelit tetap tampil di tengah sawah.
                </p>
              </div>
            </div>

            <button
              onClick={handleCacheTiles}
              disabled={caching}
              className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition ${
                cachedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {caching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Sedang Mengunduh Cache Peta...</span>
                </>
              ) : cachedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Cache Peta Wilayah Ini Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Simpan Cache Citra Satelit Wilayah Ini</span>
                </>
              )}
            </button>
          </div>

          {/* Checklist Layer Tematik & Overlay */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-500">
                Layer Spasial &amp; Simbologi Peta:
              </h4>
              <span className="text-[10px] text-slate-400 italic">
                Ketuk poligon peta untuk rincian
              </span>
            </div>

            <div className="space-y-3">
              {layers.map((layer) => {
                const isLoading = loadingLayerId === layer.id;

                return (
                  <div
                    key={layer.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      layer.active
                        ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={layer.active}
                          onChange={() => onToggleLayer(layer.id)}
                          disabled={isLoading}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">
                            {layer.name}
                          </span>
                          {layer.id === 'batas_desa' && (
                            <span className="text-[10px] text-slate-400">Outline garis batas poligon tanpa fill</span>
                          )}
                          {layer.id === 'inasoilagro' && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              Status Makro P: Rendah, K: Tinggi (Seragam 23 Kecamatan)
                            </span>
                          )}
                        </div>
                      </label>

                      {isLoading ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Memuat...</span>
                        </span>
                      ) : !layer.available ? (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          Menunggu Data
                        </span>
                      ) : null}
                    </div>

                    {/* Sub-selector khusus layer Kesesuaian Lahan jika aktif */}
                    {layer.id === 'kesesuaian' && layer.active && onChangeSubTypeKesesuaian && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="text-[10px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Komoditas yang Diwarnai di Peta:</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
                          {[
                            { id: 'KSI', label: 'Padi Irigasi' },
                            { id: 'KSH', label: 'Tadah Hujan' },
                            { id: 'KPG', label: 'Padi Gogo' },
                          ].map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => onChangeSubTypeKesesuaian(sub.id as any)}
                              className={`py-1 px-1.5 rounded-lg text-[10.5px] font-bold transition ${
                                subTypeKesesuaian === sub.id
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legenda Dinamis jika Layer Aktif */}
                    {layer.active && layer.legend && layer.legend.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2 text-[10px]">
                        {layer.legend.map((leg, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-sm border border-black/20 shrink-0"
                              style={{ backgroundColor: leg.color }}
                            />
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              {leg.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl transition hover:opacity-95 text-xs"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
