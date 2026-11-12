import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  MapPin, 
  Calculator, 
  Share2, 
  Layers,
  Wheat,
  Info,
  Table
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'regulasi'>('panduan');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Pusat Bantuan &amp; Panduan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pupuk Presisi Padi Lampung Utara &bull; Permentan 13/2022
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

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('panduan')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'panduan'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Cara Penggunaan</span>
          </button>

          <button
            onClick={() => setActiveTab('regulasi')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'regulasi'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dasar &amp; Formula Terpadu</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar leading-relaxed">
          {activeTab === 'panduan' ? (
            /* TAB 1: PANDUAN PENGGUNAAN APLIKASI */
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-1">
                  Panduan Lapangan untuk Petani &amp; Penyuluh (PPL):
                </h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Aplikasi ini membantu menentukan takaran pupuk berimbang untuk <strong>Padi Sawah</strong> dan <strong>Padi Gogo</strong> secara presisi sesuai kondisi tanah setempat.
                </p>
              </div>

              {/* Langkah 1 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Pilih Wilayah Kecamatan di Peta
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Ketuk langsung salah satu poligon kecamatan di peta. Akan muncul pop-up yang menyajikan <strong>4 jenis rekomendasi</strong>:
                    <br />
                    • <strong>InaSoilAgro</strong>: Sesuai data spasial peta.
                    <br />
                    • <strong>Permentan 13/2022</strong>: Dosis baku tabel kecamatan.
                    <br />
                    • <strong>PUTS (Padi Sawah)</strong>: Formula uji sawah presisi.
                    <br />
                    • <strong>PUTK (Padi Gogo)</strong>: Formula lahan kering masam.
                    <br />
                    Gunakan tombol <em>Bandingkan Semua</em> untuk melihat tabel perbandingan secara langsung.
                  </p>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-amber-500" />
                    Buka Kalkulator Pemupukan Presisi
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Ketuk tombol besar berwarna <strong>kuning keemasan</strong> (bertuliskan <strong>HITUNG</strong>) di pojok kanan bawah layar atau tombol <em>Hitung dengan Luas Petak</em> dari pop-up kecamatan.
                  </p>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                    Pilih Jenis Tanaman &amp; Metode Rekomendasi
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    • <strong>Padi Sawah</strong>: Anda dapat memilih metode <em>Permentan 13/2022</em> (algoritma presisi status hara P &amp; K) atau <em>PUTS (Uji Sawah)</em>.<br />
                    • <strong>Padi Gogo</strong>: Menggunakan metode <em>PUTK (Perangkat Uji Tanah Kering / BRMP)</em> yang khusus disesuaikan untuk tanah kering masam.
                  </p>
                </div>
              </div>

              {/* Langkah 4 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    Isi Luas Petak &amp; Status Hara Tanah
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    • <strong>Luas Petak (ha)</strong>: Masukkan luasan petak sawah petani (contoh: 0.25 ha, 0.5 ha, 1 ha) agar hasil takaran pupuk langsung dalam kilogram nyata siap tebar.<br />
                    • <strong>Metode Kualitatif</strong>: Pilih langsung Rendah / Sedang / Tinggi sesuai warna uji PUTS/PUTK.<br />
                    • <strong>Metode Kuantitatif</strong>: Masukkan angka laboratorium (P₂O₅ dan K₂O).
                  </p>
                </div>
              </div>

              {/* Langkah 5 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  5
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    Simpan Titik &amp; Kirim Data ke Peneliti
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Simpan titik survei langsung ke peta offline Anda. Gunakan tombol <strong>KIRIM DATA SURVEI</strong> untuk membagikan data rekapitulasi (CSV/GeoJSON) ke WhatsApp grup penyuluh atau langsung ke webhook Google Sheets peneliti.
                  </p>
                </div>
              </div>

              {/* CATATAN PENTING */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CATATAN PENTING: </span>
                  <span>Konsultasikan hasil ini dengan penyuluh (PPL) setempat untuk mengatur jadwal pemupukan (fase vegetatif dan generatif) serta kondisi air sawah.</span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: DASAR REGULASI & FORMULA TERPADU */
            <div className="space-y-4">
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Landasan Regulasi &amp; Pustaka
                </h4>
                <p>
                  Mengacu pada <strong>Permentan No. 13 Tahun 2022</strong> tentang Dosis Pupuk N, P, K untuk Lahan Sawah, dipadukan dengan standar teknis <strong>Uji Tanah Sawah (PUTS)</strong> dan <strong>Uji Tanah Kering (PUTK / BRMP)</strong>.
                </p>
              </div>

              {/* Ambang Batas Kuantitatif */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                  1. Ambang Batas Status Hara Tanah (Pasal 6 Permentan 13/2022)
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
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
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
                  2. Formula Rekomendasi Padi Sawah (PUTS &amp; Permentan 13/2022)
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  <li><strong>Target Urea Dasar</strong>: 250 kg/ha (&lt;5 ton), 300 kg/ha (5-6 ton), atau 350 kg/ha (&gt;6 ton).</li>
                  <li><strong>SP-36</strong>: Rendah = 100 kg/ha | Sedang = 75 kg/ha | Tinggi = 50 kg/ha.</li>
                  <li><strong>KCl</strong>: Rendah = 100 kg/ha | Sedang &amp; Tinggi = 50 kg/ha.</li>
                  <li><strong>Koreksi Jerami</strong>: Pengembalian jerami segar ≥ 5 ton/ha menurunkan kebutuhan KCl menjadi 0–50 kg/ha.</li>
                  <li><strong>Paket Majemuk Resmi</strong>: Substitusi NPK 15-10-12 (250–375 kg/ha) ditambah Urea penutup defisit nitrogen.</li>
                </ul>
              </div>

              {/* Formula Padi Gogo */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-amber-600" />
                  3. Formula Khusus Padi Gogo / Lahan Kering (PUTK / BRMP)
                </h4>
                <p className="text-[11px] text-amber-900 dark:text-amber-300">
                  Pada tanah kering masam (Ultisol/Podsolik), terjadi fiksasi fosfat yang sangat tinggi oleh ion Al³⁺ dan Fe³⁺. Oleh karena itu:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-amber-900 dark:text-amber-300 text-[11px]">
                  <li>Kebutuhan pupuk Fosfat (SP-36) mencapai <strong>2 kali lipat</strong> (100–200 kg/ha).</li>
                  <li>Target Urea dasar baku ditetapkan <strong>300 kg/ha</strong>.</li>
                  <li><strong>Wajib SP-36 Tambahan</strong>: Pupuk subsidi NPK 15-10-12 hanya memiliki 10% fosfat, sehingga petani <strong>harus memberikan SP-36 Tambahan (50–75 kg/ha)</strong> pada paket majemuk agar kebutuhan hara fosfat tanaman tercukupi.</li>
                </ul>
              </div>

              {/* Ketetapan Permentan Baku Kecamatan */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
                  4. Ketetapan Baku Per-Kecamatan di Lampung Utara (Lampiran A)
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Untuk seluruh 23 kecamatan di Kabupaten Lampung Utara, lampiran Permentan 13/2022 menetapkan dosis baku sawah:
                  <br />
                  • <strong>Paket Tunggal</strong>: Urea 250 kg/ha, SP-36 75 kg/ha, KCl 50 kg/ha.
                  <br />
                  • <strong>Paket Majemuk</strong>: NPK 15-10-12 300 kg/ha + Urea Tambahan 150 kg/ha.
                </p>
              </div>

              {/* CATATAN PENTING */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CATATAN PENTING: </span>
                  <span>Rekomendasi di atas merupakan acuan resmi. Konsultasikan dengan penyuluh pertanian lapangan (PPL) setempat untuk implementasi riil.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition text-xs flex items-center justify-center gap-2"
          >
            <span>Tutup Panduan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
