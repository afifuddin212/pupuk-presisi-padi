import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LayerItem, SurveyPoint, PolygonFeatureInfo } from '../types';
import { findKecamatanByPoint } from '../utils/spatialUtils';

interface MapViewProps {
  geoJsonData: any;
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
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const surveyMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const pickedMarkerLayerRef = useRef<L.LayerGroup | null>(null);

  // Sync ref agar callback Leaflet selalu membaca state terkini (mencegah stale closure)
  const isPickingManualLocationRef = useRef(isPickingManualLocation);
  isPickingManualLocationRef.current = isPickingManualLocation;

  const onPolygonSelectRef = useRef(onPolygonSelect);
  onPolygonSelectRef.current = onPolygonSelect;

  const geoJsonDataRef = useRef(geoJsonData);
  geoJsonDataRef.current = geoJsonData;

  // 1. Inisialisasi Peta Leaflet (Pusat Default: Kabupaten Lampung Utara)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const lampuraCenter: L.LatLngTuple = [-4.8500, 104.7500];
    const map = L.map(mapContainerRef.current, {
      center: lampuraCenter,
      zoom: 10.5,
      zoomControl: false, // Hilangkan default zoom top-right agar TIDAK tumpang tindih
      attributionControl: false,
    });

    // Posisikan Skala di kiri bawah
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

    // Layer Groups
    surveyMarkersLayerRef.current = L.layerGroup().addTo(map);
    userLocationLayerRef.current = L.layerGroup().addTo(map);
    pickedMarkerLayerRef.current = L.layerGroup().addTo(map);

    // Event Klik Kanvas Peta
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      onMapClickCoordinates([lat, lng]);

      const gData = geoJsonDataRef.current;
      if (gData) {
        const kec = findKecamatanByPoint(lat, lng, gData);
        if (kec) {
          onKecamatanDetected(kec.nama);

          // Munculkan pop-up detail jika berada di dalam poligon kecamatan
          if (!isPickingManualLocationRef.current && onPolygonSelectRef.current) {
            const feat = gData.features?.find(
              (f: any) => f.properties?.KECAMATAN?.toUpperCase() === kec.nama.toUpperCase()
            );
            if (feat) {
              onPolygonSelectRef.current({
                kecamatan: kec.nama,
                kabupaten: feat.properties?.KABKOT || 'Lampung Utara',
                provinsi: feat.properties?.PROVINSI || 'Lampung',
                properties: feat.properties,
                coordinates: [lat, lng],
              });
            }
          }
        }
      }
    });

    // Kontrol Visibilitas Label Berdasarkan Level Zoom (Mencegah Label Bertumpuk saat Zoom-Out)
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
        // Fallback: Kembali ke Lampung Utara
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

  // 4. Render & Highlight Poligon Kecamatan (Tanpa Tooltip Kotak Hitam!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    const inasoilagroLayerConfig = layers.find((l) => l.id === 'inasoilagro');
    const isLayerActive = inasoilagroLayerConfig ? inasoilagroLayerConfig.active : true;

    if (!isLayerActive) return;

    const layer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const kecName = feature?.properties?.KECAMATAN || '';
        const isSelected = selectedKecamatan && kecName.toUpperCase() === selectedKecamatan.toUpperCase();

        if (isSelected) {
          // HIGHLIGHT POLIGON TERPILIH: Garis Emas Terang + Fill Kontras Tinggi
          return {
            fillColor: '#facc15',
            fillOpacity: isDarkMode ? 0.45 : 0.4,
            color: '#eab308',
            weight: 3.5,
            opacity: 1,
            dashArray: '',
          };
        }

        // Tampilan Normal Poligon Tematik
        const pStatus = feature?.properties?.P_PADI;
        let fillColor = '#10b981'; // Hijau
        if (pStatus === 'Rendah') fillColor = '#f59e0b'; // Amber
        else if (pStatus === 'Tinggi') fillColor = '#3b82f6'; // Biru

        return {
          fillColor,
          fillOpacity: isDarkMode ? 0.22 : 0.18,
          color: isDarkMode ? '#34d399' : '#059669',
          weight: 1.5,
          opacity: 0.8,
        };
      },
      onEachFeature: (feature, polyLayer) => {
        const props = feature.properties || {};
        const kec = props.KECAMATAN || 'Kecamatan';
        const isSelected = selectedKecamatan && kec.toUpperCase() === selectedKecamatan.toUpperCase();

        // Tampilkan label nama kecamatan di tengah poligon (Outdoor high-contrast)
        polyLayer.bindTooltip(kec, {
          permanent: true,
          direction: 'center',
          className: isSelected ? 'kecamatan-map-label active-label' : 'kecamatan-map-label',
        });

        // Interaksi klik: highlight & pop-up informatif
        polyLayer.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          
          // Berikan koordinat ke handler dan pilih kecamatan
          onMapClickCoordinates([lat, lng]);
          onKecamatanDetected(kec);

          // Munculkan pop-up detail poligon & rekomendasi jika bukan mode ambil manual
          if (!isPickingManualLocationRef.current && onPolygonSelectRef.current) {
            onPolygonSelectRef.current({
              kecamatan: kec,
              kabupaten: props.KABKOT || 'Lampung Utara',
              provinsi: props.PROVINSI || 'Lampung',
              properties: props,
              coordinates: [lat, lng],
            });
          }
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = layer;
  }, [geoJsonData, layers, selectedKecamatan, isDarkMode]);

  // 5. Render Marker Titik Lokasi Pengguna (GPS)
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

  // 6. Render Pin Lokasi yang Sedang Dipilih Manual
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

  // 7. Render Marker Titik Rekomendasi Tersimpan
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
      {/* Banner Notifikasi saat Mode Pemilihan Titik Manual Aktif */}
      {isPickingManualLocation && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-2xl border-2 border-white text-xs flex items-center gap-2 animate-bounce">
          <span>📍 Ketuk bidang sawah di peta untuk menetapkan koordinat</span>
        </div>
      )}
    </div>
  );
};
