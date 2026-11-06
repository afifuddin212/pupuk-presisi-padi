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
  Layers 
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Pusat Bantuan &amp; Panduan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pupuk Presisi Padi Lampung Utara
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
            <span>Dasar Permentan 13/2022</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 custom-scrollbar leading-relaxed">
          {activeTab === 'panduan' ? (
            /* TAB 1: PANDUAN PENGGUNAAN APLIKASI */
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-1">
                  Panduan Singkat Lapangan (Petani &amp; PPL):
                </h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Aplikasi ini dirancang khusus untuk mempermudah perhitungan pupuk padi di sawah tanpa perlu koneksi internet.
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
                    Tentukan Lokasi Sawah
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Aktifkan tombol <strong>GPS</strong> (atau klik tombol <em>Lokasi Saya</em> di kanan atas) agar aplikasi mendeteksi posisi kecamatan sawah Anda secara otomatis. Anda juga dapat mengetuk langsung poligon kecamatan di peta.
                  </p>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                    Buka Kalkulator Pemupukan
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Ketuk tombol hijau kalkulator besar di pojok kanan bawah layar untuk membuka panel kalkulator.
                  </p>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    Pilih Mode Input Status Hara Tanah
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    • <strong>Mode Kualitatif</strong>: Pilih langsung kategori Rendah, Sedang, atau Tinggi.<br />
                    • <strong>Mode Kuantitatif (PUTS)</strong>: Masukkan nilai angka hasil uji tanah (P₂O₅ &amp; K₂O dalam mg/100g), sistem akan mengonversinya secara otomatis.
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
                    Lihat Rekomendasi Dosis (Tunggal vs Majemuk)
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Aplikasi menampilkan 2 opsi paket pemupukan per hektar:<br />
                    • <strong>Paket Tunggal</strong>: Urea + SP-36 + KCl.<br />
                    • <strong>Paket Majemuk</strong>: Substitusi NPK 15-10-12 + Urea tambahan.
                  </p>
                </div>
              </div>

              {/* Langkah 5 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                  5
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    Rekam &amp; Kirim Data Survei
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Ketik nama Anda di kolom <em>Nama Pencatat</em> lalu klik <strong>Simpan Rekomendasi ke Peta</strong>. Untuk mengirim rekap seluruh titik ke WhatsApp grup tim peneliti/penyuluh, gunakan tombol biru <strong>KIRIM DATA SURVEI</strong>.
                  </p>
                </div>
              </div>

              {/* CATATAN PENTING */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CATATAN PENTING: </span>
                  <span>Konsultasikan hasil ini dengan penyuluh (PPL) setempat untuk membagi waktu aplikasi pupuk (HST) sesuai fase pertumbuhan tanaman padi Anda.</span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: DASAR REGULASI PERMENTAN 13/2022 */
            <div className="space-y-4">
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dasar Hukum Regulasi
                </h4>
                <p>
                  Peraturan Menteri Pertanian Republik Indonesia <strong>Nomor 13 Tahun 2022</strong> tentang 
                  <em> Penggunaan Dosis Pupuk N, P, dan K untuk Padi, Jagung, dan Kedelai pada Lahan Sawah</em>.
                </p>
              </div>

              {/* Ambang Batas PUTS */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                  1. Kriteria Status Hara Tanah (Pasal 6)
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

              {/* Dosis Pupuk Tunggal */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                  2. Formula Rekomendasi Pupuk Tunggal (Pasal 8)
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  <li><strong>Fosfor (SP-36)</strong>: Rendah = 100 kg/ha | Sedang = 75 kg/ha | Tinggi = 50 kg/ha.</li>
                  <li><strong>Kalium (KCl)</strong>: Rendah = 100 kg/ha | Sedang &amp; Tinggi = 50 kg/ha.</li>
                  <li><strong>Urea</strong>: Mengacu pada tabel Lampiran Permentan per kecamatan (23 kecamatan di Lampung Utara memiliki acuan dasar 250 kg/ha).</li>
                </ul>
              </div>

              {/* Dosis Pupuk Majemuk */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                  3. Paket Substitusi Majemuk (Pasal 9 &amp; Lampiran)
                </h4>
                <p className="mb-1 text-slate-600 dark:text-slate-400">
                  Formula <strong>NPK 15-10-12</strong> dikombinasikan dengan Urea penambah:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  <li><strong>P Rendah</strong>: 375 kg NPK + (125 / 175 / 225) kg Urea</li>
                  <li><strong>P Sedang</strong>: 300 kg NPK + (150 / 200 / 250) kg Urea</li>
                  <li><strong>P Tinggi</strong>: 250 kg NPK + (175 / 225 / 275) kg Urea</li>
                </ul>
              </div>

              {/* CATATAN PENTING */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-2xl flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CATATAN PENTING: </span>
                  <span>Konsultasikan hasil ini dengan penyuluh (PPL) setempat.</span>
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
