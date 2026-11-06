import React from 'react';
import { 
  Compass, 
  MapPin, 
  Sun, 
  Moon, 
  HelpCircle, 
  Navigation, 
  NavigationOff, 
  Share2,
  Layers,
  Calculator,
  Plus,
  Minus,
  X
} from 'lucide-react';

interface FloatingHUDProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  gpsActive: boolean;
  onToggleGPS: () => void;
  gpsAccuracy?: number;
  detectedKecamatan: string;
  onDismissKecamatan: () => void;
  compassHeading?: number;
  onCenterDevice: () => void;
  onOpenHelp: () => void;
  onOpenLayers: () => void;
  onOpenCalculator: () => void;
  onOpenPolygonInfo?: () => void;
  onOpenExport: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  totalSurveyPoints: number;
}

export const FloatingHUD: React.FC<FloatingHUDProps> = ({
  isDarkMode,
  onToggleDarkMode,
  gpsActive,
  onToggleGPS,
  gpsAccuracy,
  detectedKecamatan,
  onDismissKecamatan,
  compassHeading = 0,
  onCenterDevice,
  onOpenHelp,
  onOpenLayers,
  onOpenCalculator,
  onOpenPolygonInfo,
  onOpenExport,
  onZoomIn,
  onZoomOut,
  totalSurveyPoints,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 select-none">
      {/* 1. TOP HEADER & TELEMETRY */}
      <div className="w-full flex flex-col gap-2 pointer-events-auto" style={{ paddingTop: 'var(--sat)' }}>
        {/* Main Logo & Global Action Pill */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          {/* Logo Brands */}
          <div className="flex items-center gap-2 overflow-hidden">
            <img 
              src="./logo/app-icon.svg" 
              alt="App Icon" 
              className="w-8 h-8 rounded-xl shadow-sm border border-emerald-500/20 shrink-0" 
            />
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-700 shrink-0">
              <img src="./logo/logo-kementan.jpg" alt="Kementan" className="h-5 sm:h-6 w-auto object-contain rounded" title="Kementerian Pertanian" />
              <img src="./logo/logo-hiti.png" alt="HITI" className="h-5 sm:h-6 w-auto object-contain rounded" title="Himpunan Ilmu Tanah Indonesia" />
              <img src="./logo/logo-icare.png" alt="ICARE" className="h-5 sm:h-6 w-auto object-contain rounded" title="ICARE" />
            </div>
            <div className="hidden xs:block text-[11px] font-bold text-emerald-800 dark:text-emerald-400 truncate pl-1">
              Lampung Utara
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark/Light Mode */}
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Ganti Tema Terang/Gelap"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

            {/* Help (?) Modal */}
            <button
              onClick={onOpenHelp}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition"
              title="Bantuan & Panduan Aplikasi"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* GPS Status Toggle */}
          <button
            onClick={onToggleGPS}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md backdrop-blur-md border transition ${
              gpsActive 
                ? 'bg-emerald-600/90 text-white border-emerald-400/50' 
                : 'bg-slate-800/85 text-slate-300 border-slate-700'
            }`}
            title="Klik untuk Mengaktifkan/Mematikan Pelacakan GPS"
          >
            {gpsActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>GPS AKTIF {gpsAccuracy ? `(±${gpsAccuracy.toFixed(0)}m)` : ''}</span>
              </>
            ) : (
              <>
                <NavigationOff className="w-3.5 h-3.5 text-slate-400" />
                <span>GPS MATI</span>
              </>
            )}
          </button>

          {/* North Arrow / Center to Device Button */}
          <button
            onClick={onCenterDevice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
            title="Klik untuk Menuju Lokasi Device Anda / Arah Utara"
          >
            <Compass 
              className="w-4 h-4 text-rose-500 transition-transform duration-300" 
              style={{ transform: `rotate(${compassHeading}deg)` }}
            />
            <span>Lokasi Saya</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM AREA: THUMB ZONE & CONTROLS */}
      <div className="w-full flex flex-col gap-2.5 pointer-events-none" style={{ paddingBottom: 'var(--sab)' }}>
        {/* Right Edge Action Stack */}
        <div className="self-end flex flex-col gap-2 pointer-events-auto">
          {/* Zoom In & Out Controls */}
          <div className="flex flex-col bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
              onClick={onZoomIn}
              className="w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 transition"
              title="Perbesar Peta"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onZoomOut}
              className="w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Perkecil Peta"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Tombol Kirim Data Survei */}
          <button
            onClick={onOpenExport}
            className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700 border-2 border-white/50 dark:border-slate-800 relative transition"
            title="Kirim / Rekap Data Survei"
          >
            <Share2 className="w-5 h-5" />
            {totalSurveyPoints > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {totalSurveyPoints}
              </span>
            )}
          </button>

          {/* Tombol Layer & Legenda */}
          <button
            onClick={onOpenLayers}
            className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            title="Manajemen Layer & Legenda Peta"
          >
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Primary Action: Buka Kalkulator Pupuk */}
          <button
            onClick={onOpenCalculator}
            className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center justify-center hover:bg-emerald-700 border-2 border-emerald-400 transition"
            title="Kalkulator Rekomendasi Pemupukan"
          >
            <Calculator className="w-7 h-7" />
          </button>
        </div>

        {/* Bottom Current Location Pill (With Close/Dismiss Option & Detail Popup) */}
        {detectedKecamatan && (
          <div className="w-full pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-slideUp">
            <button 
              onClick={onOpenPolygonInfo || onOpenCalculator}
              className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold truncate hover:text-emerald-600 text-left transition flex-1 mr-2"
              title="Klik untuk Lihat Rekomendasi Pemupukan Wilayah ini"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] text-slate-400 font-normal">Kecamatan:</span>
              <span className="truncate text-emerald-700 dark:text-emerald-400 font-bold">{detectedKecamatan}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-md ml-1 shrink-0">
                Lihat Detail
              </span>
            </button>
            <button
              onClick={onDismissKecamatan}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 ml-1"
              title="Tutup Info Kecamatan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
