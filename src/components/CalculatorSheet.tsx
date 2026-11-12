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
  Sparkles,
  Wheat,
  Info,
  Layers
} from 'lucide-react';
import { HaraStatus, SurveyPoint, JenisPadi, MetodeRekomendasi } from '../types';
import { hitungRekomendasiPupuk } from '../utils/fertilizerCalculator';
import { convertP2O5ToStatus, convertK2OToStatus } from '../utils/putsConverter';
import { findKecamatanByPoint } from '../utils/spatialUtils';

interface CalculatorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  detectedKecamatan: string;
  allKecamatanList: string[];
  currentCoordinates: [number, number] | null;
  userLocation?: [number, number] | null;
  pickedLocation?: [number, number] | null;
  geoJsonData?: any;
  gpsAccuracy?: number;
  lastSurveyor: string;
  initialJenisPadi?: JenisPadi;
  initialMetode?: MetodeRekomendasi;
  initialPStatus?: HaraStatus;
  initialKStatus?: HaraStatus;
  initialTargetUrea?: number;
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
  userLocation,
  pickedLocation,
  geoJsonData,
  gpsAccuracy,
  lastSurveyor,
  initialJenisPadi,
  initialMetode,
  initialPStatus,
  initialKStatus,
  initialTargetUrea,
  onSavePoint,
  onOpenHelp,
  onRequestManualPick,
  isPickingManualLocation,
}) => {
  // Perekaman Titik Survei State (Paling Atas)
  const [surveyorName, setSurveyorName] = useState<string>(lastSurveyor || '');
  const [useCurrentGps, setUseCurrentGps] = useState<boolean>(true);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>(detectedKecamatan || 'BUKIT KEMUNING');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  // Jenis Padi (Sawah vs Gogo) & Metode
  const [jenisPadi, setJenisPadi] = useState<JenisPadi>(initialJenisPadi || 'sawah');
  const [metode, setMetode] = useState<MetodeRekomendasi>(initialMetode || 'puts');
  const [mode, setMode] = useState<'kualitatif' | 'kuantitatif'>('kualitatif');
  
  // Status Hara State
  const [pStatus, setPStatus] = useState<HaraStatus>(initialPStatus || 'Rendah');
  const [kStatus, setKStatus] = useState<HaraStatus>(initialKStatus || 'Tinggi');
  
  // Nilai Kuantitatif Laboratorium
  const [p2o5Val, setP2o5Val] = useState<string>('');
  const [k2oVal, setK2oVal] = useState<string>('');

  // Luas Petak Sawah (Hektar)
  const [luasPetak, setLuasPetak] = useState<string>('1');

  // Target Dosis Urea Dasar (Padi Sawah)
  const [targetUrea, setTargetUrea] = useState<number>(initialTargetUrea || 250);

  // Koreksi Jerami (Hanya Sawah)
  const [hasStrawRecycled, setHasStrawRecycled] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Update initial props jika berubah
  useEffect(() => {
    if (initialJenisPadi) setJenisPadi(initialJenisPadi);
    if (initialMetode) setMetode(initialMetode);
    if (initialPStatus) setPStatus(initialPStatus);
    if (initialKStatus) setKStatus(initialKStatus);
    if (initialTargetUrea) setTargetUrea(initialTargetUrea);
  }, [initialJenisPadi, initialMetode, initialPStatus, initialKStatus, initialTargetUrea]);

  // Update lastSurveyor jika ada
  useEffect(() => {
    if (lastSurveyor && !surveyorName) {
      setSurveyorName(lastSurveyor);
    }
  }, [lastSurveyor]);

  // SINKRONISASI OTOMATIS KECAMATAN:
  // Berdasarkan lokasi GPS pengguna atau titik peta yang diketuk
  useEffect(() => {
    const activeCoords = useCurrentGps 
      ? (userLocation || currentCoordinates) 
      : (pickedLocation || currentCoordinates);

    if (activeCoords && geoJsonData) {
      const kec = findKecamatanByPoint(activeCoords[0], activeCoords[1], geoJsonData);
      if (kec) {
        setSelectedKecamatan(kec.nama);
        setIsAutoDetected(true);
        return;
      }
    }

    if (detectedKecamatan) {
      setSelectedKecamatan(detectedKecamatan);
      setIsAutoDetected(true);
    }
  }, [useCurrentGps, userLocation, pickedLocation, currentCoordinates, geoJsonData, detectedKecamatan, isOpen]);

  // Sinkronisasi jenis padi dan metode yang valid
  const handleSelectJenisPadi = (val: JenisPadi) => {
    setJenisPadi(val);
    if (val === 'gogo') {
      setMetode('putk');
      setTargetUrea(300);
    } else {
      // Sawah
      if (metode === 'putk') {
        setMetode('puts');
      }
    }
  };

  // Handler update Kuantitatif
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

  // Hasil Perhitungan Terpadu
  const hasil = hitungRekomendasiPupuk(
    pStatus,
    kStatus,
    targetUrea,
    jenisPadi,
    metode,
    hasStrawRecycled,
    selectedKecamatan
  );

  const luasVal = parseFloat(luasPetak);
  const luas = !isNaN(luasVal) && luasVal > 0 ? luasVal : 1;

  if (!isOpen) return null;

  const activeCoords = useCurrentGps 
    ? (userLocation || currentCoordinates) 
    : (pickedLocation || currentCoordinates);

  const handleSave = () => {
    const lat = activeCoords ? activeCoords[0] : -4.8500;
    const lng = activeCoords ? activeCoords[1] : 104.7500;

    onSavePoint({
      surveyorName: surveyorName.trim() || 'Petani / Penyuluh',
      latitude: lat,
      longitude: lng,
      accuracy: useCurrentGps ? gpsAccuracy : undefined,
      source: useCurrentGps ? 'gps' : 'manual',
      kecamatan: selectedKecamatan,
      jenisPadi,
      metodeRekomendasi: metode,
      luasPetak: luas,
      pStatus,
      kStatus,
      p2o5Kuantitatif: p2o5Val ? parseFloat(p2o5Val) : undefined,
      k2oKuantitatif: k2oVal ? parseFloat(k2oVal) : undefined,
      targetUrea,
      hasStrawRecycled,
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
        className="w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800"
        style={{ paddingBottom: 'calc(var(--sab) + 8px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle & Header */}
        <div className="pt-3 px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Kalkulator Pemupukan Presisi
                </h3>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                  Permentan 13/2022 &bull; PUTS &bull; PUTK
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenHelp}
                className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                title="Panduan Pemupukan Terpadu"
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
          
          {/* ======================================================== */}
          {/* 1. KOTAK PEREKAMAN DATA TITIK SURVEI & LOKASI LAHAN (PALING ATAS) */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Perekaman Data Titik Survei &amp; Wilayah</span>
              </h5>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                Wajib Diisi
              </span>
            </div>

            {/* Nama Pencatat */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Nama Pencatat / Surveyor / Petani:
              </label>
              <input
                type="text"
                placeholder="Nama Anda atau Petani / PPL"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            {/* Pilihan Titik Lokasi */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
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
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                    !useCurrentGps
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isPickingManualLocation ? 'Sedang Tap Peta...' : 'Pilih Titik di Peta'}</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono bg-white/80 dark:bg-slate-900/70 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span>
                  Koordinat:{' '}
                  {activeCoords
                    ? `${activeCoords[0].toFixed(5)}, ${activeCoords[1].toFixed(5)}`
                    : 'Menunggu koordinat GPS / ketukan peta...'}
                </span>
                {useCurrentGps && gpsAccuracy && (
                  <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ±{gpsAccuracy.toFixed(1)}m
                  </span>
                )}
              </div>
            </div>

            {/* KECAMATAN DI LAMPUNG UTARA (Otomatis Terisi Sesuai GPS / Titik Peta) */}
            <div className="pt-1">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kecamatan di Lampung Utara:</span>
                </label>
                {isAutoDetected && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Terisi Otomatis ({useCurrentGps ? 'GPS' : 'Peta'})</span>
                  </span>
                )}
              </div>

              <select
                value={selectedKecamatan}
                onChange={(e) => {
                  setSelectedKecamatan(e.target.value);
                  setIsAutoDetected(false);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 text-xs shadow-xs"
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

            {/* Catatan Lapangan (Opsional) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Catatan Kondisi Lahan (Opsional):
              </label>
              <input
                type="text"
                placeholder="Contoh: Varietas Inpari 32, fase vegetatif awal..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. PILIHAN JENIS TANAMAN / SAWAH (Sawah vs Gogo) */}
          {/* ======================================================== */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Jenis Tanaman / Lahan:</span>
            </label>
            <div className="grid grid-cols-2 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
              <button
                type="button"
                onClick={() => handleSelectJenisPadi('sawah')}
                className={`py-2 px-2 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center ${
                  jenisPadi === 'sawah'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Padi Sawah</span>
                <span className="text-[9.5px] opacity-85 font-normal">(Lahan Basah / Irigasi)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectJenisPadi('gogo')}
                className={`py-2 px-2 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center ${
                  jenisPadi === 'gogo'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Padi Gogo</span>
                <span className="text-[9.5px] opacity-85 font-normal">(Lahan Kering Masam)</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. PILIHAN METODE REKOMENDASI PEMUPUKAN */}
          {/* ======================================================== */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Metode Rekomendasi Pemupukan:</span>
            </label>

            {jenisPadi === 'sawah' ? (
              <div className="grid grid-cols-2 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
                <button
                  type="button"
                  onClick={() => setMetode('permentan')}
                  className={`py-2 px-2 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center text-center ${
                    metode === 'permentan'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Permentan 13/2022</span>
                  <span className="text-[9.5px] opacity-85 font-normal">Algoritma Status Hara P &amp; K</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMetode('puts')}
                  className={`py-2 px-2 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center text-center ${
                    metode === 'puts'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>PUTS (Uji Sawah)</span>
                  <span className="text-[9.5px] opacity-85 font-normal">Bagan Warna Uji Sawah</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-extrabold flex items-center justify-between">
                  <span>Metode PUTK (Perangkat Uji Tanah Kering / BRMP)</span>
                  <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                    Otomatis Aktif
                  </span>
                </div>
                <p className="text-[10.5px] text-amber-800 dark:text-amber-300">
                  Untuk lahan kering masam, kebutuhan fosfat dihitung hingga 2x lipat dan paket pupuk majemuk menyertakan tambahan SP-36.
                </p>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 4. INPUT HARA TANAH (STATUS P & K KUALITATIF / KUANTITATIF) */}
          {/* ======================================================== */}
          <div className="space-y-3">
            {/* Toggle Kualitatif vs Kuantitatif */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Cara Penentuan Status Hara Tanah:
              </label>
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setMode('kualitatif')}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center ${
                    mode === 'kualitatif'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>Metode Kualitatif</span>
                  <span className="text-[9.5px] font-semibold opacity-85">
                    ({jenisPadi === 'sawah' ? (metode === 'permentan' ? 'Bagan Warna / Permentan' : 'PUTS') : 'PUTK'} Bagan Warna)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('kuantitatif')}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center ${
                    mode === 'kuantitatif'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>Metode Kuantitatif</span>
                  <span className="text-[9.5px] font-semibold opacity-85">(Laboratorium mg/100g)</span>
                </button>
              </div>
            </div>

              {mode === 'kualitatif' ? (
                <div className="space-y-3">
                  {/* Status Hara Fosfor (P) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Status Hara Fosfor (P):
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
                          className={`min-h-[44px] rounded-xl border font-bold text-xs transition flex items-center justify-center ${
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
                        Status Hara Kalium (K):
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
                          className={`min-h-[44px] rounded-xl border font-bold text-xs transition flex items-center justify-center ${
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
                /* Mode Kuantitatif Lab */
                <div className="space-y-3">
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
                      placeholder="Contoh: 18.5 (<20 Rendah, 20-40 Sedang, >40 Tinggi)"
                      value={p2o5Val}
                      onChange={(e) => handleP2o5Change(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-semibold focus:ring-2 focus:ring-emerald-500 text-xs shadow-xs"
                    />
                  </div>

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
                      placeholder="Contoh: 12.0 (<10 Rendah, 10-20 Sedang, >20 Tinggi)"
                      value={k2oVal}
                      onChange={(e) => handleK2oChange(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-semibold focus:ring-2 focus:ring-emerald-500 text-xs shadow-xs"
                    />
                  </div>
                </div>
              )}
            </div>

          {/* ======================================================== */}
          {/* 5. INPUT LUAS PETAK SAWAH PETANI (HEKTAR) */}
          {/* ======================================================== */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase">
                Luas Petak Lahan Petani (Hektar):
              </label>
              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {luas} ha ({Math.round(luas * 10000).toLocaleString('id-ID')} m²)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  placeholder="Contoh: 0.5 atau 1"
                  value={luasPetak}
                  onChange={(e) => setLuasPetak(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-emerald-500 text-xs shadow-xs"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                  ha
                </span>
              </div>

              {/* Tombol Cepat Luas */}
              <div className="flex items-center gap-1">
                {[0.25, 0.5, 0.75, 1, 2].map((quickVal) => (
                  <button
                    key={quickVal}
                    type="button"
                    onClick={() => setLuasPetak(quickVal.toString())}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition ${
                      parseFloat(luasPetak) === quickVal
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {quickVal} ha
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 6. TARGET HASIL UREA & FAKTOR JERAMI (KHUSUS PADI SAWAH) */}
          {/* ======================================================== */}
          {jenisPadi === 'sawah' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                  Target Dosis Urea Dasar (Target Panen):
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
                      <span className="text-[9.5px] text-slate-500">
                        {val === 250 ? '< 5 ton/ha' : val === 300 ? '5-6 ton/ha' : '> 6 ton/ha'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Faktor Jerami */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasStrawRecycled}
                  onChange={(e) => setHasStrawRecycled(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    Pengembalian Jerami Padi Sawah (≥ 5 ton/ha)
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">
                    Daur ulang jerami mencukupi kebutuhan hara Kalium sehingga dosis pupuk KCl dikurangi hingga 0-50 kg/ha.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. KOTAK HASIL REKOMENDASI DOSIS */}
          {/* ======================================================== */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hasil Rekomendasi Dosis ({jenisPadi === 'gogo' ? 'Padi Gogo' : 'Padi Sawah'}):</span>
              </h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                Petak: {luas} ha
              </span>
            </div>

            {/* OPSI A: PAKET PUPUK TUNGGAL */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between">
                <span>[OPSI A] Paket Pupuk Tunggal</span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Total Hara Terpisah</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] text-slate-500 font-medium">Urea</div>
                  <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                    {(hasil.tunggal.urea * luas).toFixed(1).replace(/\.0$/, '')} <span className="text-[10px] font-normal">kg</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 border-t border-slate-100 dark:border-slate-800 pt-0.5">
                    {hasil.tunggal.urea} kg/ha
                  </div>
                </div>
                <div className="p-2 bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] text-slate-500 font-medium">SP-36</div>
                  <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                    {(hasil.tunggal.sp36 * luas).toFixed(1).replace(/\.0$/, '')} <span className="text-[10px] font-normal">kg</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 border-t border-slate-100 dark:border-slate-800 pt-0.5">
                    {hasil.tunggal.sp36} kg/ha
                  </div>
                </div>
                <div className="p-2 bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] text-slate-500 font-medium">KCl</div>
                  <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                    {(hasil.tunggal.kcl * luas).toFixed(1).replace(/\.0$/, '')} <span className="text-[10px] font-normal">kg</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 border-t border-slate-100 dark:border-slate-800 pt-0.5">
                    {hasil.tunggal.kcl} kg/ha
                  </div>
                </div>
              </div>
            </div>

            {/* OPSI B: PAKET PUPUK MAJEMUK (SUBSTITUSI NPK 15-10-12) */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-2">
              <div className="font-bold text-blue-900 dark:text-blue-300 text-xs flex items-center justify-between">
                <span>[OPSI B] Paket Pupuk Majemuk (Substitusi)</span>
                <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400">NPK 15-10-12</span>
              </div>
              
              <div className={`grid ${(hasil.majemuk.sp36Tambahan ?? 0) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 text-center`}>
                <div className="p-2 bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xs border border-blue-100 dark:border-blue-900/50">
                  <div className="text-[10px] text-slate-500 font-medium">NPK 15-10-12</div>
                  <div className="text-sm font-black text-blue-700 dark:text-blue-400 leading-tight">
                    {(hasil.majemuk.npk * luas).toFixed(1).replace(/\.0$/, '')} <span className="text-[10px] font-normal">kg</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 border-t border-slate-100 dark:border-slate-800 pt-0.5">
                    {hasil.majemuk.npk} kg/ha
                  </div>
                </div>
                
                <div className="p-2 bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xs border border-blue-100 dark:border-blue-900/50">
                  <div className="text-[10px] text-slate-500 font-medium">Urea Tambahan</div>
                  <div className="text-sm font-black text-blue-700 dark:text-blue-400 leading-tight">
                    {(hasil.majemuk.ureaTambahan * luas).toFixed(1).replace(/\.0$/, '')} <span className="text-[10px] font-normal">kg</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 border-t border-slate-100 dark:border-slate-800 pt-0.5">
                    {hasil.majemuk.ureaTambahan} kg/ha
                  </div>
                </div>

                {/* Komponen Ketiga Khusus Padi Gogo */}
                {(hasil.majemuk.sp36Tambahan ?? 0) > 0 && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/80 rounded-xl shadow-xs border border-amber-300 dark:border-amber-700">
                    <div className="text-[10px] text-amber-800 dark:text-amber-200 font-bold">SP-36 Tambahan</div>
                    <div className="text-sm font-black text-amber-700 dark:text-amber-300 leading-tight">
                      {((hasil.majemuk.sp36Tambahan ?? 0) * luas).toFixed(1).replace(/\.0$/, '')} <span className="text-[10px] font-normal">kg</span>
                    </div>
                    <div className="text-[9.5px] text-amber-600 dark:text-amber-400 mt-0.5 border-t border-amber-200 dark:border-amber-900 pt-0.5">
                      {hasil.majemuk.sp36Tambahan} kg/ha
                    </div>
                  </div>
                )}
              </div>

              {/* Keterangan Bahasa Jelas untuk SP-36 Tambahan */}
              {(hasil.majemuk.sp36Tambahan ?? 0) > 0 && (
                <div className="p-2 bg-amber-100/70 dark:bg-amber-950/70 rounded-xl text-[10.5px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5 border border-amber-300/50">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pemberian Pupuk Tambahan:</strong> Petani harus memberikan <strong>SP-36 Tambahan</strong> sebanyak{' '}
                    <strong>{((hasil.majemuk.sp36Tambahan ?? 0) * luas).toFixed(1).replace(/\.0$/, '')} kg</strong> (untuk petak {luas} ha) guna mencukupi defisit fosfat tanah masam.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CATATAN PENTING CAVEAT RESMI */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">CATATAN PENTING: </span>
              <span>Rekomendasi di atas mengacu pada {metode === 'permentan' ? 'Algoritma Pemupukan Permentan 13/2022' : jenisPadi === 'gogo' ? 'Panduan Terpadu PUTK / BRMP Padi Gogo' : 'Matriks Terpadu PUTS & Permentan 13/2022'}. Konsultasikan selalu dengan penyuluh (PPL) setempat.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-1/3 py-3 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 text-xs transition"
          >
            Tutup
          </button>

          <button
            onClick={handleSave}
            disabled={saveSuccess}
            className={`flex-1 py-3 px-4 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-xs border ${
              saveSuccess
                ? 'bg-emerald-600 border-emerald-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-emerald-500'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>Titik Berhasil Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Simpan Titik Survei ke Peta</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
