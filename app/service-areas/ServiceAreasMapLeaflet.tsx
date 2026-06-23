'use client';
import { useEffect, useRef } from 'react';

const AREAS = [
  { city: 'Cape Coral', lat: 26.5629, lng: -81.9495, primary: true, desc: 'Primary area — full availability' },
  { city: 'Lehigh Acres', lat: 26.6116, lng: -81.6534, primary: true, desc: 'Primary area — full availability' },
  { city: 'Fort Myers', lat: 26.6406, lng: -81.8723, primary: true, desc: 'Primary area — full availability' },
  { city: 'North Fort Myers', lat: 26.6795, lng: -81.8693, primary: false, desc: 'Full availability' },
  { city: 'Buckingham', lat: 26.6734, lng: -81.7568, primary: true, desc: '🏠 Our home base!' },
  { city: 'Estero', lat: 26.4386, lng: -81.8071, primary: false, desc: 'Full availability' },
  { city: 'Bonita Springs', lat: 26.3398, lng: -81.7787, primary: false, desc: 'Available — text to confirm' },
  { city: 'Naples', lat: 26.1420, lng: -81.7948, primary: false, desc: '⚠️ Ask about delivery fee' },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { L: any; }
}

export default function ServiceAreasMapLeaflet() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (mapInstance.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      if (!mapRef.current || !window.L) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        center: [26.55, -81.83],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '\u00a9 <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      AREAS.forEach((area) => {
        const color = area.primary ? '#f5a623' : '#1a6fa8';
        const size = area.city === 'Buckingham' ? 18 : area.primary ? 14 : 10;
        const half = size / 2;

        const iconHtml =
          '<div style="width:' + size + 'px;height:' + size +
          'px;background:' + color +
          ';border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;"></div>';

        const icon = L.divIcon({
          className: '',
          html: iconHtml,
          iconSize: [size, size],
          iconAnchor: [half, half],
        });

        const marker = L.marker([area.lat, area.lng], { icon }).addTo(map);

        const popupHtml =
          '<div style="font-family:sans-serif;min-width:140px;padding:4px 0;">' +
          '<strong style="font-size:14px;color:#0d2340;">' + area.city + '</strong><br/>' +
          '<span style="font-size:12px;color:#666;">' + area.desc + '</span>' +
          '</div>';

        marker.bindPopup(popupHtml);
      });

      L.circle([26.6734, -81.7568], {
        color: '#1a6fa8',
        fillColor: '#1a6fa8',
        fillOpacity: 0.06,
        weight: 2,
        dashArray: '6 4',
        radius: 32000,
      }).addTo(map);
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-2xl overflow-hidden shadow-xl border-2 border-white"
      style={{ height: '420px', zIndex: 0 }}
    />
  );
}
