import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LayerItem, SurveyPoint, PolygonFeatureInfo } from '../types';
import { findKecamatanByPoint, findFeatureByPoint } from '../utils/spatialUtils';
import { getSoilGroupInfo } from '../utils/sptUtils';
import { getLbsColor } from '../utils/lbsUtils';

interface MapViewProps {
  geoJsonData: any;
  adminBoundariesData?: any;
  kesesuaianData?: any;
  subTypeKesesuaian?: 'KSI' | 'KSH' | 'KPG';
  lbsData?: any;
  sptData?: any;
  activeBasemap: 'osm' | 'satellite';
  layers: LayerItem[];
  userLocation: [number, number] | null;
  gpsAccuracy?: number;
  gpsActive: boolean;
  surveyPoints: SurveyPoint[];
  selectedKecamatan: string;
  pickedLocation: [number, number] | null;
  onSelectSurveyPoint: (point: SurveyPoint) => void;
  onKecamatanDetected: (kecamatan: string) => void;
  onMapClickCoordinates: (coords: [number, number]) => void;
  onPolygonSelect?: (info: PolygonFeatureInfo) => void;
  isPickingManualLocation: boolean;
  isDarkMode: boolean;
  centerTrigger: number;
}

export const MapView: React.FC<MapViewProps> = ({
  geoJsonData,
  adminBoundariesData,
  kesesuaianData,
  subTypeKesesuaian = 'KSI',
  lbsData,
  sptData,
  activeBasemap,
  layers,
  userLocation,
  gpsAccuracy,
  gpsActive,
  surveyPoints,
  selectedKecamatan,
  pickedLocation,
  onSelectSurveyPoint,
  onKecamatanDetected,
  onMapClickCoordinates,
  onPolygonSelect,
  isPickingManualLocation,
  isDarkMode,
  centerTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer Refs untuk masing-masing dataset spasial
  const adminBoundariesLayerRef = useRef<L.GeoJSON | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const kesesuaianLayerRef = useRef<L.GeoJSON | null>(null);
  const lbsLayerRef = useRef<L.GeoJSON | null>(null);
  const sptLayerRef = useRef<L.GeoJSON | null>(null);

  // Markers
  const surveyMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const pickedMarkerLayerRef = useRef<L.LayerGroup | null>(null);

  // Sync ref agar callback Leaflet membaca state terkini (mencegah stale closure)
  const isPickingManualLocationRef = useRef(isPickingManualLocation);
  isPickingManualLocationRef.current = isPickingManualLocation;

  const onPolygonSelectRef = useRef(onPolygonSelect);
  onPolygonSelectRef.current = onPolygonSelect;

  const onMapClickCoordinatesRef = useRef(onMapClickCoordinates);
  onMapClickCoordinatesRef.current = onMapClickCoordinates;

  const onKecamatanDetectedRef = useRef(onKecamatanDetected);
  onKecamatanDetectedRef.current = onKecamatanDetected;

  const geoJsonDataRef = useRef(geoJsonData);
  geoJsonDataRef.current = geoJsonData;

  const kesesuaianDataRef = useRef(kesesuaianData);
  kesesuaianDataRef.current = kesesuaianData;

  const sptDataRef = useRef(sptData);
  sptDataRef.current = sptData;

  const lbsDataRef = useRef(lbsData);
  lbsDataRef.current = lbsData;

  // Helper untuk cek status keaktifan layer
  const isLayerActive = (id: string) => {
    const l = layers.find((item) => item.id === id);
    return l ? l.active : false;
  };

  // Helper untuk membangun PolygonFeatureInfo yang terintegrasi
  const triggerPolygonSelect = (
    lat: number,
    lng: number,
    source: 'rekomendasi_padi' | 'kesesuaian' | 'spt' | 'lbs',
    primaryProps: any
  ) => {
    if (isPickingManualLocationRef.current || !onPolygonSelectRef.current) return;

    // Deteksi kecamatan
    const gData = geoJsonDataRef.current;
    let kecName = primaryProps.KECAMATAN || '';
    let kabName = primaryProps.KABKOT || 'Lampung Utara';
    let provName = primaryProps.PROVINSI || 'Lampung';

    if (!kecName && gData) {
      const detected = findKecamatanByPoint(lat, lng, gData);
      if (detected) {
        kecName = detected.nama;
        kabName = detected.kabupaten;
        provName = detected.provinsi;
      }
    }

    // Cek fitur beririsan dari layer aktif lain
    let kProps = source === 'kesesuaian' ? primaryProps : null;
    let sProps = source === 'spt' ? primaryProps : null;
    let lProps = source === 'lbs' ? primaryProps : null;

    if (!kProps && kesesuaianDataRef.current && isLayerActive('kesesuaian')) {
      const f = findFeatureByPoint(lat, lng, kesesuaianDataRef.current);
      if (f) kProps = f.properties;
    }

    if (!sProps && sptDataRef.current && isLayerActive('spt')) {
      const f = findFeatureByPoint(lat, lng, sptDataRef.current);
      if (f) sProps = f.properties;
    }

    onPolygonSelectRef.current({
      kecamatan: kecName,
      kabupaten: kabName,
      provinsi: provName,
      properties: primaryProps,
      coordinates: [lat, lng],
      layerSource: source,
      kesesuaianProps: kProps,
      sptProps: sProps,
      lbsProps: lProps,
    });
  };

  // 1. Inisialisasi Peta Leaflet (Pusat Default: Kabupaten Lampung Utara)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const lampuraCenter: L.LatLngTuple = [-4.8500, 104.7500];
    const map = L.map(mapContainerRef.current, {
      center: lampuraCenter,
      zoom: 10.5,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

    surveyMarkersLayerRef.current = L.layerGroup().addTo(map);
    userLocationLayerRef.current = L.layerGroup().addTo(map);
    pickedMarkerLayerRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (isPickingManualLocationRef.current) {
        onMapClickCoordinatesRef.current?.([lat, lng]);
        return;
      }

      onMapClickCoordinatesRef.current?.([lat, lng]);

      const gData = geoJsonDataRef.current;
      if (gData) {
        const kec = findKecamatanByPoint(lat, lng, gData);
        if (kec) {
          onKecamatanDetectedRef.current?.(kec.nama);

          if (onPolygonSelectRef.current) {
            const feat = gData.features?.find(
              (f: any) => f.properties?.KECAMATAN?.toUpperCase() === kec.nama.toUpperCase()
            );
            if (feat) {
              triggerPolygonSelect(lat, lng, 'rekomendasi_padi', feat.properties);
            }
          }
        } else {
          // Klik di luar batas administrasi Lampung Utara: batalkan seleksi poligon aktif (Deselect)
          onKecamatanDetectedRef.current?.('');
          onPolygonSelectRef.current?.(null as any);
        }
      }
    });

    // Kontrol Visibilitas Label Berdasarkan Level Zoom
    const updateZoomClass = () => {
      if (!mapContainerRef.current) return;
      const z = map.getZoom();
      if (z < 11) {
        mapContainerRef.current.classList.add('map-zoom-low');
      } else {
        mapContainerRef.current.classList.remove('map-zoom-low');
      }
    };

    map.on('zoomend', updateZoomClass);
    map.on('zoom', updateZoomClass);
    updateZoomClass();

    mapInstanceRef.current = map;
    (window as any)._leafletMapInstance = map;

    return () => {
      (window as any)._leafletMapInstance = null;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Pusat Ulang ke Lokasi Pengguna jika Trigger Dipicu
  useEffect(() => {
    if (centerTrigger > 0 && mapInstanceRef.current) {
      if (userLocation) {
        mapInstanceRef.current.flyTo(userLocation, 15, { animate: true, duration: 1.2 });
      } else {
        mapInstanceRef.current.flyTo([-4.8500, 104.7500], 10.5, { animate: true, duration: 1.2 });
      }
    }
  }, [centerTrigger, userLocation]);

  // 3. Update Basemap (OSM vs Google Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let maxZoom = 19;

    if (activeBasemap === 'satellite') {
      url = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      maxZoom = 20;
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: activeBasemap === 'osm' ? ['a', 'b', 'c'] : ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeBasemap]);

  // =========================================================================
  // 4. LAYER OVERLAY 1: BATAS ADMINISTRASI KECAMATAN (HANYA OUTLINE, NO FILL)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (adminBoundariesLayerRef.current) {
      map.removeLayer(adminBoundariesLayerRef.current);
      adminBoundariesLayerRef.current = null;
    }

    const isActive = isLayerActive('batas_desa');
    if (!isActive || !adminBoundariesData) return;

    // Batas Administrasi: Outline tajam kontras tinggi (Chalk white pada dark mode, dark jet slate pada light/satellite)
    // Tanpa fill (fill: false) agar citra satelit dan jalan tidak terhalang
    const layer = L.geoJSON(adminBoundariesData, {
      style: () => ({
        fill: false,
        fillOpacity: 0,
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        weight: 2.2,
        dashArray: '6, 4',
        opacity: 0.95,
        interactive: false, // Tidak mengganggu klik poligon tematik di bawahnya
      }),
    }).addTo(map);

    adminBoundariesLayerRef.current = layer;
  }, [adminBoundariesData, layers, isDarkMode]);

  // =========================================================================
  // 5. LAYER TEMATIK: PETA REKOMENDASI PEMUPUKAN PADI (KECAMATAN)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    const isActive = isLayerActive('inasoilagro');
    if (!isActive) return;

    const layer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const kecName = feature?.properties?.KECAMATAN || '';
        const isSelected = selectedKecamatan && kecName.toUpperCase() === selectedKecamatan.toUpperCase();

        if (isSelected) {
          // Highlight emas menyala berbingkai tegas saat poligon dipilih
          return {
            fillColor: '#f59e0b',
            fillOpacity: isDarkMode ? 0.52 : 0.46,
            color: '#b45309',
            weight: 3.5,
            opacity: 1,
            dashArray: '',
          };
        }

        // Tampilan hijau zamrud serasi brand aplikasi dengan kontras outdoor yang solid
        return {
          fillColor: '#059669',
          fillOpacity: isDarkMode ? 0.26 : 0.22,
          color: isDarkMode ? '#34d399' : '#047857',
          weight: 1.8,
          opacity: 0.9,
        };
      },
      onEachFeature: (feature, polyLayer) => {
        const props = feature.properties || {};
        const kec = props.KECAMATAN || 'Kecamatan';
        const isSelected = selectedKecamatan && kec.toUpperCase() === selectedKecamatan.toUpperCase();

        polyLayer.bindTooltip(kec, {
          permanent: true,
          direction: 'center',
          className: isSelected ? 'kecamatan-map-label active-label' : 'kecamatan-map-label',
        });

        polyLayer.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          
          if (isPickingManualLocationRef.current) {
            onMapClickCoordinatesRef.current?.([lat, lng]);
            return;
          }

          onMapClickCoordinatesRef.current?.([lat, lng]);
          onKecamatanDetectedRef.current?.(kec);

          triggerPolygonSelect(lat, lng, 'rekomendasi_padi', props);
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = layer;
  }, [geoJsonData, layers, selectedKecamatan, isDarkMode]);

  // =========================================================================
  // 6. LAYER TEMATIK: PETA KESESUAIAN LAHAN PADI (BBSDLP)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (kesesuaianLayerRef.current) {
      map.removeLayer(kesesuaianLayerRef.current);
      kesesuaianLayerRef.current = null;
    }

    const isActive = isLayerActive('kesesuaian');
    if (!isActive || !kesesuaianData) return;

    const layer = L.geoJSON(kesesuaianData, {
      style: (feature) => {
        const rawVal = feature?.properties?.[subTypeKesesuaian];
        const kelas = rawVal ? rawVal.trim().split(' ')[0] : 'null';

        let fillColor = '#64748b';
        let fillOpacity = 0.55;
        let color = isDarkMode ? '#0f172a' : '#1e293b';
        let weight = 1.4;
        let dashArray = '';

        if (kelas === 'S1') {
          fillColor = '#15803d'; // Hijau Zamrud Tua (Sangat Sesuai)
        } else if (kelas === 'S2') {
          fillColor = '#65a30d'; // Hijau Limau/Zaitun Cerah (Cukup Sesuai)
        } else if (kelas === 'S3') {
          fillColor = '#d97706'; // Kuning Keemasan / Amber Hangat (Sesuai Marginal)
        } else if (kelas === 'N') {
          fillColor = '#dc2626'; // Merah Tegas (Tidak Sesuai)
        } else {
          // 'null' (Tidak Dinilai): JANGAN PERNAH PUTIH / TRANSPARAN KOSONG!
          // Gunakan slate bertekstur garis putus-putus agar TIDAK AMBIGU dengan latar belakang peta/satelit
          fillColor = '#64748b';
          fillOpacity = isDarkMode ? 0.32 : 0.25;
          color = isDarkMode ? '#94a3b8' : '#475569';
          weight = 1.2;
          dashArray = '4, 4';
        }

        return {
          fillColor,
          fillOpacity,
          color,
          weight,
          dashArray,
          opacity: 0.9,
        };
      },
      onEachFeature: (feature, polyLayer) => {
        const props = feature.properties || {};
        polyLayer.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          if (isPickingManualLocationRef.current) {
            onMapClickCoordinatesRef.current?.([lat, lng]);
            return;
          }

          onMapClickCoordinatesRef.current?.([lat, lng]);
          triggerPolygonSelect(lat, lng, 'kesesuaian', props);
        });
      },
    }).addTo(map);

    kesesuaianLayerRef.current = layer;
  }, [kesesuaianData, subTypeKesesuaian, layers, isDarkMode]);

  // =========================================================================
  // 7. LAYER OVERLAY 2: LAHAN BAKU SAWAH (LBS)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (lbsLayerRef.current) {
      map.removeLayer(lbsLayerRef.current);
      lbsLayerRef.current = null;
    }

    const isActive = isLayerActive('lbs');
    if (!isActive || !lbsData) return;

    const layer = L.geoJSON(lbsData, {
      style: (feature) => {
        const jenis = feature?.properties?.Jenis_Lahan_Sawah;
        const color = getLbsColor(jenis);

        return {
          fillColor: color,
          fillOpacity: 0.72,
          color: '#ffffff', // Garis batas putih bersih (pematang sawah tegas di atas citra satelit)
          weight: 1.2,
          opacity: 0.95,
        };
      },
      onEachFeature: (feature, polyLayer) => {
        const props = feature.properties || {};
        polyLayer.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          if (isPickingManualLocationRef.current) {
            onMapClickCoordinatesRef.current?.([lat, lng]);
            return;
          }

          onMapClickCoordinatesRef.current?.([lat, lng]);
          triggerPolygonSelect(lat, lng, 'lbs', props);
        });
      },
    }).addTo(map);

    lbsLayerRef.current = layer;
  }, [lbsData, layers, isDarkMode]);

  // =========================================================================
  // 8. LAYER TEMATIK: SATUAN PETA TANAH / JENIS TANAH (SPT)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (sptLayerRef.current) {
      map.removeLayer(sptLayerRef.current);
      sptLayerRef.current = null;
    }

    const isActive = isLayerActive('spt');
    if (!isActive || !sptData) return;

    const layer = L.geoJSON(sptData, {
      style: (feature) => {
        const tanah = feature?.properties?.TANAH_1;
        const group = getSoilGroupInfo(tanah);
        const isBuiltOrNull = group.color === '#64748b';

        return {
          fillColor: group.color,
          fillOpacity: isBuiltOrNull ? 0.35 : 0.52,
          color: isDarkMode ? '#0f172a' : '#1e293b',
          weight: 1.5,
          dashArray: isBuiltOrNull ? '4, 4' : '', // Garis putus-putus untuk area terbangun / non-tanah
          opacity: 0.9,
        };
      },
      onEachFeature: (feature, polyLayer) => {
        const props = feature.properties || {};
        polyLayer.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          if (isPickingManualLocationRef.current) {
            onMapClickCoordinatesRef.current?.([lat, lng]);
            return;
          }

          onMapClickCoordinatesRef.current?.([lat, lng]);
          triggerPolygonSelect(lat, lng, 'spt', props);
        });
      },
    }).addTo(map);

    sptLayerRef.current = layer;
  }, [sptData, layers, isDarkMode]);

  // =========================================================================
  // 9. MARKER GPS, PIN MANUAL, & TITIK SURVEI
  // =========================================================================
  useEffect(() => {
    const userGroup = userLocationLayerRef.current;
    if (!userGroup) return;

    userGroup.clearLayers();

    if (gpsActive && userLocation) {
      if (gpsAccuracy && gpsAccuracy < 500) {
        L.circle(userLocation, {
          radius: gpsAccuracy,
          color: '#10b981',
          fillColor: '#34d399',
          fillOpacity: 0.15,
          weight: 1,
        }).addTo(userGroup);
      }

      const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
          <div class="relative flex items-center justify-center w-6 h-6">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <div class="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(userLocation, { icon: userIcon }).addTo(userGroup);
    }
  }, [userLocation, gpsAccuracy, gpsActive]);

  useEffect(() => {
    const pickedGroup = pickedMarkerLayerRef.current;
    if (!pickedGroup) return;

    pickedGroup.clearLayers();

    if (pickedLocation) {
      const pickIcon = L.divIcon({
        className: 'picked-pin-marker',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-9 h-9 rounded-2xl bg-amber-500 text-white shadow-2xl border-2 border-white flex items-center justify-center animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="22" y1="12" x2="18" y2="12"/>
                <line x1="6" y1="12" x2="2" y2="12"/>
                <line x1="12" y1="6" x2="12" y2="2"/>
                <line x1="12" y1="22" x2="12" y2="18"/>
              </svg>
            </div>
            <div class="w-2.5 h-1 bg-amber-900/60 rounded-full blur-[1px]"></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
      });

      L.marker(pickedLocation, { icon: pickIcon }).addTo(pickedGroup);
    }
  }, [pickedLocation]);

  useEffect(() => {
    const surveyGroup = surveyMarkersLayerRef.current;
    if (!surveyGroup) return;

    surveyGroup.clearLayers();

    surveyPoints.forEach((point) => {
      const pinIcon = L.divIcon({
        className: 'survey-pin-marker',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white shadow-xl border-2 border-white flex items-center justify-center hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([point.latitude, point.longitude], { icon: pinIcon }).addTo(surveyGroup);
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectSurveyPoint(point);
      });
    });
  }, [surveyPoints]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {isPickingManualLocation && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-2xl border-2 border-white text-xs flex items-center gap-2 animate-bounce">
          <span>📍 Ketuk bidang sawah di peta untuk menetapkan koordinat</span>
        </div>
      )}
    </div>
  );
};
