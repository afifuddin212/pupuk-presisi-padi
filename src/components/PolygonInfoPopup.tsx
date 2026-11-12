import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { PolygonFeatureInfo, LayerItem, HaraStatus, JenisPadi, MetodeRekomendasi } from '../types';

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

type TabRekomendasi = 'inasoilagro' | 'permentan' | 'puts' | 'putk';

export const PolygonInfoPopup: React.FC<PolygonInfoPopupProps> = ({
  info,
  activeLayers,
  onClose,
  onOpenCalculatorForKecamatan,
}) => {
  const [activeTab, setActiveTab] = useState<TabRekomendasi>('inasoilagro');
  const [showComparisonTable, setShowComparisonTable] = useState<boolean>(false);

  if (!info) return null;

  const props = info.properties || {};
  const kecName = info.kecamatan || props.KECAMATAN || 'Kecamatan';
  const kabName = info.kabupaten || props.KABKOT || 'Lampung Utara';
  const provName = info.provinsi || props.PROVINSI || 'Lampung';

  // Status Hara dari GeoJSON (InaSoilAgro)
  const pPadi = (props.P_PADI as HaraStatus) || 'Rendah';
  const kPadi = (props.K_PADI as HaraStatus) || 'Tinggi';

  // 1. Rekomendasi InaSoilAgro (Data atribut raw GeoJSON)
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

  // 2. Rekomendasi Permentan 13/2022 (Baku per-kecamatan Lampiran A)
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

  // 3. Rekomendasi Padi Sawah (PUTS) dengan nilai hara P & K dari InaSoilAgro
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

  // 4. Rekomendasi Padi Gogo / Lahan Kering (PUTK) dengan nilai hara P & K dari InaSoilAgro
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

  // Pilih item rekomendasi yang sedang aktif
  const currentItem = 
    activeTab === 'inasoilagro' ? inasoilDose :
    activeTab === 'permentan' ? permentanDose :
    activeTab === 'puts' ? putsDose : putkDose;

  // Cek apakah layer rekomendasi padi aktif
  const isLayerActive = (layerId: string) => {
    const l = activeLayers.find((item) => item.id === layerId);
    return l ? l.active : false;
  };

  const isRekomendasiLayerActive = isLayerActive('inasoilagro');

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
    } else {
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

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px] animate-fadeIn">
      <div 
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t sm:border border-slate-200 dark:border-slate-800"
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
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Kecamatan {kecName}
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
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar">
          
          {/* 4 OPSI REKOMENDASI PEMUPUKAN */}
          {isRekomendasiLayerActive ? (
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
                    className={`py-2 px-1 rounded-xl text-center transition flex flex-col items-center justify-center ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 font-semibold'
                    }`}
                  >
                    <span className="text-[11px] leading-tight">{tab.label}</span>
                    <span className="text-[9px] opacity-75 font-normal">{tab.desc}</span>
                  </button>
                ))}
              </div>

              {/* JIKA USER MENGKLIK 'BANDINGKAN SEMUA' */}
              {showComparisonTable ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200">
                      Tabel Perbandingan 4 Rekomendasi (Dosis per Hektar):
                    </span>
                  </div>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-[10.5px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                          <th className="py-1 px-1.5">Metode</th>
                          <th className="py-1 px-1.5">Paket Tunggal (Urea / SP-36 / KCl)</th>
                          <th className="py-1 px-1.5">Paket Majemuk (NPK + Urea Tambahan)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-700/40">
                          <td className="py-1.5 px-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                            a. InaSoilAgro
                          </td>
                          <td className="py-1.5 px-1.5 font-mono">250 / 50 / 50 kg</td>
                          <td className="py-1.5 px-1.5 font-mono">NPK 250 + Urea 175 kg</td>
                        </tr>
                        <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-700/40">
                          <td className="py-1.5 px-1.5 font-bold text-blue-700 dark:text-blue-400">
                            b. Permentan 13/2022
                          </td>
                          <td className="py-1.5 px-1.5 font-mono">250 / 75 / 50 kg</td>
                          <td className="py-1.5 px-1.5 font-mono">NPK 300 + Urea 150 kg</td>
                        </tr>
                        <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-700/40">
                          <td className="py-1.5 px-1.5 font-bold text-teal-700 dark:text-teal-400">
                            c. PUTS (Sawah)
                          </td>
                          <td className="py-1.5 px-1.5 font-mono">250 / 100 / 50 kg</td>
                          <td className="py-1.5 px-1.5 font-mono">NPK 375 + Urea 125 kg</td>
                        </tr>
                        <tr className="hover:bg-slate-100/60 dark:hover:bg-slate-700/40">
                          <td className="py-1.5 px-1.5 font-bold text-amber-700 dark:text-amber-400">
                            d. PUTK (Gogo)
                          </td>
                          <td className="py-1.5 px-1.5 font-mono">300 / 200 / 50 kg</td>
                          <td className="py-1.5 px-1.5 font-mono">
                            NPK 450 + Urea 150 <br />
                            <span className="text-amber-600 font-bold">+ SP-36 Tambahan 75 kg</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    *Semua dosis dalam takaran per-hektar satu musim tanam.
                  </p>
                </div>
              ) : (
                /* TAMPILAN KARTU DETAIL REKOMENDASI AKTIF */
                <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-fadeIn">
                  {/* Judul & Badge Subtitle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 dark:text-emerald-300 text-xs">
                        <span>{currentItem.title}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        {currentItem.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200/60 dark:bg-emerald-900/80 px-2 py-0.5 rounded-full text-emerald-800 dark:text-emerald-200">
                      {currentItem.badge}
                    </span>
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

                    {/* Catatan SP-36 Tambahan Bahasa Jelas */}
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
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">Layer Peta Rekomendasi Dinonaktifkan</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Aktifkan layer 'Peta Rekomendasi Pemupukan Padi' pada menu Layer untuk melihat dosis spasial.
              </p>
            </div>
          )}

          {/* LAYER PENDUKUNG LAINNYA JIKA DIAKTIFKAN */}
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
              <span className="font-bold">CATATAN PENTING: </span>
              <span>Rekomendasi di atas mengacu pada Permentan No. 13 Tahun 2022 dan data spasial. Konsultasikan dengan penyuluh (PPL) setempat untuk kondisi riil lahan.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Tab InaSoilAgro hanya memiliki tombol Tutup, tab lainnya memiliki tombol Hitung dengan Luas Petak */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className={`${activeTab === 'inasoilagro' ? 'w-full' : 'w-1/3'} py-3 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 text-xs transition`}
          >
            Tutup
          </button>

          {activeTab !== 'inasoilagro' && (
            <button
              onClick={handleOpenCalculator}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-xs border border-amber-300"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>Hitung dengan Luas Petak ({activeTab === 'permentan' ? 'PERMENTAN' : activeTab.toUpperCase()})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
