import React, { useState, useEffect, useRef } from 'react';
import { MapView } from './components/MapView';
import { FloatingHUD } from './components/FloatingHUD';
import { LayerManagerSheet } from './components/LayerManagerSheet';
import { CalculatorSheet } from './components/CalculatorSheet';
import { HelpModal } from './components/HelpModal';
import { SurveyPointPopup } from './components/SurveyPointPopup';
import { SurveyExportModal } from './components/SurveyExportModal';
import { PolygonInfoPopup } from './components/PolygonInfoPopup';
import { LayerItem, SurveyPoint, PolygonFeatureInfo, HaraStatus, JenisPadi, MetodeRekomendasi } from './types';
import { 
  getAllSurveyPoints, 
  saveSurveyPoint, 
  deleteSurveyPoint, 
  clearAllSurveyPoints,
  getLastSurveyorName,
  saveLastSurveyorName
} from './utils/storageUtils';
import { getAllKecamatanList, findKecamatanByPoint } from './utils/spatialUtils';

export function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data Spasial & Peta State
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [allKecamatanList, setAllKecamatanList] = useState<string[]>([]);
  const [detectedKecamatan, setDetectedKecamatan] = useState<string>('BUKIT KEMUNING');
  const [activeBasemap, setActiveBasemap] = useState<'osm' | 'satellite'>('osm');
  const [centerTrigger, setCenterTrigger] = useState<number>(0);

  // GPS / GNSS Hardware State
  const [gpsActive, setGpsActive] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | undefined>(undefined);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const watchIdRef = useRef<number | null>(null);

  // Manual Picking State
  const [isPickingManualLocation, setIsPickingManualLocation] = useState<boolean>(false);
  const [pickedLocation, setPickedLocation] = useState<[number, number] | null>(null);

  // Survey Data State
  const [surveyPoints, setSurveyPoints] = useState<SurveyPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<SurveyPoint | null>(null);
  const [lastSurveyor, setLastSurveyor] = useState<string>('');

  // UI Modal / Sheet State
  const [selectedPolygonInfo, setSelectedPolygonInfo] = useState<PolygonFeatureInfo | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [calculatorPrefill, setCalculatorPrefill] = useState<{
    jenisPadi?: JenisPadi;
    metode?: MetodeRekomendasi;
    pStatus?: HaraStatus;
    kStatus?: HaraStatus;
    targetUrea?: number;
  }>({});

  // Daftar Layer Spasial
  const [layers, setLayers] = useState<LayerItem[]>([
    {
      id: 'inasoilagro',
      name: 'Peta Rekomendasi Pemupukan Padi',
      active: true,
      available: true,
      filename: 'rekomendasi_pupuk_padi_lampura.geojson',
      legend: [
        { label: 'P Rendah (Urea 250, SP36 100, KCl 50-100)', color: '#f59e0b' },
        { label: 'P Sedang (Urea 250, SP36 75, KCl 50)', color: '#10b981' },
        { label: 'P Tinggi (Urea 250, SP36 50, KCl 50)', color: '#3b82f6' },
      ],
    },
    {
      id: 'lbs',
      name: 'Peta Lahan Baku Sawah (LBS)',
      active: false,
      available: false,
      legend: [{ label: 'Sawah Irigasi Aktif', color: '#84cc16' }],
    },
    {
      id: 'kesesuaian',
      name: 'Peta Kesesuaian Lahan Padi',
      active: false,
      available: false,
      legend: [{ label: 'S1 (Sangat Sesuai)', color: '#22c55e' }],
    },
    {
      id: 'spt',
      name: 'Peta Satuan Peta Tanah (SPT / Jenis Tanah)',
      active: false,
      available: false,
      legend: [{ label: 'Tanah Aluvial & Podsolik', color: '#a855f7' }],
    },
    {
      id: 'batas_desa',
      name: 'Batas Administrasi Desa & Kecamatan',
      active: true,
      available: true,
      legend: [{ label: 'Garis Batas Kecamatan', color: '#059669' }],
    },
  ]);

  // 1. Terapkan Dark Mode ke Dokumen HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 2. Muat Data GeoJSON dan Titik Survei Tersimpan Saat Startup
  useEffect(() => {
    fetch('./base-data/rekomendasi_pupuk_padi_lampura.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeoJsonData(data);
        const kecs = getAllKecamatanList(data);
        setAllKecamatanList(kecs);
      })
      .catch((err) => console.error('Gagal memuat GeoJSON Lampung Utara:', err));

    getAllSurveyPoints().then((pts) => setSurveyPoints(pts));
    getLastSurveyorName().then((name) => setLastSurveyor(name));

    if (window.DeviceOrientationEvent) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) {
          setCompassHeading(Math.round(e.alpha));
        }
      };
      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }
  }, []);

  // 3. Manajemen Daya & Sensor GNSS / GPS (Battery Governance)
  useEffect(() => {
    if (!gpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
          setGpsAccuracy(pos.coords.accuracy);

          // Cek posisi kecamatan otomatis
          if (geoJsonData) {
            const kec = findKecamatanByPoint(lat, lng, geoJsonData);
            if (kec) {
              setDetectedKecamatan(kec.nama);
            }
          }
        },
        (err) => {
          console.warn('Geolocation watch error:', err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 2000,
        }
      );

      watchIdRef.current = id;
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [gpsActive, geoJsonData]);

  // Handler Toggle Layer
  const handleToggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  // Handler Simpan Titik Rekomendasi
  const handleSaveSurveyPoint = async (data: Omit<SurveyPoint, 'id' | 'timestamp'>) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} WIB`;
    const newId = `SMP-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(surveyPoints.length + 1).padStart(3, '0')}`;

    const newPoint: SurveyPoint = {
      ...data,
      id: newId,
      timestamp: timeStr,
    };

    const updated = await saveSurveyPoint(newPoint);
    setSurveyPoints(updated);
    await saveLastSurveyorName(data.surveyorName);
    setLastSurveyor(data.surveyorName);
    setPickedLocation(null);
  };

  // Handler Hapus Titik
  const handleDeletePoint = async (id: string) => {
    const updated = await deleteSurveyPoint(id);
    setSurveyPoints(updated);
    setSelectedPoint(null);
  };

  // Handler Hapus Semua Titik
  const handleClearAll = async () => {
    await clearAllSurveyPoints();
    setSurveyPoints([]);
  };

  // Update otomatis kecamatan terdeteksi setiap kali ada koordinat baru atau GeoJSON termuat
  useEffect(() => {
    if (!geoJsonData) return;
    const targetLoc = pickedLocation || userLocation;
    if (targetLoc) {
      const kec = findKecamatanByPoint(targetLoc[0], targetLoc[1], geoJsonData);
      if (kec) {
        setDetectedKecamatan(kec.nama);
      }
    }
  }, [pickedLocation, userLocation, geoJsonData]);

  // Handler Klik Koordinat di Peta (Mendukung Manual Pick di Bidang Sawah)
  const handleMapClick = (coords: [number, number]) => {
    if (isPickingManualLocation) {
      setPickedLocation(coords);
      if (geoJsonData) {
        const kec = findKecamatanByPoint(coords[0], coords[1], geoJsonData);
        if (kec) {
          setDetectedKecamatan(kec.nama);
        }
      }
      setIsPickingManualLocation(false);
      setIsCalculatorOpen(true); // Buka kembali kalkulator dengan koordinat yang telah dipilih
    }
  };

  // Zoom Handler
  const handleZoomIn = () => {
    const map = (window as any)._leafletMapInstance;
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = (window as any)._leafletMapInstance;
    if (map) map.zoomOut();
  };

  // Handler Buka Pop-up Detail Poligon untuk Kecamatan Terdeteksi
  const handleOpenInfoForDetectedKecamatan = () => {
    if (!detectedKecamatan || !geoJsonData) return;
    const feat = geoJsonData.features?.find(
      (f: any) => f.properties?.KECAMATAN?.toUpperCase() === detectedKecamatan.toUpperCase()
    );
    if (feat) {
      setSelectedPolygonInfo({
        kecamatan: detectedKecamatan,
        kabupaten: feat.properties?.KABKOT || 'Lampung Utara',
        provinsi: feat.properties?.PROVINSI || 'Lampung',
        properties: feat.properties,
        coordinates: userLocation || undefined,
      });
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-slate-900 select-none">
      {/* 1. Leaflet Interactive Map View */}
      <MapView
        geoJsonData={geoJsonData}
        activeBasemap={activeBasemap}
        layers={layers}
        userLocation={userLocation}
        gpsAccuracy={gpsAccuracy}
        gpsActive={gpsActive}
        surveyPoints={surveyPoints}
        selectedKecamatan={detectedKecamatan}
        pickedLocation={pickedLocation}
        onSelectSurveyPoint={(pt) => setSelectedPoint(pt)}
        onKecamatanDetected={(kec) => setDetectedKecamatan(kec)}
        onPolygonSelect={(info) => setSelectedPolygonInfo(info)}
        onMapClickCoordinates={handleMapClick}
        isPickingManualLocation={isPickingManualLocation}
        isDarkMode={isDarkMode}
        centerTrigger={centerTrigger}
      />

      {/* 2. Floating Heads-Up Display (HUD) */}
      <FloatingHUD
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        gpsActive={gpsActive}
        onToggleGPS={() => setGpsActive(!gpsActive)}
        gpsAccuracy={gpsAccuracy}
        detectedKecamatan={detectedKecamatan}
        onDismissKecamatan={() => setDetectedKecamatan('')}
        compassHeading={compassHeading}
        onCenterDevice={() => setCenterTrigger((prev) => prev + 1)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenLayers={() => setIsLayersOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenPolygonInfo={handleOpenInfoForDetectedKecamatan}
        onOpenExport={() => setIsExportOpen(true)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        totalSurveyPoints={surveyPoints.length}
      />

      {/* 3. Detail Poligon & Rekomendasi Spasial Pop-up (Multi-Layer Vector Info) */}
      <PolygonInfoPopup
        info={selectedPolygonInfo}
        activeLayers={layers}
        onClose={() => setSelectedPolygonInfo(null)}
        onOpenCalculatorForKecamatan={(kec, pStatus, kStatus, ureaDasar, jenisPadi, metode) => {
          setDetectedKecamatan(kec);
          setCalculatorPrefill({
            jenisPadi,
            metode,
            pStatus,
            kStatus,
            targetUrea: ureaDasar,
          });
          setIsCalculatorOpen(true);
        }}
      />

      {/* 4. Layer Manager Sheet */}
      <LayerManagerSheet
        isOpen={isLayersOpen}
        onClose={() => setIsLayersOpen(false)}
        layers={layers}
        onToggleLayer={handleToggleLayer}
        activeBasemap={activeBasemap}
        onChangeBasemap={(bm) => setActiveBasemap(bm)}
      />

      {/* 5. Calculator Bottom Sheet */}
      <CalculatorSheet
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        detectedKecamatan={detectedKecamatan}
        allKecamatanList={allKecamatanList}
        currentCoordinates={pickedLocation || userLocation}
        userLocation={userLocation}
        pickedLocation={pickedLocation}
        geoJsonData={geoJsonData}
        gpsAccuracy={pickedLocation ? undefined : gpsAccuracy}
        lastSurveyor={lastSurveyor}
        initialJenisPadi={calculatorPrefill.jenisPadi}
        initialMetode={calculatorPrefill.metode}
        initialPStatus={calculatorPrefill.pStatus}
        initialKStatus={calculatorPrefill.kStatus}
        initialTargetUrea={calculatorPrefill.targetUrea}
        onSavePoint={handleSaveSurveyPoint}
        onOpenHelp={() => setIsHelpOpen(true)}
        onRequestManualPick={() => {
          setIsCalculatorOpen(false);
          setIsPickingManualLocation(true);
        }}
        isPickingManualLocation={isPickingManualLocation}
      />

      {/* 6. Help Modal (Cara Penggunaan & Permentan No. 13/2022) */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 7. Detail Titik Survei Pop-up */}
      <SurveyPointPopup
        point={selectedPoint}
        onClose={() => setSelectedPoint(null)}
        onDeletePoint={handleDeletePoint}
        onOpenExportModal={() => {
          setSelectedPoint(null);
          setIsExportOpen(true);
        }}
      />

      {/* 8. Kirim Data Survei Terpadu Modal */}
      <SurveyExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        points={surveyPoints}
        onClearAllPoints={handleClearAll}
      />
    </div>
  );
}
