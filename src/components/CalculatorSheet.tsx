import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  User, 
  Save, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { HaraStatus, SurveyPoint } from '../types';
import { hitungRekomendasiPupuk } from '../utils/fertilizerCalculator';
import { convertP2O5ToStatus, convertK2OToStatus } from '../utils/putsConverter';

interface CalculatorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  detectedKecamatan: string;
  allKecamatanList: string[];
  currentCoordinates: [number, number] | null;
  gpsAccuracy?: number;
  lastSurveyor: string;
  onSavePoint: (point: Omit<SurveyPoint, 'id' | 'timestamp'>) => void;
  onOpenHelp: () => void;
  onRequestManualPick: () => void;
  isPickingManualLocation: boolean;
}

export const CalculatorSheet: React.FC<CalculatorSheetProps> = ({
  isOpen,
  onClose,
  detectedKecamatan,
  allKecamatanList,
  currentCoordinates,
  gpsAccuracy,
  lastSurveyor,
  onSavePoint,
  onOpenHelp,
  onRequestManualPick,
  isPickingManualLocation,
}) => {
  const [mode, setMode] = useState<'kualitatif' | 'kuantitatif'>('kualitatif');
  
  // Status Hara State
  const [pStatus, setPStatus] = useState<HaraStatus>('Rendah');
  const [kStatus, setKStatus] = useState<HaraStatus>('Tinggi');
  
  // Nilai Kuantitatif PUTS State
  const [p2o5Val, setP2o5Val] = useState<string>('');
  const [k2oVal, setK2oVal] = useState<string>('');

  // Target Dosis Urea Dasar
  const [targetUrea, setTargetUrea] = useState<number>(250);
  
  // Kecamatan & Surveyor Info
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>(detectedKecamatan || 'BUKIT KEMUNING');
  const [surveyorName, setSurveyorName] = useState<string>(lastSurveyor || '');
  const [useCurrentGps, setUseCurrentGps] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Update selectedKecamatan jika terdeteksi baru
  useEffect(() => {
    if (detectedKecamatan) {
      setSelectedKecamatan(detectedKecamatan);
    }
  }, [detectedKecamatan]);

  // Update lastSurveyor jika ada
  useEffect(() => {
    if (lastSurveyor && !surveyorName) {
      setSurveyorName(lastSurveyor);
    }
  }, [lastSurveyor]);

  // Handler update PUTS Kuantitatif
  const handleP2o5Change = (valStr: string) => {
    setP2o5Val(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      setPStatus(convertP2O5ToStatus(num));
    }
  };

  const handleK2oChange = (valStr: string) => {
    setK2oVal(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      setKStatus(convertK2OToStatus(num));
    }
  };

  // Hasil Perhitungan
  const hasil = hitungRekomendasiPupuk(pStatus, kStatus, targetUrea);

  if (!isOpen) return null;

  const handleSave = () => {
    const lat = currentCoordinates ? currentCoordinates[0] : -4.8500;
    const lng = currentCoordinates ? currentCoordinates[1] : 104.7500;

    onSavePoint({
      surveyorName: surveyorName.trim() || 'Petani / Penyuluh',
      latitude: lat,
      longitude: lng,
      accuracy: gpsAccuracy,
      source: useCurrentGps ? 'gps' : 'manual',
      kecamatan: selectedKecamatan,
      pStatus,
      kStatus,
      p2o5Kuantitatif: p2o5Val ? parseFloat(p2o5Val) : undefined,
      k2oKuantitatif: k2oVal ? parseFloat(k2oVal) : undefined,
      targetUrea,
      tunggal: hasil.tunggal,
      majemuk: hasil.majemuk,
      notes,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800"
        style={{ paddingBottom: 'calc(var(--sab) + 8px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle & Header */}
        <div className="pt-3 px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kalkulator Pemupukan Presisi
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenHelp}
                className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                title="Lihat Aturan Permentan 13/2022"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar">
          {/* Deteksi Wilayah Kecamatan */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kecamatan di Lampung Utara (Permentan 13/2022):</span>
              </label>
              {detectedKecamatan && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Terdeteksi Spasial
                </span>
              )}
            </div>

            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500 text-xs"
            >
              {allKecamatanList.length > 0 ? (
                allKecamatanList.map((kec) => (
                  <option key={kec} value={kec}>
                    Kecamatan {kec}
                  </option>
                ))
              ) : (
                <option value="BUKIT KEMUNING">Kecamatan BUKIT KEMUNING</option>
              )}
            </select>
          </div>

          {/* Toggle Mode Input (Kualitatif vs Kuantitatif) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
              Mode Analisis Tanah:
            </label>
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('kualitatif')}
                className={`py-2.5 rounded-xl font-bold text-xs transition ${
                  mode === 'kualitatif'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Mode Kualitatif
              </button>
              <button
                type="button"
                onClick={() => setMode('kuantitatif')}
                className={`py-2.5 rounded-xl font-bold text-xs transition ${
                  mode === 'kuantitatif'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Mode Kuantitatif (PUTS)
              </button>
            </div>
          </div>

          {/* Input Section Berdasarkan Mode */}
          {mode === 'kualitatif' ? (
            <div className="space-y-3">
              {/* Status Hara Fosfor (P) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    1. Status Hara Fosfor (P):
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Dipilih: {pStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Rendah', 'Sedang', 'Tinggi'] as HaraStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setPStatus(status)}
                      className={`min-h-[46px] rounded-xl border font-bold text-xs transition flex items-center justify-center ${
                        pStatus === status
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Hara Kalium (K) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    2. Status Hara Kalium (K):
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Dipilih: {kStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Rendah', 'Sedang', 'Tinggi'] as HaraStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setKStatus(status)}
                      className={`min-h-[46px] rounded-xl border font-bold text-xs transition flex items-center justify-center ${
                        kStatus === status
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Input Kuantitatif P2O5 */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Kadar P₂O₅ (mg / 100 g tanah):
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {pStatus}
                  </span>
                </div>
                <input
                  type="number"
                  placeholder="Contoh: 28.5 (Ambang: &lt;20 Rendah, 20-40 Sedang, &gt;40 Tinggi)"
                  value={p2o5Val}
                  onChange={(e) => handleP2o5Change(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-semibold focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Input Kuantitatif K2O */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Kadar K₂O (mg / 100 g tanah):
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {kStatus}
                  </span>
                </div>
                <input
                  type="number"
                  placeholder="Contoh: 14.2 (Ambang: &lt;10 Rendah, 10-20 Sedang, &gt;20 Tinggi)"
                  value={k2oVal}
                  onChange={(e) => handleK2oChange(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-semibold focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>
          )}

          {/* Pilihan Target Dosis Urea Dasar */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
              Target Dosis Urea Dasar (Target Hasil Panen):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[250, 300, 350].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTargetUrea(val)}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    targetUrea === val
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs">{val} kg/ha</span>
                  <span className="text-[10px] text-slate-500">
                    {val === 250 ? 'Kecamatan' : val === 300 ? 'Sedang' : 'Tinggi'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* KOTAK HASIL REKOMENDASI DOSIS */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Rekomendasi Dosis Pupuk per Hektar (1 Musim):</span>
            </h4>

            {/* Paket Tunggal */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs mb-1.5 flex items-center justify-between">
                <span>[OPSI A] Paket Pupuk Tunggal</span>
                <span className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400">Total Hara Lengkap</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] text-slate-500">Urea</div>
                  <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{hasil.tunggal.urea} <span className="text-[10px] font-normal">kg</span></div>
                </div>
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] text-slate-500">SP-36</div>
                  <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{hasil.tunggal.sp36} <span className="text-[10px] font-normal">kg</span></div>
                </div>
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] text-slate-500">KCl</div>
                  <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{hasil.tunggal.kcl} <span className="text-[10px] font-normal">kg</span></div>
                </div>
              </div>
            </div>

            {/* Paket Majemuk */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/60">
              <div className="font-bold text-blue-900 dark:text-blue-300 text-xs mb-1.5 flex items-center justify-between">
                <span>[OPSI B] Paket Pupuk Majemuk (Substitusi)</span>
                <span className="text-[10px] font-normal text-blue-700 dark:text-blue-400">NPK 15-10-12</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xs border border-blue-100 dark:border-blue-900/50">
                  <div className="text-[10px] text-slate-500">NPK 15-10-12</div>
                  <div className="text-sm font-extrabold text-blue-700 dark:text-blue-400">{hasil.majemuk.npk} <span className="text-[10px] font-normal">kg</span></div>
                </div>
                <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xs border border-blue-100 dark:border-blue-900/50">
                  <div className="text-[10px] text-slate-500">Urea Tambahan</div>
                  <div className="text-sm font-extrabold text-blue-700 dark:text-blue-400">{hasil.majemuk.ureaTambahan} <span className="text-[10px] font-normal">kg</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* CATATAN PENTING CAVEAT RESMI */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">CATATAN PENTING: </span>
              <span>Konsultasikan hasil ini dengan penyuluh (PPL) setempat.</span>
            </div>
          </div>

          {/* FORM PEREKAMAN TITIK KE PETA */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Perekaman Data Titik Survei:</span>
            </h5>

            {/* Nama Pencatat */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Nama Pencatat / Surveyor:
              </label>
              <input
                type="text"
                placeholder="Nama Anda atau Petani / PPL"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Pilihan Titik Lokasi */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="locChoice"
                    checked={useCurrentGps}
                    onChange={() => setUseCurrentGps(true)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Gunakan Posisi GPS Sekarang</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setUseCurrentGps(false);
                    onRequestManualPick();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                    !useCurrentGps
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isPickingManualLocation ? 'Sedang Tap Peta...' : 'Pilih Titik di Peta'}
                </button>
              </div>

              {currentCoordinates && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>Titik Koordinat: {currentCoordinates[0].toFixed(5)}, {currentCoordinates[1].toFixed(5)}</span>
                </div>
              )}
            </div>

            {/* Catatan Tambahan (Opsional) */}
            <div>
              <input
                type="text"
                placeholder="Catatan tambahan (misal: Varietas Ciherang, Umur 15 HST)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Footer Save Action */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saveSuccess}
            className={`w-full min-h-[52px] py-3.5 px-4 font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-sm ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Titik Rekomendasi Tersimpan di Peta!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 text-white" />
                <span>Simpan Rekomendasi ke Peta</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

