import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calculator, 
  Layers,
  Wheat,
  Info,
  SendHorizontal,
  Download,
  Sprout,
  Sliders,
  FolderDown,
  Sparkles
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HelpTab = 'layer' | 'kalkulator' | 'ekspor' | 'regulasi';

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<HelpTab>('layer');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div 
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Pusat Bantuan &amp; Panduan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pupuk Presisi Padi Lampung Utara &bull; Permentan 13/2022
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition shrink-0"
            title="Tutup Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (4 Tab Ergonomis) */}
        <div className="p-2 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-1 text-[11px] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('layer')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition text-center ${
              activeTab === 'layer'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Layer &amp; Peta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kalkulator')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition text-center ${
              activeTab === 'kalkulator'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Kalkulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ekspor')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition text-center ${
              activeTab === 'ekspor'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <SendHorizontal className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Kirim &amp; Ekspor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('regulasi')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition text-center ${
              activeTab === 'regulasi'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Regulasi</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar leading-relaxed">
          {/* ============================================================ */}
          {/* TAB 1: PENGATURAN LAYER & PETA TEMATIK                       */}
          {/* ============================================================ */}
          {activeTab === 'layer' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
                <Layers className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-xs mb-0.5">
                    Manajemen Multi-Layer &amp; Peta Tematik:
                  </h4>
                  <p className="text-[11px] text-emerald-900 dark:text-emerald-300">
                    Aplikasi menyajikan 5 layer spasial terpadu. Ketuk ikon <strong>Layers</strong> (tumpukan layer) pada panel navigasi bawah (Floating HUD) untuk mengatur visibilitas dan transparansi peta.
                  </p>
                </div>
              </div>

              {/* 5 Layer Spasial */}
              <div className="space-y-2">
                {/* Layer 1 */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      1. Peta Rekomendasi Pemupukan Padi (InaSoilAgro)
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4.5">
                    Menampilkan batas 23 kecamatan di Lampung Utara dengan status hara makro tanah (P &amp; K) serta dosis rekomendasi pemupukan padi bawaan spasial InaSoilAgro.
                  </p>
                </div>

                {/* Layer 2 */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-500 shrink-0" />
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      2. Peta Kesesuaian Lahan Padi (BBSDLP)
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4.5">
                    Mengevaluasi kelayakan biofisik tanah untuk 3 sub-komoditas: <strong>Padi Irigasi</strong>, <strong>Padi Tadah Hujan</strong>, dan <strong>Padi Gogo</strong>.
                    <br />
                    • <strong>Kelas Simbologi</strong>: S1 (Sangat Sesuai - Hijau Tua), S2 (Cukup Sesuai - Hijau Muda), S3 (Sesuai Marginal - Emas), N (Tidak Sesuai - Merah), dan Tidak Dinilai (Abu-abu Slate bertekstur, bukan area sawah).
                    <br />
                    • <strong>Faktor Pembatas</strong>: Menampilkan kendala biofisik spesifik (suhu <em>tc</em>, ketersediaan air <em>wa</em>, drainase/aerasi <em>oa</em>, perakaran <em>rc</em>, retensi hara/pH masam <em>nr</em>, toksisitas <em>xc</em>, erosi <em>eh</em>, bahaya banjir <em>fh</em>).
                  </p>
                </div>

                {/* Layer 3 */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      3. Peta Lahan Baku Sawah (LBS)
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4.5">
                    Delineasi riil 3.408 petak sawah baku di Lampung Utara berdasarkan jenis pengairan: Irigasi Teknis/Semi Teknis, Tadah Hujan, Pasang Surut, dan Rawa Lebak dengan garis pematang putih tegas.
                  </p>
                </div>

                {/* Layer 4 */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0" />
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      4. Peta Jenis Tanah (Satuan Peta Tanah / SPT)
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4.5">
                    Menampilkan ordo dan jenis tanah utama (<em>Latosol</em>, <em>Kambisol</em>, <em>Litosol</em>, <em>Gleysol</em>) beserta sifat kesuburan kimia (pH, KTK, Kejenuhan Basa) dan morfologi lereng/drainase.
                  </p>
                </div>

                {/* Layer 5 */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      5. Batas Administrasi Kecamatan
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4.5">
                    Outline garis batas delineasi 23 kecamatan tanpa isian poligon transparan, berfungsi membingkai wilayah kerja lapangan secara tegas.
                  </p>
                </div>
              </div>

              {/* Tips Navigasi & Legenda Mengambang */}
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-1.5 text-[11px]">
                <h5 className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  Fitur Ergonomi Lapangan:
                </h5>
                <ul className="list-disc pl-4 space-y-1 text-blue-900 dark:text-blue-300">
                  <li><strong>Legenda Mini Mengambang</strong>: Muncul otomatis di pojok kiri atas peta saat layer aktif dibuka, sehingga Anda tidak perlu bolak-balik membuka menu pengaturan layer.</li>
                  <li><strong>Slider Opasitas (Transparansi)</strong>: Sesuaikan kepekatan warna layer (0%–100%) agar citra satelit atau batas petak sawah di bawahnya tetap terlihat jelas.</li>
                  <li><strong>Klik Luar Wilayah untuk Deselect</strong>: Menyentuh area di luar Kabupaten Lampung Utara otomatis membatalkan pilihan poligon aktif.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PENGGUNAAN KALKULATOR REKOMENDASI PEMUPUKAN           */}
          {/* ============================================================ */}
          {activeTab === 'kalkulator' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
                <Calculator className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-amber-200 text-xs mb-0.5">
                    Kalkulator Pemupukan Presisi Padi:
                  </h4>
                  <p className="text-[11px] text-amber-900 dark:text-amber-300">
                    Menghitung takaran pupuk berimbang nyata siap tebar berdasarkan luas petak sawah dan status hara tanah setempat.
                  </p>
                </div>
              </div>

              {/* Tahapan Kalkulator */}
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
                      1
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Perekaman Titik Survei &amp; Deteksi Lokasi Otomatis
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7">
                    • Terletak di kotak paling atas kalkulator agar tidak terlewat.<br />
                    • Masukkan nama surveyor/petani.<br />
                    • <strong>Kecamatan Terisi Otomatis</strong>: Sistem membaca otomatis nama kecamatan dari koordinat GPS perangkat atau titik sawah yang Anda ketuk di peta.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
                      2
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Pilihan Komoditas &amp; Metode Rekomendasi
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7">
                    • <strong>Padi Sawah</strong>: Pilihan metode <em>Permentan 13/2022</em> (algoritma status hara tanah) atau <em>PUTS (Uji Sawah)</em>.<br />
                    • <strong>Padi Gogo</strong>: Menggunakan metode <em>PUTK (Tanah Kering Masam)</em> dengan penyesuaian fiksasi fosfat tinggi.<br />
                    • <em>InaSoilAgro</em>: Data acuan spasial bawaan peta kecamatan dapat dilihat langsung pada kartu pop-up poligon di peta.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
                      3
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Input Luas Petak &amp; Status Hara Tanah
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7">
                    • <strong>Luas Petak (Ha)</strong>: Masukkan luasan petak nyata (misal: 0.25 ha, 0.5 ha, 1 ha) agar hasil takaran pupuk langsung dalam kilogram siap tebar.<br />
                    • <strong>Metode Kualitatif</strong>: Pilih Rendah, Sedang, atau Tinggi sesuai hasil warna reaksi uji tanah (PUTS/PUTK).<br />
                    • <strong>Metode Kuantitatif</strong>: Masukkan angka uji laboratorium (P₂O₅ dan K₂O).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
                      4
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Target Hasil Panen &amp; Daur Ulang Jerami
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7">
                    • Pilih target tonase (&lt;5 ton, 5–6 ton, atau &gt;6 ton/ha).<br />
                    • Aktifkan opsi <strong>Daur Ulang Jerami</strong> jika jerami panen dikembalikan ke sawah untuk menghemat kebutuhan pupuk Kalium (KCl) hingga 50%.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
                      5
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Hasil Rekomendasi Ganda &amp; SP-36 Tambahan
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7">
                    • <strong>Paket Tunggal</strong>: Takaran Urea + SP-36 + KCl.<br />
                    • <strong>Paket Majemuk</strong>: Takaran NPK 15-10-12 subsidi + Urea penutup defisit.<br />
                    • <strong>Wajib SP-36 Tambahan (Padi Gogo)</strong>: Pada lahan masam, sistem menghitung otomatis kekurangan fosfat: <em>"Petani harus memberikan SP-36 Tambahan sebanyak [X] kg"</em>.<br />
                    • Ketuk <strong>SIMPAN DATA TITIK KE PETA</strong> untuk menyimpan data ke memori offline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PEREKAMAN & EKSPOR DATA                               */}
          {/* ============================================================ */}
          {activeTab === 'ekspor' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5">
                <SendHorizontal className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-950 dark:text-blue-200 text-xs mb-0.5">
                    Pengiriman &amp; Unduh Data Lapangan:
                  </h4>
                  <p className="text-[11px] text-blue-900 dark:text-blue-300">
                    Aplikasi menyediakan 2 jalur pengiriman data yang sangat praktis dan bebas ribet untuk tim survei lapangan:
                  </p>
                </div>
              </div>

              {/* Jalur 1: Webhook */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                    Pengiriman Data lewat WebHook Google Sheets (Otomatis)
                  </h5>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-8">
                  • <strong>Terintegrasi Otomatis</strong>: Aplikasi telah dikonfigurasi terhubung langsung ke Google Sheets tim peneliti.<br />
                  • Cukup ketuk tombol <strong>KIRIM DATA SEKARANG</strong>.<br />
                  • Seluruh titik survei yang direkam akan tersinkronisasi ke tab spreadsheet secara real-time begitu perangkat terhubung ke internet.
                </p>
              </div>

              {/* Jalur 2: Download Lokal */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                    Download Data secara Lokal (Offline-First)
                  </h5>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-8">
                  • <strong>Aplikasi Android (APK/Capacitor)</strong>: Sistem otomatis membuat folder khusus <code>PupukPresisi</code> di dalam direktori <code>Documents/</code> memori internal perangkat Anda, dan menyimpan berkas <strong>CSV</strong> dan <strong>GeoJSON</strong>.<br />
                  • <strong>Web Browser</strong>: Mengunduh langsung berkas CSV &amp; GeoJSON ke folder Download perangkat Anda.<br />
                  • Berkas dapat dibuka langsung di Microsoft Excel, Google MyMaps, QGIS, atau dibagikan ke WhatsApp grup petani.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: DASAR REGULASI & FORMULA TERPADU                      */}
          {/* ============================================================ */}
          {activeTab === 'regulasi' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-2xl border border-purple-200 dark:border-purple-800/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-950 dark:text-purple-200 text-xs mb-0.5">
                    Landasan Regulasi &amp; Pustaka:
                  </h4>
                  <p className="text-[11px] text-purple-900 dark:text-purple-300">
                    Mengacu pada <strong>Permentan No. 13 Tahun 2022</strong> dipadukan dengan pedoman teknis Balitbangtan/BBSDLP untuk <strong>PUTS (Uji Sawah)</strong> dan <strong>PUTK / BRMP (Uji Tanah Kering Masam)</strong>.
                  </p>
                </div>
              </div>

              {/* Tabel Status Hara */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1.5 text-xs">
                  1. Ambang Batas Status Hara Tanah (Pasal 6 Permentan 13/2022)
                </h5>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
                      <tr>
                        <th className="p-2">Status</th>
                        <th className="p-2">Fosfor (P₂O₅)</th>
                        <th className="p-2">Kalium (K₂O)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="p-2 font-bold text-rose-600">Rendah</td>
                        <td className="p-2">&lt; 20 mg/100g</td>
                        <td className="p-2">&lt; 10 mg/100g</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-amber-600">Sedang</td>
                        <td className="p-2">20 – 40 mg/100g</td>
                        <td className="p-2">10 – 20 mg/100g</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-emerald-600">Tinggi</td>
                        <td className="p-2">&gt; 40 mg/100g</td>
                        <td className="p-2">&gt; 20 mg/100g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formula Padi Sawah */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                  2. Formula Rekomendasi Padi Sawah (PUTS &amp; Permentan 13/2022)
                </h5>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                  <li><strong>Target Urea Dasar</strong>: 250 kg/ha (&lt;5 ton), 300 kg/ha (5-6 ton), atau 350 kg/ha (&gt;6 ton).</li>
                  <li><strong>SP-36</strong>: Rendah = 100 kg/ha | Sedang = 75 kg/ha | Tinggi = 50 kg/ha.</li>
                  <li><strong>KCl</strong>: Rendah = 100 kg/ha | Sedang &amp; Tinggi = 50 kg/ha.</li>
                  <li><strong>Koreksi Jerami</strong>: Pengembalian jerami segar ≥ 5 ton/ha menurunkan kebutuhan KCl menjadi 0–50 kg/ha.</li>
                  <li><strong>Paket Majemuk Resmi</strong>: Substitusi NPK 15-10-12 (250–375 kg/ha) ditambah Urea penutup defisit nitrogen.</li>
                </ul>
              </div>

              {/* Formula Padi Gogo */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-2xl space-y-1 text-amber-950 dark:text-amber-200">
                <h5 className="font-bold text-xs flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-amber-600 shrink-0" />
                  3. Formula Khusus Padi Gogo / Lahan Kering (PUTK / BRMP)
                </h5>
                <p className="text-[11px] text-amber-900 dark:text-amber-300">
                  Pada tanah kering masam (Ultisol/Podsolik), terjadi fiksasi fosfat yang sangat tinggi oleh ion Al³⁺ dan Fe³⁺. Oleh karena itu:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-900 dark:text-amber-300">
                  <li>Kebutuhan pupuk Fosfat (SP-36) mencapai <strong>2 kali lipat</strong> (100–200 kg/ha).</li>
                  <li>Target Urea dasar baku ditetapkan <strong>300 kg/ha</strong>.</li>
                  <li><strong>Wajib SP-36 Tambahan</strong>: Pupuk subsidi NPK 15-10-12 hanya memiliki 10% fosfat, sehingga petani <strong>harus memberikan SP-36 Tambahan (50–75 kg/ha)</strong> pada paket majemuk agar kebutuhan hara fosfat tanaman tercukupi.</li>
                </ul>
              </div>

              {/* Ketetapan Baku Permentan */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/70 space-y-1">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                  4. Ketetapan Baku Per-Kecamatan di Lampung Utara (Lampiran A)
                </h5>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Untuk seluruh 23 kecamatan di Kabupaten Lampung Utara, lampiran Permentan 13/2022 menetapkan dosis baku sawah:
                  <br />
                  • <strong>Paket Tunggal</strong>: Urea 250 kg/ha, SP-36 75 kg/ha, KCl 50 kg/ha.
                  <br />
                  • <strong>Paket Majemuk</strong>: NPK 15-10-12 300 kg/ha + Urea Tambahan 150 kg/ha.
                </p>
              </div>

              {/* Catatan Konsultasi PPL */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CATATAN PENTING: </span>
                  <span>Rekomendasi di atas merupakan acuan ilmiah resmi. Konsultasikan jadwal pemupukan (fase vegetatif dan generatif) serta kondisi air sawah dengan penyuluh (PPL) setempat.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition text-xs flex items-center justify-center gap-1.5"
          >
            <span>Tutup Panduan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
