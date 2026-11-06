import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Calculator, 
  Layers, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Wheat,
  Info
} from 'lucide-react';
import { PolygonFeatureInfo, LayerItem, HaraStatus } from '../types';

interface PolygonInfoPopupProps {
  info: PolygonFeatureInfo | null;
  activeLayers: LayerItem[];
  onClose: () => void;
  onOpenCalculatorForKecamatan: (
    kecamatan: string, 
    pStatus?: HaraStatus, 
    kStatus?: HaraStatus, 
    ureaDasar?: number
  ) => void;
}

export const PolygonInfoPopup: React.FC<PolygonInfoPopupProps> = ({
  info,
  activeLayers,
  onClose,
  onOpenCalculatorForKecamatan,
}) => {
  const [showOtherCrops, setShowOtherCrops] = useState<boolean>(false);

  if (!info) return null;

  const props = info.properties || {};
  const kecName = info.kecamatan || props.KECAMATAN || 'Kecamatan';
  const kabName = info.kabupaten || props.KABKOT || 'Lampung Utara';
  const provName = info.provinsi || props.PROVINSI || 'Lampung';

  // Nilai Rekomendasi Padi Sawah dari GeoJSON (Inasoilagro / Permentan 13/2022)
  const pPadi = (props.P_PADI as HaraStatus) || 'Rendah';
  const kPadi = (props.K_PADI as HaraStatus) || 'Tinggi';
  const ureaTunggal = props.UREA_T_PAD || '250';
  const sp36Tunggal = props.SP_36_PADI || (pPadi === 'Rendah' ? '100' : pPadi === 'Sedang' ? '75' : '50');
  const kclTunggal = props.KCl_PADI || (kPadi === 'Rendah' ? '100' : '50');
  const npkMajemuk = props.NPK_15_10_ || '250';
  const ureaMajemuk = props.UREA_M_PAD || '175';

  // Check layer apa saja yang sedang aktif
  const isLayerActive = (layerId: string) => {
    const l = activeLayers.find((item) => item.id === layerId);
    return l ? l.active : false;
  };

  const activeVectorLayers = activeLayers.filter((l) => l.active);

  const handleOpenCalculator = () => {
    onOpenCalculatorForKecamatan(
      kecName,
      pPadi,
      kPadi,
      parseInt(ureaTunggal, 10) || 250
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px] animate-fadeIn">
      <div 
        className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t sm:border border-slate-200 dark:border-slate-800"
        style={{ paddingBottom: 'calc(var(--sab) + 6px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle & Header */}
        <div className="pt-3 px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center bg-slate-50/70 dark:bg-slate-800/40">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-2 sm:hidden" />
          <div className="w-full flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Informasi Wilayah Terpilih
                  </span>
                  {activeVectorLayers.length > 1 && (
                    <span className="text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded-md">
                      {activeVectorLayers.length} Layer
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Kecamatan {kecName}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Kab. {kabName}, Prov. {provName}
                  {info.coordinates && (
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      Titik Peta: {info.coordinates[0].toFixed(5)}, {info.coordinates[1].toFixed(5)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition shrink-0"
              title="Tutup Pop-up"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Layers Indicator Bar */}
        <div className="px-5 py-2 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
              Layer Aktif ({activeVectorLayers.length}):
            </span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {activeVectorLayers.map((l) => (
              <span
                key={l.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shrink-0 shadow-xs"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: l.legend[0]?.color || '#10b981' }}
                />
                <span className="truncate max-w-[120px]">{l.name.replace(/\(.*?\)/g, '').trim()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable Content: Disusun Rapi per Layer Aktif */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar">
          {/* JIKA SEMUA LAYER NONAKTIF */}
          {activeVectorLayers.length === 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">Semua Layer Vektor Dinonaktifkan</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Aktifkan kembali layer pada tombol Layer (sisi kanan layar) untuk menampilkan informasi spasial.
              </p>
            </div>
          )}
          {/* SECTION 1: LAYER REKOMENDASI PEMUPUKAN INASOILAGRO (JIKA AKTIF) */}
          {isLayerActive('inasoilagro') && (
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 dark:text-emerald-300 text-xs">
                  <Wheat className="w-4 h-4 text-emerald-600" />
                  <span>Rekomendasi Pemupukan Padi Sawah</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-800 dark:text-emerald-200">
                  Permentan 13/2022
                </span>
              </div>

              {/* Status Hara Tanah */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-xs">
                  <div className="text-[10px] text-slate-500">Status Fosfor (P)</div>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {pPadi}
                  </div>
                </div>
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-xs">
                  <div className="text-[10px] text-slate-500">Status Kalium (K)</div>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {kPadi}
                  </div>
                </div>
              </div>

              {/* Dosis Paket Tunggal */}
              <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>Paket Pupuk Tunggal (kg/ha)</span>
                  <span className="text-emerald-600 font-semibold">1 Musim Tanam</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-[10px] text-slate-400">Urea</div>
                    <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{ureaTunggal} kg</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-[10px] text-slate-400">SP-36</div>
                    <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{sp36Tunggal} kg</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-[10px] text-slate-400">KCl</div>
                    <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{kclTunggal} kg</div>
                  </div>
                </div>
              </div>

              {/* Dosis Paket Majemuk Substitusi */}
              <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>Paket Majemuk Substitusi (kg/ha)</span>
                  <span className="text-blue-600 font-semibold">NPK 15-10-12</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-center">
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-[10px] text-slate-400">NPK 15-10-12</div>
                    <div className="font-extrabold text-xs text-blue-700 dark:text-blue-400">{npkMajemuk} kg</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-[10px] text-slate-400">Urea Tambahan</div>
                    <div className="font-extrabold text-xs text-blue-700 dark:text-blue-400">{ureaMajemuk} kg</div>
                  </div>
                </div>
              </div>

              {/* Toggle Info Tanaman Lain (Kedelai & Jagung di GeoJSON) */}
              {(props.UREA_T_JG || props.UREA_T_KDL) && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOtherCrops(!showOtherCrops)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 hover:underline pt-1"
                  >
                    <span>Data Acuan Komoditas Lain (Jagung &amp; Kedelai)</span>
                    {showOtherCrops ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showOtherCrops && (
                    <div className="mt-2 p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                      <div>
                        <strong>Jagung</strong>: Urea {props.UREA_T_JG || '50'} kg, SP-36 {props.SP_36_JG || '50'} kg, KCl {props.KCl_JG || '75'} kg (P: {props.P_JG}, K: {props.K_JG}).
                      </div>
                      <div>
                        <strong>Kedelai</strong>: Urea {props.UREA_T_KDL || '350'} kg, SP-36 {props.SP_36_KDL || '100'} kg, KCl {props.KCl_KDL || '75'} kg (P: {props.P_KDL}, K: {props.K_KDL}).
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: LAYER LAHAN BAKU SAWAH (LBS) JIKA AKTIF */}
          {isLayerActive('lbs') && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <Layers className="w-4 h-4 text-lime-600" />
                <span>Peta Lahan Baku Sawah (LBS)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Status: <strong>Kawasan Lahan Sawah Beririgasi Aktif</strong> (Kecamatan {kecName}).
              </p>
            </div>
          )}

          {/* SECTION 3: LAYER KESESUAIAN LAHAN PADI JIKA AKTIF */}
          {isLayerActive('kesesuaian') && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <Layers className="w-4 h-4 text-green-600" />
                <span>Peta Kesesuaian Lahan Padi</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Kelas Kesesuaian: <strong className="text-emerald-600">S1 (Sangat Sesuai untuk Padi Sawah)</strong>.
              </p>
            </div>
          )}

          {/* SECTION 4: LAYER SATUAN PETA TANAH (SPT) JIKA AKTIF */}
          {isLayerActive('spt') && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Peta Satuan Peta Tanah (SPT)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Ordo / Jenis Tanah Dominan: <strong>Aluvial &amp; Podsolik Merah Kuning</strong>.
              </p>
            </div>
          )}

          {/* SECTION 5: LAYER BATAS ADMINISTRASI JIKA AKTIF */}
          {isLayerActive('batas_desa') && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Batas Administrasi Wilayah</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Kecamatan {kecName}, Kabupaten {kabName}, Provinsi {provName}.
              </p>
            </div>
          )}

          {/* CATATAN PENTING CAVEAT */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">CATATAN: </span>
              <span>Rekomendasi di atas merupakan acuan resmi Permentan 13/2022. Konsultasikan dengan penyuluh (PPL) setempat untuk kondisi riil lahan.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-1/3 py-3 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 text-xs transition"
          >
            Tutup
          </button>

          <button
            onClick={handleOpenCalculator}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-xs border border-emerald-400"
          >
            <Calculator className="w-4 h-4" />
            <span>Buka Kalkulator Kecamatan Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
