import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp, Layers, SlidersHorizontal } from 'lucide-react';
import { LayerItem } from '../types';

interface FloatingMiniLegendProps {
  layers: LayerItem[];
  subTypeKesesuaian?: string;
  isDarkMode?: boolean;
  onOpenLayers?: () => void;
}

export const FloatingMiniLegend: React.FC<FloatingMiniLegendProps> = ({
  layers,
  subTypeKesesuaian,
  onOpenLayers,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Filter layer tematik yang sedang aktif dan memiliki daftar legenda
  const activeThematicLayers = layers.filter(
    (l) => l.active && l.legend && l.legend.length > 0 && l.id !== 'batas_desa'
  );

  // Jika tidak ada layer tematik yang aktif, jangan tampilkan legenda mengambang
  if (activeThematicLayers.length === 0) {
    return null;
  }

  // Ambil sampel warna untuk indikator dot pada tombol ciut (collapsed)
  const sampleColors = activeThematicLayers
    .flatMap((l) => l.legend || [])
    .slice(0, 4)
    .map((item) => item.color);

  return (
    <div className="fixed left-3.5 bottom-14 sm:bottom-16 z-20 pointer-events-auto select-none font-sans">
      {!isExpanded ? (
        // PIL KECIL TERCIUT (COLLAPSED MICRO-PILL)
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 shadow-md text-[11px] font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 group"
          title="Buka Legenda Simbol Warna Peta Aktif"
        >
          <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Legenda</span>
          <div className="flex -space-x-1 ml-0.5 items-center">
            {sampleColors.map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 shadow-2xs"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 ml-0.5" />
        </button>
      ) : (
        // KARTU LEGENDA KOMPAK (EXPANDED DOCK)
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-300/90 dark:border-slate-700 w-64 sm:w-72 max-h-[50vh] flex flex-col overflow-hidden animate-slideUp">
          {/* Header Mini Dock */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Legenda Peta Aktif
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full">
                {activeThematicLayers.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onOpenLayers && (
                <button
                  onClick={onOpenLayers}
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Buka Pengaturan Layer Lengkap"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Ciutkan Legenda"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daftar Legenda Per Layer Aktif */}
          <div className="space-y-3 overflow-y-auto pr-1 text-[11px] divide-y divide-slate-100 dark:divide-slate-800/80">
            {activeThematicLayers.map((layer) => {
              const subTitle =
                layer.id === 'kesesuaian' && subTypeKesesuaian
                  ? subTypeKesesuaian === 'KSI'
                    ? '(Padi Irigasi)'
                    : subTypeKesesuaian === 'KSTH'
                    ? '(Padi Tadah Hujan)'
                    : '(Padi Gogo)'
                  : null;

              return (
                <div key={layer.id} className="pt-2 first:pt-0 space-y-1.5">
                  <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 text-[10.5px]">
                    <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{layer.name}</span>
                    {subTitle && (
                      <span className="text-[9.5px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                        {subTitle}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-1 pl-1">
                    {layer.legend?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-black/25 dark:border-white/20 shrink-0 shadow-2xs"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-snug">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

