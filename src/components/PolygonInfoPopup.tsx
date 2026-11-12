import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calculator, 
  Layers, 
  AlertTriangle, 
  Wheat,
  Table,
  CheckCircle2,
  Sparkles,
  Info,
  Sprout,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { PolygonFeatureInfo, LayerItem, HaraStatus, JenisPadi, MetodeRekomendasi } from '../types';
import { parseKesesuaianString, KELAS_KESESUAIAN_MAP } from '../utils/kesesuaianUtils';
import { getSoilGroupInfo } from '../utils/sptUtils';
import { getLbsBadgeClass } from '../utils/lbsUtils';

interface PolygonInfoPopupProps {
  info: PolygonFeatureInfo | null;
  activeLayers: LayerItem[];
  onClose: () => void;
  onOpenCalculatorForKecamatan: (
    kecamatan: string, 
    pStatus?: HaraStatus, 
    kStatus?: HaraStatus, 
    ureaDasar?: number,
    jenisPadi?: JenisPadi,
    metode?: MetodeRekomendasi
  ) => void;
}

type MainViewMode = 'rekomendasi' | 'kesesuaian' | 'spt';
type TabRekomendasi = 'inasoilagro' | 'permentan' | 'puts' | 'putk';

export const PolygonInfoPopup: React.FC<PolygonInfoPopupProps> = ({
  info,
  activeLayers,
  onClose,
  onOpenCalculatorForKecamatan,
}) => {
  // Tentukan mode tampilan utama berdasarkan sumber layer yang diklik
  const [mainMode, setMainMode] = useState<MainViewMode>('rekomendasi');
  const [activeTab, setActiveTab] = useState<TabRekomendasi>('inasoilagro');
  const [showComparisonTable, setShowComparisonTable] = useState<boolean>(false);
  const [kesesuaianCommodity, setKesesuaianCommodity] = useState<'KSI' | 'KSH' | 'KPG'>('KSI');

  // Sync mode saat info berubah
  useEffect(() => {
    if (info) {
      if (info.layerSource === 'kesesuaian' || (info.properties?.KSI && !info.properties?.KECAMATAN)) {
        setMainMode('kesesuaian');
      } else if (info.layerSource === 'spt' || (info.properties?.SPT && !info.properties?.KECAMATAN)) {
        setMainMode('spt');
      } else {
        setMainMode('rekomendasi');
      }
    }
  }, [info]);

  if (!info) return null;

  const props = info.properties || {};
  const kecName = info.kecamatan || props.KECAMATAN || 'Kecamatan Terpilih';
  const kabName = info.kabupaten || props.KABKOT || 'Lampung Utara';
  const provName = info.provinsi || props.PROVINSI || 'Lampung';

  // Cek layer mana saja yang sedang aktif di peta
  const isLayerActive = (layerId: string) => {
    const l = activeLayers.find((item) => item.id === layerId);
    return l ? l.active : false;
  };

  // Status Hara dari GeoJSON (InaSoilAgro)
  const pPadi = (props.P_PADI as HaraStatus) || 'Rendah';
  const kPadi = (props.K_PADI as HaraStatus) || 'Tinggi';

  // 1. Rekomendasi InaSoilAgro
  const inasoilDose = {
    p: pPadi,
    k: kPadi,
    tunggal: {
      urea: parseInt(props.UREA_T_PAD, 10) || 250,
      sp36: parseInt(props.SP_36_PADI, 10) || 50,
      kcl: parseInt(props.KCl_PADI, 10) || 50,
    },
    majemuk: {
      npk: parseInt(props.NPK_15_10_, 10) || 250,
      urea: parseInt(props.UREA_M_PAD, 10) || 175,
      sp36Tambahan: 0,
    },
    title: 'InaSoilAgro',
    subtitle: 'Data Spasial Peta Rekomendasi',
    badge: 'Data Peta',
    keterangan: 'Rekomendasi bawaan dari atribut layer spasial InaSoilAgro Lampung Utara.',
  };

  // 2. Rekomendasi Permentan 13/2022
  const permentanDose = {
    p: 'Sedang' as HaraStatus,
    k: 'Sedang' as HaraStatus,
    tunggal: {
      urea: 250,
      sp36: 75,
      kcl: 50,
    },
    majemuk: {
      npk: 300,
      urea: 150,
      sp36Tambahan: 0,
    },
    title: 'Permentan 13/2022',
    subtitle: 'Ketetapan Baku Tabel Kecamatan',
    badge: 'Baku Wilayah',
    keterangan: 'Ketetapan resmi Lampiran A Permentan 13/2022 untuk Kecamatan ' + kecName + '.',
  };

  // 3. Rekomendasi Padi Sawah (PUTS)
  const putsDose = {
    p: pPadi,
    k: kPadi,
    tunggal: {
      urea: 250,
      sp36: pPadi === 'Rendah' ? 100 : pPadi === 'Sedang' ? 75 : 50,
      kcl: kPadi === 'Rendah' ? 100 : 50,
    },
    majemuk: {
      npk: pPadi === 'Rendah' ? 375 : pPadi === 'Sedang' ? 300 : 250,
      urea: pPadi === 'Rendah' ? 125 : pPadi === 'Sedang' ? 150 : 175,
      sp36Tambahan: 0,
    },
    title: 'PUTS (Padi Sawah)',
    subtitle: 'Formula Uji Tanah Sawah',
    badge: `Hara P: ${pPadi}, K: ${kPadi}`,
    keterangan: 'Formula uji tanah sawah presisi dengan status hara P & K setempat.',
  };

  // 4. Rekomendasi Padi Gogo / Lahan Kering (PUTK)
  const putkDose = {
    p: pPadi,
    k: kPadi,
    tunggal: {
      urea: 300,
      sp36: pPadi === 'Rendah' ? 200 : pPadi === 'Sedang' ? 150 : 100,
      kcl: kPadi === 'Rendah' ? 100 : kPadi === 'Sedang' ? 75 : 50,
    },
    majemuk: {
      npk: pPadi === 'Rendah' ? 450 : pPadi === 'Sedang' ? 400 : 350,
      urea: pPadi === 'Rendah' ? 150 : pPadi === 'Sedang' ? 175 : 200,
      sp36Tambahan: pPadi === 'Rendah' ? 75 : pPadi === 'Sedang' ? 50 : 0,
    },
    title: 'PUTK (Padi Gogo)',
    subtitle: 'Formula Padi Lahan Kering Masam',
    badge: 'Defisit Fosfat Tinggi',
    keterangan: 'Formula lahan kering masam dengan tambahan SP-36 untuk menutup defisit fosfat.',
  };

  const currentItem = 
    activeTab === 'inasoilagro' ? inasoilDose :
    activeTab === 'permentan' ? permentanDose :
    activeTab === 'puts' ? putsDose : putkDose;

  const handleOpenCalculator = () => {
    let jenisPadi: JenisPadi = 'sawah';
    let metode: MetodeRekomendasi = 'puts';
    let targetUrea = currentItem.tunggal.urea;

    if (activeTab === 'putk') {
      jenisPadi = 'gogo';
      metode = 'putk';
      targetUrea = 300;
    } else if (activeTab === 'permentan') {
      jenisPadi = 'sawah';
      metode = 'permentan';
      targetUrea = 250;
    } else if (activeTab === 'puts') {
      jenisPadi = 'sawah';
      metode = 'puts';
      targetUrea = 250;
    }

    onOpenCalculatorForKecamatan(
      kecName,
      currentItem.p,
      currentItem.k,
      targetUrea,
      jenisPadi,
      metode
    );
    onClose();
  };

  // Data Kesesuaian Lahan
  const kesesuaianField = kesesuaianCommodity === 'KSI' ? 'SSIR' : kesesuaianCommodity === 'KSH' ? 'SSHR' : 'SPGR';
  const rawKesesuaianVal = props[kesesuaianField] || props[kesesuaianCommodity];
  const parsedKesesuaian = parseKesesuaianString(rawKesesuaianVal);
  const kesesuaianAreaHa = props.Shape_Area ? (props.Shape_Area / 10000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : null;

  // Data SPT (Jenis Tanah)
  const soilGroup = getSoilGroupInfo(props.TANAH_1);

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-[2px] animate-fadeIn">
      <div 
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t sm:border border-slate-200 dark:border-slate-800"
        style={{ paddingBottom: 'calc(var(--sab) + 6px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle & Header */}
        <div className="pt-3 px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center bg-slate-50/80 dark:bg-slate-800/50">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-2 sm:hidden" />
          <div className="w-full flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {mainMode === 'kesesuaian' ? (
                  <Sprout className="w-5 h-5 text-emerald-600" />
                ) : mainMode === 'spt' ? (
                  <Layers className="w-5 h-5 text-amber-600" />
                ) : (
                  <MapPin className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Informasi Wilayah Terpilih
                  </span>
                  {info.layerSource && (
                    <span className="text-[9px] font-semibold px-2 py-0.2 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-full">
                      {info.layerSource === 'kesesuaian' ? 'Kesesuaian Lahan' : info.layerSource === 'spt' ? 'Jenis Tanah' : 'Pemupukan'}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  {mainMode === 'spt' && props.SPT ? `Satuan Peta Tanah (SPT) #${props.SPT}` : `Kecamatan ${kecName}`}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Kab. {kabName}, Prov. {provName}
                  {info.coordinates && (
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      Koordinat: {info.coordinates[0].toFixed(5)}, {info.coordinates[1].toFixed(5)}
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

          {/* TAB SWITCHER ANTAR-LAYER TEMATIK UTAMA (Jika beberapa layer aktif atau dipilih) */}
          <div className="w-full mt-3 grid grid-cols-3 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl gap-1 text-xs">
            <button
              type="button"
              onClick={() => setMainMode('rekomendasi')}
              className={`py-1.5 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px] ${
                mainMode === 'rekomendasi'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>Rekomendasi</span>
            </button>

            <button
              type="button"
              onClick={() => setMainMode('kesesuaian')}
              className={`py-1.5 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px] ${
                mainMode === 'kesesuaian'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Kesesuaian</span>
            </button>

            <button
              type="button"
              onClick={() => setMainMode('spt')}
              className={`py-1.5 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px] ${
                mainMode === 'spt'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Jenis Tanah</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar">

          {/* CHIP LAHAN BAKU SAWAH (LBS) JIKA AKTIF / TERDETEKSI */}
          {info.lbsProps && (
            <div className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${getLbsBadgeClass(info.lbsProps.Jenis_Lahan_Sawah).bg}`}>
              <div className="flex items-center gap-2">
                <span className="text-base">🌾</span>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    Lahan Baku Sawah: {info.lbsProps.Jenis_Lahan_Sawah || 'Sawah Aktif'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Luas Petak: {Number(info.lbsProps.Luas_Ha || 0).toFixed(2)} Ha • ID: {info.lbsProps.OBJECTID || '-'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 text-emerald-700">
                LBS 2023
              </span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAMPILAN 1: REKOMENDASI PEMUPUKAN PADI (4 VARIAN)             */}
          {/* ============================================================== */}
          {mainMode === 'rekomendasi' && (
            <div className="space-y-3">
              {/* Header Rekomendasi & Tombol Toggle Bandingkan */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    4 Opsi Rekomendasi Pemupukan:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComparisonTable(!showComparisonTable)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/80"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>{showComparisonTable ? 'Tutup Tabel' : 'Bandingkan Semua'}</span>
                </button>
              </div>

              {/* TAB NAVIGATION PILLS */}
              <div className="grid grid-cols-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                {[
                  { id: 'inasoilagro', label: 'InaSoilAgro', desc: 'Data Peta' },
                  { id: 'permentan', label: 'Permentan', desc: 'Baku Kec.' },
                  { id: 'puts', label: 'PUTS', desc: 'Padi Sawah' },
                  { id: 'putk', label: 'PUTK', desc: 'Padi Gogo' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as TabRekomendasi);
                      setShowComparisonTable(false);
                    }}
                    className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition ${
                      activeTab === tab.id && !showComparisonTable
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-[11px] leading-none">{tab.label}</span>
                    <span className={`text-[8.5px] mt-0.5 ${activeTab === tab.id && !showComparisonTable ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {tab.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* TAMPILAN TABEL PERBANDINGAN KOMPARATIF */}
              {showComparisonTable ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <Table className="w-4 h-4 text-emerald-600" />
                    <span>Matriks Perbandingan Dosis Pemupukan (1 Ha):</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[10.5px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          <th className="py-1.5 pr-2">Metode</th>
                          <th className="py-1.5 px-2">Hara P/K</th>
                          <th className="py-1.5 px-2">Paket Tunggal (U/SP/K)</th>
                          <th className="py-1.5 pl-2">Paket Majemuk (NPK/Urea)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                        <tr>
                          <td className="py-1.5 pr-2 font-bold text-slate-900 dark:text-white">InaSoilAgro</td>
                          <td className="py-1.5 px-2 text-slate-600 dark:text-slate-300">{inasoilDose.p}/{inasoilDose.k}</td>
                          <td className="py-1.5 px-2 text-slate-800 dark:text-slate-200">250 / 50 / 50</td>
                          <td className="py-1.5 pl-2 text-slate-800 dark:text-slate-200">250 + 175</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-2 font-bold text-slate-900 dark:text-white">Permentan 13/2022</td>
                          <td className="py-1.5 px-2 text-slate-600 dark:text-slate-300">Sedang/Sedang</td>
                          <td className="py-1.5 px-2 text-slate-800 dark:text-slate-200">250 / 75 / 50</td>
                          <td className="py-1.5 pl-2 text-slate-800 dark:text-slate-200">300 + 150</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-2 font-bold text-slate-900 dark:text-white">PUTS (Sawah)</td>
                          <td className="py-1.5 px-2 text-slate-600 dark:text-slate-300">{putsDose.p}/{putsDose.k}</td>
                          <td className="py-1.5 px-2 text-slate-800 dark:text-slate-200">250 / {putsDose.tunggal.sp36} / {putsDose.tunggal.kcl}</td>
                          <td className="py-1.5 pl-2 text-slate-800 dark:text-slate-200">{putsDose.majemuk.npk} + {putsDose.majemuk.urea}</td>
                        </tr>
                        <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                          <td className="py-1.5 pr-2 font-bold text-amber-900 dark:text-amber-200">PUTK (Gogo)</td>
                          <td className="py-1.5 px-2 text-amber-800 dark:text-amber-300">{putkDose.p}/{putkDose.k}</td>
                          <td className="py-1.5 px-2 text-amber-900 dark:text-amber-200">300 / {putkDose.tunggal.sp36} / {putkDose.tunggal.kcl}</td>
                          <td className="py-1.5 pl-2 text-amber-900 dark:text-amber-200">
                            {putkDose.majemuk.npk} + {putkDose.majemuk.urea}
                            {putkDose.majemuk.sp36Tambahan > 0 && (
                              <span className="block text-[9.5px] font-bold text-red-600">
                                + SP-36 Tambahan: {putkDose.majemuk.sp36Tambahan} kg
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* KARTU DETAIL REKOMENDASI TERPILIH */
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{currentItem.title}</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                          {currentItem.badge}
                        </span>
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        {currentItem.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Status Hara Tanah */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-xs">
                      <div className="text-[10px] text-slate-500">Status Fosfor (P)</div>
                      <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                        {currentItem.p}
                      </div>
                    </div>
                    <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-xs">
                      <div className="text-[10px] text-slate-500">Status Kalium (K)</div>
                      <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                        {currentItem.k}
                      </div>
                    </div>
                  </div>

                  {/* Dosis Paket Tunggal */}
                  <div className="p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center justify-between">
                      <span>Paket Pupuk Tunggal (kg/ha)</span>
                      <span className="text-emerald-600 font-semibold">1 Musim Tanam</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-[9.5px] text-slate-400">Urea</div>
                        <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                          {currentItem.tunggal.urea} kg
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-[9.5px] text-slate-400">SP-36</div>
                        <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                          {currentItem.tunggal.sp36} kg
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-[9.5px] text-slate-400">KCl</div>
                        <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                          {currentItem.tunggal.kcl} kg
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dosis Paket Majemuk */}
                  <div className="p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center justify-between">
                      <span>Paket Pupuk Majemuk (kg/ha)</span>
                      <span className="text-blue-600 font-semibold">NPK 15-10-12</span>
                    </div>
                    
                    <div className={`grid ${currentItem.majemuk.sp36Tambahan > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 text-center`}>
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-[9.5px] text-slate-400">NPK 15-10-12</div>
                        <div className="font-extrabold text-xs text-blue-700 dark:text-blue-400">
                          {currentItem.majemuk.npk} kg
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-[9.5px] text-slate-400">Urea Tambahan</div>
                        <div className="font-extrabold text-xs text-blue-700 dark:text-blue-400">
                          {currentItem.majemuk.urea} kg
                        </div>
                      </div>
                      {currentItem.majemuk.sp36Tambahan > 0 && (
                        <div className="p-1.5 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 rounded-lg">
                          <div className="text-[9.5px] text-amber-700 dark:text-amber-300 font-bold">SP-36 Tambahan</div>
                          <div className="font-extrabold text-xs text-amber-800 dark:text-amber-200">
                            {currentItem.majemuk.sp36Tambahan} kg
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Catatan SP-36 Tambahan */}
                    {currentItem.majemuk.sp36Tambahan > 0 && (
                      <div className="p-2 bg-amber-100/70 dark:bg-amber-950/80 rounded-lg text-[10.5px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Wajib Tambahan Fosfat:</strong> Petani harus memberikan SP-36 Tambahan sebanyak{' '}
                          <strong>{currentItem.majemuk.sp36Tambahan} kg/ha</strong> untuk mencukupi defisit fosfat tanah masam.
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                    *{currentItem.keterangan}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAMPILAN 2: KESESUAIAN LAHAN PADI                              */}
          {/* ============================================================== */}
          {mainMode === 'kesesuaian' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Kesesuaian Lahan Padi Komoditas:</span>
                </div>
                {kesesuaianAreaHa && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Luas: {kesesuaianAreaHa} Ha
                  </span>
                )}
              </div>

              {/* Sub-komoditas Pill Switcher */}
              <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                {[
                  { id: 'KSI', label: 'Padi Irigasi' },
                  { id: 'KSH', label: 'Tadah Hujan' },
                  { id: 'KPG', label: 'Padi Gogo' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setKesesuaianCommodity(c.id as any)}
                    className={`py-1.5 px-1 rounded-xl font-bold text-xs transition ${
                      kesesuaianCommodity === c.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Kartu Status Kesesuaian */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Kelas Kesesuaian Lahan
                    </div>
                    <div className="text-base font-black flex items-center gap-2 mt-0.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block border border-black/20"
                        style={{ backgroundColor: parsedKesesuaian.kelasColor }}
                      />
                      <span className="text-slate-900 dark:text-white">
                        {parsedKesesuaian.kelasLabel}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    Kode: {rawKesesuaianVal || 'null'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {KELAS_KESESUAIAN_MAP[parsedKesesuaian.kelas]?.desc || 'Status evaluasi biofisik lahan.'}
                </p>

                {/* Faktor Pembatas */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-750">
                  <div className="text-[10.5px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
                    Faktor Pembatas Biofisik ({parsedKesesuaian.faktorList.length}):
                  </div>

                  {parsedKesesuaian.faktorList.length === 0 ? (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tidak ada faktor pembatas mayor yang terdeteksi untuk komoditas ini.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {parsedKesesuaian.faktorList.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/90 dark:border-slate-700 flex items-start gap-2 text-xs"
                        >
                          <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono font-bold rounded text-[10px] shrink-0 mt-0.5">
                            {f.kode}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                              {f.nama}
                            </div>
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400">
                              {f.deskripsi}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-2xl text-[10.5px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Saran Peningkatan:</strong> Lahan berkelas S2 &amp; S3 dapat ditingkatkan produktivitasnya melalui perbaikan retensi hara (aplikasi kapur/dolomit &amp; pupuk kandang) dan ketersediaan hara berimbang.
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAMPILAN 3: SATUAN PETA TANAH (SPT / JENIS TANAH)              */}
          {/* ============================================================== */}
          {mainMode === 'spt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Karakteristik Pedologi &amp; Sifat Tanah:</span>
                </div>
                {props.LUAS_HA && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {Number(props.LUAS_HA).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Ha ({props.PERSEN || '-'}%)
                  </span>
                )}
              </div>

              {/* Kartu Klasifikasi Tanah */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${soilGroup.badgeBg} ${soilGroup.badgeText}`}>
                      {soilGroup.groupName}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {props.TANAH_1 || 'Satuan Tanah'}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 font-mono">
                      USDA: {props.USDA_1 || '-'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    SPT #{props.SPT || '1'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {soilGroup.deskripsi}
                </p>

                {/* Sifat Kimia & Kesuburan Tanah */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-750">
                  <div className="text-[10.5px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
                    Sifat Kimia &amp; Kesuburan:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">Tekstur Tanah</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">
                        {props.TEKSTUR || '-'}
                      </div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">Reaksi Tanah (pH)</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">
                        {props.PH || '-'}
                      </div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">Kapasitas Tukar Kation (KTK)</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">
                        {props.KTK || '-'}
                      </div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">Kejenuhan Basa (KB)</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">
                        {props.KB || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sifat Fisik & Fisiografi */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-750">
                  <div className="text-[10.5px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-2">
                    Fisiografi &amp; Morfologi Lingkungan:
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Bahan Induk (BI):</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{props.BI || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Bentuk Lahan / Landform:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{props.LF || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Relief / Bentuk Wilayah:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{props.RELIEF || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Kemiringan Lereng:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{props.LERENG ? `${props.LERENG}%` : '-'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Drainase Tanah:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{props.DRAINASE || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATATAN PENTING CAVEAT */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">CATATAN PENTING: </span>
              <span>
                Data spasial bersumber dari InaSoilAgro, Permentan No. 13 Tahun 2022, Peta Kesesuaian Lahan BBSDLP, dan Peta Satuan Peta Tanah Lampung Utara. Konsultasikan dengan Petugas Penyuluh Lapangan (PPL) setempat untuk verifikasi lapangan.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className={`${mainMode === 'rekomendasi' && activeTab === 'inasoilagro' ? 'w-full' : 'w-1/3'} py-3 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 text-xs transition`}
          >
            Tutup
          </button>

          {(mainMode !== 'rekomendasi' || activeTab !== 'inasoilagro') && (
            <button
              onClick={handleOpenCalculator}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-xs border border-amber-300"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>
                {mainMode === 'kesesuaian' 
                  ? 'Hitung Dosis untuk Komoditas Ini' 
                  : mainMode === 'spt'
                  ? 'Hitung Pemupukan Wilayah Ini'
                  : `Hitung dengan Luas Petak (${activeTab === 'permentan' ? 'PERMENTAN' : activeTab.toUpperCase()})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
